const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Servidor escuchando en el puerto ${process.env.PORT || 5000} y conectado a MongoDB` );
    } catch (err) {
        console.error(`Error conectando a MongoDB: ${err.message}`, err);
        process.exit(1);
    }
}

module.exports = connectDB; 