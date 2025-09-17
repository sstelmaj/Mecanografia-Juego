const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (token.length < 50) return res.status(401).send({ message: 'Token demasiado corto' });

    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send({ message: 'Formato de Token invalido' });

    if (!token) return res.status(401).send({ message: 'Token no proporcionado' });

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido en las variables de entorno');
        return res.status(500).send({ message: 'Error del servidor' });
    }

    try {
        console.log('Verificando token:', token);
        const usuario = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Usuario decodificado:", usuario);
        if (!usuario?.id) return res.status(403).send({ message: 'Token sin ID valido' });
        req.usuario = usuario;
        next();

    } catch (err) {
        console.log("Error de verificación:", err);
        if (err.name === 'TokenExpiredError') return res.status(403).send({ message: 'Token expirado' });
        if (err.name === 'JsonWebTokenError') return res.status(403).send({ message: 'Token invalido' });
        if (err.name === 'NotBeforeError') return res.status(403).send({ message: 'Token no válido aún' });
        return res.status(500).send({ message: 'Error al verificar el token'}); 
    }
    
}

module.exports = { authenticateToken };