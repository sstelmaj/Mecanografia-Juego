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

  const empezarJuego = () => {
    if (inputRef.current) inputRef.current.focus();
    setTexto(generarTexto(misPalabrasComunes, 30) + " ");
    setInput("");
    setInputPantalla("");
    setStartTime(null);
    setErrors(0);
    setWpm(0);
    setGameFinished(false);
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
      calcularErrores(input.trim());
      setGameFinished(true);
    }
  }, [input, inputPantalla]);


  useEffect(() => {
    if (startTime && !gameFinished) {
      const intervalo = setInterval(calculateWPM, 500);
      return () => clearInterval(intervalo);
    }
    if (gameFinished) {
      calculateWPM();
    }
  }, [startTime, gameFinished]);

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
  };

  const calculateWPM = () => {
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = (input.trim().split(" ").length) || 1;
      const wpmCalculated = Math.round((wordsTyped - errors) / elapsedMinutes);
      setWpm(wpmCalculated > 0 ? wpmCalculated : 0);
    }
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

  return (
    <main className="h-full max-h-full">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Juego de Mecanografía</h1>
      </div>
      <div>
        <img src="/iconoMecanografia.jpg" alt="icono juego" className="w-24 h-24 rounded-full shadow-md bg-gray-100 mx-auto mb-6 transition-all duration-300 hover:scale-105 fixed top-10 left-10" />
      </div>
      {/* Botón de iniciar sesión fijo arriba a la derecha */}
      <button
        className="fixed top-10 right-10 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        onClick={() => window.location.href = "/Login"}
      >
        Iniciar Sesión
      </button>
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