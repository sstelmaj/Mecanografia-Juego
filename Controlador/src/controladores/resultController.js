const Resultado = require("../modelos/resultado");

async function guardarResultado(req, res) {
    if (!req.body.user || !req.body.wpm || !req.body.errors) {
        return res.status(400).send({ message: 'Faltan datos' });
    }
    try {
        const nuevoResultado = new Resultado(req.body);
        await nuevoResultado.save();
        res.status(201).send({ message: 'Resultado guardado exitosamente', resultado: nuevoResultado });
    }
    catch (err) {
        res.status(500).send(err.message);
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

module.exports = { guardarResultado, obtenerResultados };
