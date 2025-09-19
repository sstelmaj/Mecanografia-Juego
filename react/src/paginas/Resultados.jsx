import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

export default function Resultados() {
  const [results, setResults] = useState([]);
  const [top5, setTop5] = useState([]);
  const [historial, setHistorial] = useState([]);


  const [username, setUsername] = useState(localStorage.getItem("username") || "Usuario no reconocido");
  const navigate = useNavigate();

  useEffect(() => {

    const checkTokenAndFetchResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para ver tus resultados');
        navigate('/login');
        return;
      }

      // Verificar expiración del token
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            navigate('/login');
            return;
            }
        } catch (error) {
            console.error('Error decodificando token:', error);
            alert('Error con la sesión. Inicia sesión nuevamente.');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/results/user`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            });
            const data = await response.json();
            if (!response.ok) {
            return;
            }
            setTop5(data.top5);
            setHistorial(data.historial); 
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Error al obtener los resultados');
        }
    };
    checkTokenAndFetchResults();
  }, [navigate]);

  return (
    <div className="bg-[rgba(72,86,82,255)] shadow-2xl rounded-2xl p-10 w-full max-w-md mx-auto">
        <div>
        <a href="/">
            <img 
            src="/iconoMecanografia.jpg" 
            alt="icono juego" 
            className="w-24 h-24 rounded-full shadow-md bg-gray-100 mx-auto mb-6 transition-all duration-300 hover:scale-105 fixed top-10 left-10" 
            />
        </a>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Resultados</h1>
        <p className="mb-2 text-white">Resultados de {username}:</p>

        {/* Tabla para el Top 5 */}
        <h2 className="text-xl font-bold mt-4 mb-2 text-white">Top 5 Mejores Resultados</h2>
        {top5 && top5.length > 0 ? (
        <table className="w-full mt-2 text-center text-white">
            <thead>
            <tr className="bg-gray-700">
                <th className="p-2">Fecha</th>
                <th className="p-2">WPM</th>
                <th className="p-2">Errores</th>
            </tr>
            </thead>
            <tbody>
            {top5.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'}>
                <td className="p-2">{new Date(result.timestamp).toLocaleDateString()}</td>
                <td className="p-2">{result.wpm}</td>
                <td className="p-2">{result.errorCount}</td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : (
        <p className="mt-2 text-center text-white">Sin top 5 disponible.</p>
        )}

        <h2 className="text-xl font-bold mt-4 mb-2 text-white">Últimas 10 Partidas</h2>
        {historial && historial.length > 0 ? (
        <table className="w-full mt-2 text-center text-white">
            <thead>
            <tr className="bg-gray-700">
                <th className="p-2">Fecha</th>
                <th className="p-2">WPM</th>
                <th className="p-2">Errores</th>
            </tr>
            </thead>
            <tbody>
            {historial.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'}>
                <td className="p-2">{new Date(result.timestamp).toLocaleDateString()}</td>
                <td className="p-2">{result.wpm}</td>
                <td className="p-2">{result.errorCount}</td>
                </tr>
            ))}
            </tbody>
        </table>
        ) : (
        <p className="mt-2 text-center text-white">Sin historial disponible.</p>
        )}

        <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
        onClick={() => navigate("/")}
        >
        Volver al Inicio
        </button>
    </div>
  );
}