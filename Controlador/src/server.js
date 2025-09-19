require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./rutas/authRoutes'));

// Iniciar servidor después de conectar a MongoDB
const startServer = async () => {
    try {
        await connectDB(); // Espera la conexión a MongoDB
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port} y conectado a MongoDB`);
        });
    } catch (err) {
        console.error('Error al iniciar el servidor:', {
            message: err.message,
            name: err.name,
            code: err.code,
            stack: err.stack,
        });
        process.exit(1); // Termina el proceso si falla la conexión
    }
};

startServer();