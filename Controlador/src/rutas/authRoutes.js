const express = require('express');
const router = express.Router();

const { registrarUsuario, loginUsuario } = require('../controladores/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { guardarResultado, obtenerResultados, obtenerResultadosUsuario } = require('../controladores/resultController');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/results', authenticateToken, guardarResultado);
router.get('/results', authenticateToken, obtenerResultados);
router.get('/results/user', authenticateToken, obtenerResultadosUsuario);

module.exports = router;