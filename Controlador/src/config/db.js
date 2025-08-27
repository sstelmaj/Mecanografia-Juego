const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB: ${con.connection.host}');
    } catch (err) {
        console.error('Error conectando a MongoDB: ${error.message}', err);
        process.exit(1);
    }
}

module.exports = connectDB; 