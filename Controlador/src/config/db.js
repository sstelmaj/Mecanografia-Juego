const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
            heartbeatFrequencyMS: 10000,
        });
        console.log('Conectado exitosamente a MongoDB');
    } catch (err) {
        console.error(`Error conectando a MongoDB: ${err.message}`, {
            name: err.name,
            code: err.code,
            stack: err.stack,
        });
        process.exit(1);
    }
};

module.exports = connectDB;