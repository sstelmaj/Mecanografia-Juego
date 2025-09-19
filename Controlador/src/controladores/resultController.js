const e = require("express");
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

        // actualizo el top 5 si se ingresa un nuevo resultado que entre en el top
        const top5Existente = await Resultado.find({ user: req.usuario.id }).sort({ wpm: -1, errorCount: 1 }).limit(5);
        if (top5Existente.length < 5 || nuevoResultado.wpm > top5Existente[4]?.wpm || 
            (nuevoResultado.wpm === top5Existente[4]?.wpm && nuevoResultado.errorCount < top5Existente[4]?.errorCount)) {
            const top5Actualizado = await Resultado.find({ user: req.usuario.id }).sort({ wpm: -1, errorCount: 1 }).limit(5);
            //await Resultado.deleteMany({ user: req.usuario.id, _id: { $nin: top5Actualizado.map(r => r._id) } });
        }

        // mantengo solo los últimos 10 resultados en el historial, evitando eliminar los que estén en el top 5
        const historialActualizado = await Resultado.find({ user: req.usuario.id }).sort({ timestamp: -1 }).limit(10);
        if (historialActualizado.length > 10) {
            const top5IDs = (await Resultado.find({ user: req.usuario.id }).sort({ wpm: -1, errorCount: 1 }).limit(5)).map(r => r._id);
            const idsAConservar = historialActualizado.slice(0, 10).map(r => r._id); // los 10 mas recientes
            const allIDsToKeep = [...new Set([...top5IDs, ...idsAConservar])]; // maximo 15 (10 del historial y 5 del top)
            await Resultado.deleteMany({ user: req.usuario.id, _id: { $nin: allIDsToKeep } });
        }

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

        const top5 = await Resultado.find({ user: userID })
        .sort({ wpm: -1, errorCount: 1 })
        .limit(5)
        .populate('user', 'username email');

        const historial = await Resultado.find({ user: userID })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('user', 'username email');

        if (top5.length === 0) {
            return res.status(404).send({ message: 'No se encontraron resultados para este usuario' });
        }

        res.status(200).send({
            message: 'Resultados del usuario obtenidos',
            top5,
            historial 
        });

    } catch (err) {
        res.status(500).send({ message: 'Error al obtener los resultados del usuario' }); 
    }
}

module.exports = { guardarResultado, obtenerResultados, obtenerResultadosUsuario };
