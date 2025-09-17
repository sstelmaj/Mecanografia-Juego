const mongoose = require('mongoose');

resultadoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    wpm: { type: Number, required: true },
    errorCount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
})

mongoose.model('Resultado', resultadoSchema)
const resultado = mongoose.model('Resultado')

module.exports = resultado