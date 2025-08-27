const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../modelos/usuario');

async function registrarUsuario(req, res) {
    
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'Faltan campos obligatorios' });
    }

    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        const nuevoUsuario = new Usuario(req.body);
        nuevoUsuario.password = hashedPassword;
        await nuevoUsuario.save();
        res.status(201).send({ message: 'Usuario registrado exitosamente', usuario: {username: nuevoUsuario.username, email: nuevoUsuario.email} });
    }
    catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).send({ message: 'El email ya está en uso' });
        }
        res.status(500).send(err.message);
    }
}  //////// ME QUEDE ACA

function loginUsuario(req, res) {
    const Usuario = mongoose.model('Usuario');
    Usuario.findOne({ email: req.body.email })
        .then(usuario => {
            if (!usuario || !bcrypt.compareSync(req.body.password, usuario.password)) {
                return res.status(401).send({ message: 'Credenciales inválidas' });
            }
            res.send({ message: 'Login exitoso', usuario });
        })
        .catch(err => res.status(500).send(err));
}

module.exports = { registrarUsuario, loginUsuario };

