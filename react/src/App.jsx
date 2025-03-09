import { useState, useEffect } from "react";
import palabrasComunes from "./modelo/palabras.js"; 

const misPalabrasComunes = palabrasComunes;

// generacion de texto
const generarTexto = (listaPalabras, count) => {
  const shuffled = [...listaPalabras].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
};

export default function TypingGame() {
  const [texto, setTexto] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [inputPantalla, setInputPantalla] = useState("");
  const [gameFinished, setGameFinished] = useState(false);


  // Inicio el juego reiniciando valores
  const empezarJuego = (listaPalabras) => {
    setTexto(generarTexto(listaPalabras, 30) + " ");  
    setInput("");  
    setStartTime(null);  
    setErrors(0);  
    setWpm(0);  
  };

  useEffect(() => {
    const textoPalabras = texto.trim().split(" ");
    const inputPalabras = input.trim().split(" ");
    if (inputPalabras.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
    if (input.length > 0 && textoPalabras.length === inputPalabras.length) {
      console.log("termino el juego");
      calcularErrores(input);
      setGameFinished(true); // Marcar el juego como terminado
    }
  }, [input]);

  useEffect(() => {
    if (gameFinished) {
      console.log("haciendo calculo WPM");
      calculateWPM();  // Calcular WPM solo cuando el juego termina
    }
  }, [gameFinished]);

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.includes(" ")) {
      setInput(input + value);
      setInputPantalla("");
      //errorPalabra(value);
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

    errorCount += Math.max(0, textoPalabras.length - inputPalabras.length);

    setErrors(errorCount);
  };

  const calculateWPM = () => {
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = texto.split(" ").length;

      const wpmCalculated = Math.round((wordsTyped - errors) / elapsedMinutes);
      console.log(wpmCalculated);
      console.log(wordsTyped);
      console.log(errors);
      setWpm(wpmCalculated);
    }
  };

  const getHighlightedText = () => {
    return texto.split(" ").map((word, index) => {
      const userWord = input.split(" ")[index] || "";
      const isCorrect = userWord === word;
      const colorClass = isCorrect ? "text-green-500" : (userWord && userWord !== word ? "text-red-500" : "");
      return (
        <span key={index} className={`${colorClass} mr-2`}>
          {word} 
        </span>
      );
    });
  };

  return (
    <main className="h-full max-h-full">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Juego de Mecanografía</h1>
      </div>
      <div className="flex flex-col justify-center align-middle items-center p-4 h-full max-h-full mx-auto">
        <div className="mb-2 border-b pb-2">
          {getHighlightedText()}
        </div>

        <input
          type="text"
          value={inputPantalla}
          onChange={handleChange}
          className="border p-2 w-full max-w-lg"
          placeholder="Escribe aquí..."
        />

        <p className="mt-4">Errores: {errors}</p>
        <p>Velocidad: {wpm} WPM</p>
        <button onClick={() => empezarJuego(misPalabrasComunes)}>
          Empezar
        </button>
      </div>
    </main>
  );
}