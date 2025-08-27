const mongoose= require("mongoose")

usuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

mongoose.model('Usuario', usuarioSchema)

module.exports = mongoose.model('Usuario')



