const Resultado = require("../modelos/resultado");

async function guardarResultado(req, res) {
    if (typeof req.body.wpm === 'undefined' || typeof req.body.errorCount === 'undefined') {
        return res.status(400).send({ message: 'Faltan datos', received: req.body });
    }
    try {
        const nuevoResultado = new Resultado({
            user: req.usuario.id,
            wpm: req.body.wpm,
            errorCount: req.body.errorCount,
        });
        await nuevoResultado.save();
        res.status(201).send({ message: 'Resultado guardado exitosamente', resultado: nuevoResultado });
    } catch (err) {
        res.status(500).send({ message: 'Error al guardar el resultado', error: err.message });
    }
}

async function obtenerResultados(req, res) {
    try {
        const resultados = await Resultado.find().populate('user', 'username email').sort({ timestamp: -1 });
        res.send(resultados);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

async function obtenerResultadosUsuario(req, res) {
    try {
        const userID = req.usuario.id;
        const resultados = await Resultado.find({ user: userID }).populate('user', 'username email').sort({ timestamp: -1 });
        if (resultados.length === 0) {
            return res.status(404).send({ message: 'No se encontraron resultados para este usuario' });
        }
        res.send({message: 'Resultados del usuario obtenidos', resultados });
    } catch (err) {
        res.status(500).send({ message: 'Error al obtener los resultados del usuario' }); 
    }
}

module.exports = { guardarResultado, obtenerResultados, obtenerResultadosUsuario };
