const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario');

async function registrarUsuario(req, res) {
    
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'Faltan campos obligatorios' });
    }

    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).send({ message: 'Usuario registrado exitosamente', usuario: {username: nuevoUsuario.username, email: nuevoUsuario.email} });
    }
    catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).send({ message: 'El email ya está en uso' });
        }
        res.status(500).send({ message: 'Error interno del servidor' });
    }
}  

async function loginUsuario(req, res) {
    try {

        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ message: 'Faltan campos obligatorios' });
        }

        const usuario = await Usuario.findOne({ email: req.body.email })
        if (!usuario || !(await bcrypt.compare(req.body.password, usuario.password))) {
            return res.status(401).send({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Token generado:", token);
        res.send({ 
            message: 'Login exitoso',
            token, 
            usuario: {
                username: usuario.username, 
                email: usuario.email 
            }
        });
    }
        
    catch (err){
        if (err.name === 'CastError') {
             return res.status(400).send({ message: 'Email inválido' }); 
        }
        res.status(500).send({ message: 'Error interno del servidor' });
    };
}

module.exports = { registrarUsuario, loginUsuario };

