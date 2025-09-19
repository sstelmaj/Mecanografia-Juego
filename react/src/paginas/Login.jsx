import React, { useEffect, useState } from "react";
import { data, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  
  const location = useLocation();

  useEffect(() => { 
    if (location.state?.message && !message) {
     setMessage(location.state.message); 
    } 
  }, [location]);

  useEffect(() => { 
    if (message && message !== "Error en el login" && message !== "Error de conexión. Verifica la consola para más detalles." && message !== "Credenciales inválidas") { 
      document.getElementById("login-message")?.classList.add("text-green-700");
      document.getElementById("login-message")?.classList.remove("text-red-800"); 
    } else {
      document.getElementById("login-message")?.classList.add("text-red-800");
      document.getElementById("login-message")?.classList.remove("text-green-700"); 
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json(); 
      console.log("Response status:", response.status, "Data:", data);

      if (response.ok) {
        setMessage(data.message || "Login exitoso");
        localStorage.setItem("username", data.usuario.username);
        localStorage.setItem("email", data.usuario.email);
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setMessage(data.message || "Error en el login");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Error de conexión. Verifica la consola para más detalles.");
    }
  };

  return (
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md items-center justify-center mx-auto">
        <div>
          <a href="/">
            <img 
              src="/iconoMecanografia.jpg" alt="icono juego" className="w-24 h-24 rounded-full shadow-md bg-gray-100 mx-auto mb-6 transition-all duration-300 hover:scale-105 fixed top-10 left-10" 
            />
          </a>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setMessage(null)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none text-black focus:ring-[rgba(72,86,82,1)]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setMessage(null)}
              placeholder="********"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition text-black focus:ring-[rgba(72,86,82,1)]"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 appearance-none border border-gray-400 rounded checked:bg-[rgba(72,86,82,1)] checked:border-[rgba(72,86,82,1)] hover:border-[rgba(72,86,82,1)]"  />
              <span className="text-black">Recordarme</span>
            </label>
          </div>

          {message && <p id="login-message" className="text-center text-red-800">{message}</p>}

          <button
            type="submit"
            className="w-full text-white font-medium py-2 rounded-lg shadowtransition"
          >
            Ingresar
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-[rgba(72,86,82,255)] text-white font-medium py-2 rounded-lg shadow transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.35 11.1h-9.36v2.91h5.49c-.23 1.25-.93 2.32-1.99 3.04l3.22 2.5c1.88-1.73 2.97-4.28 2.97-7.28 0-.56-.05-1.1-.13-1.62z" />
            <path d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.22-2.5c-.91.61-2.08.98-3.41.98-2.63 0-4.85-1.77-5.64-4.15H3.88v2.61C5.54 19.75 8.52 22 12 22z" />
            <path d="M6.36 13.91c-.2-.59-.31-1.21-.31-1.91s.11-1.32.31-1.91V7.48H3.88A9.946 9.946 0 002 12c0 1.59.38 3.09 1.06 4.42l3.3-2.51z" />
            <path d="M12 6.5c1.41 0 2.67.48 3.66 1.43l2.73-2.73C16.97 3.89 14.7 3 12 3 8.52 3 5.54 5.25 3.88 8.09l3.3 2.51c.79-2.38 3.01-4.15 5.64-4.15z" />
          </svg>
          Iniciar con Google
        </button>
        <a
          href="/register"
          className="text-gray-700 flex items-center justify-center text-sm mt-2 hover:text-black underline"
        >
          CREAR CUENTA
        </a>
      </div>
  );
}