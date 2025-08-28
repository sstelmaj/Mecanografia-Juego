import React from "react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
                Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black"
              required
            />
          </div>

          {/* Remember me & forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 text-blue-500 border-gray-300 rounded" />
              <span className="text-gray-600">Recordarme</span>
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Ingresar
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Botón alternativo */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-medium py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21.35 11.1h-9.36v2.91h5.49c-.23 1.25-.93 2.32-1.99 3.04l3.22 2.5c1.88-1.73 2.97-4.28 2.97-7.28 0-.56-.05-1.1-.13-1.62z" />
            <path d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.22-2.5c-.91.61-2.08.98-3.41.98-2.63 0-4.85-1.77-5.64-4.15H3.88v2.61C5.54 19.75 8.52 22 12 22z" />
            <path d="M6.36 13.91c-.2-.59-.31-1.21-.31-1.91s.11-1.32.31-1.91V7.48H3.88A9.946 9.946 0 002 12c0 1.59.38 3.09 1.06 4.42l3.3-2.51z" />
            <path d="M12 6.5c1.41 0 2.67.48 3.66 1.43l2.73-2.73C16.97 3.89 14.7 3 12 3 8.52 3 5.54 5.25 3.88 8.09l3.3 2.51c.79-2.38 3.01-4.15 5.64-4.15z" />
          </svg>
          Iniciar con Google
        </button>
      </div>
    </div>
  );
}