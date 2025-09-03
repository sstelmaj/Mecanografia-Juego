const mongoose= require("mongoose")

usuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

mongoose.model('Usuario', usuarioSchema)
const usuario = mongoose.model('Usuario')

module.exports = usuario