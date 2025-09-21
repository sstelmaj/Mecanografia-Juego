import { useState, useEffect, useRef } from "react";
import palabrasComunes from "../modelo/palabras";

const misPalabrasComunes = palabrasComunes;

const generarTexto = (listaPalabras, count) => {
  const shuffled = [...listaPalabras].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
};

export default function TypingGame() {
  const [texto, setTexto] = useState("");
  const [input, setInput] = useState("");
  const [inputPantalla, setInputPantalla] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const inputRef = useRef(null);

  //datos del usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const enviarResultado = async (wpm, errorCount) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para guardar tus resultados');
      return;
    }
    const payload = { wpm, errorCount };
    const bodyString = JSON.stringify(payload);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/results`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: bodyString,
      });
      const data = await response.json();
      if (response.status !== 201) {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error al guardar el resultado');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      if (localStorage.getItem("username")) {
        const storedUsername = localStorage.getItem("username");
        const storedEmail = localStorage.getItem("email");
        setIsAuthenticated(true);
        setUsername(storedUsername || "Usuario no reconocido");
        setEmail(storedEmail || "Email no reconocido");
      }
    }
  }, []);

  const empezarJuego = () => {
    if (inputRef.current) inputRef.current.focus();
    setTexto(generarTexto(misPalabrasComunes, 30) + " ");
    setGameFinished(false);
    setInput("");
    setInputPantalla("");
    setStartTime(null);
    setErrors(0);
    setWpm(0);
  };

  useEffect(() => {
    if (!startTime && (inputPantalla.length > 0 || input.length > 0)) {
      setStartTime(Date.now());
    }

    const textoPalabras = texto.trim().split(" ");
    const inputPalabras = (input + inputPantalla).trim().split(" ");

    if (inputPalabras.length === textoPalabras.length && 
        inputPantalla.trim() === "" && 
        !gameFinished) {
      setGameFinished(true);
    }
  }, [input, inputPantalla]);

  useEffect(() => {
    if (gameFinished && startTime) {
      const errorCount = calcularErrores(input.trim());
      const wpmCalculated = calculateWPM(errorCount);
      enviarResultado(wpmCalculated, errorCount);
    }
  }, [gameFinished, startTime]);

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.endsWith(" ")) {
      setInput(input + value.trim() + " ");
      setInputPantalla("");
    } else {
      setInputPantalla(value);
    }
  };

  const calcularErrores = (value) => {
    const textoPalabras = texto.trim().split(" ");
    const inputPalabras = value.trim().split(" ");

    let errorCount = 0;
    for (let i = 0; i < Math.min(textoPalabras.length, inputPalabras.length); i++) {
      if (textoPalabras[i] !== inputPalabras[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    return errorCount;
  };

  const calculateWPM = (errores) => {
  if (startTime) {
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = (input.trim().split(" ").length) || 1;
    const wpmCalculated = Math.round((wordsTyped - errores) / elapsedMinutes);
    setWpm(wpmCalculated > 0 ? wpmCalculated : 0);
    return wpmCalculated > 0 ? wpmCalculated : 0;
  }
  return 0;
};

  const getHighlightedText = () => {
    const allInput = (input + inputPantalla).trim().split(" ");
    const textoPalabras = texto.split(" ");

    return textoPalabras.map((word, index) => {
      const userWord = allInput[index] || "";
      let colorClass = "";

      if (index < allInput.length - (inputPantalla ? 1 : 0)) {
        colorClass = userWord === word ? "text-green-500" : "text-red-500";
        return (
          <>
            <span key={index} className={colorClass}>
              {word}
            </span>{" "}
          </>
        );
      } 

      else if (index === allInput.length - (inputPantalla ? 1 : 0) && inputPantalla) {
        return (
          <>
            <span key={index}>
              {word.split("").map((char, charIndex) => {
                const userChar = inputPantalla[charIndex];
                let charColor = "";
                if (userChar !== undefined) {
                  charColor = userChar === char ? "text-green-500" : "text-red-500";
                }
                return (
                  <span key={charIndex} className={charColor}>
                    {char}
                  </span>
                );
              })}
            </span>{" "}
          </>
        );
      } 
      // esto es la palabra actual que todavia no tiene entrada
      else {
        return (
          <>
            <span key={index}>
              {word}
            </span>{" "}
          </>
        );
      }
    });
  };

  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername("");
    setEmail("");
    setShowModal(false);
    window.location.href = "/Login";
  };

  const handleResultados = () => {
    window.location.href = "/resultados";
  };

  return (
    <main className="h-full max-h-full">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Juego de Mecanografía</h1>
      </div>
      <div>
        <img src="/iconoMecanografia.jpg" alt="icono juego" className="w-24 h-24 rounded-full shadow-md bg-gray-100 mx-auto mb-6 transition-all duration-300 hover:scale-105 fixed top-10 left-10" />
      </div>
      {isAuthenticated ? (
        <div className="fixed top-10 right-10 bg-gray-200 text-gray-800 px-4 py-2 rounded shadow flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              d="M4 20c0-4 4-6 8-6s8 2 8 6"
            />
          </svg>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setShowModal((prev) => !prev)}
          >
            {username}
          </span>
          {showModal && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded shadow-lg p-4 min-w-[200px] z-50">
              <h2 className="text-lg font-bold mb-3">{username}</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full mb-2"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
              <button 
                className="text-white px-4 py-2 rounded hover:bg-red-600 transition w-full mb-2"
                onClick={handleResultados}
              >
                Resultados
              </button>
              <button
                className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-400 transition w-full mb-2 mt-10"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
              
            </div>
          )}
        </div>
      ) : (
        <button
          className="fixed top-10 right-10 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          onClick={() => window.location.href = "/Login"}
        >
          Iniciar Sesión
        </button>
      )}
      <div className="flex flex-col justify-center align-middle items-center p-4 h-full max-h-full mx-auto">
        <div className="mb-2 border-b pb-2 w-full max-w-lg mx-auto whitespace-pre-wrap break-normal leading-relaxed text-justify">
          {getHighlightedText()}
        </div>

        <input
          ref={inputRef} 
          type="text"
          value={inputPantalla}
          onChange={handleChange}
          disabled={gameFinished}
          className="border p-2 w-full max-w-lg"
          placeholder="Escribe aquí..."
        />

        <p className="mt-4">Errores: {errors}</p>
        <p>Velocidad: {wpm} WPM</p>
        <button onClick={empezarJuego} className="mt-4 p-2 border rounded">
          Empezar
        </button>
      </div>
    </main>
  ); 

}
