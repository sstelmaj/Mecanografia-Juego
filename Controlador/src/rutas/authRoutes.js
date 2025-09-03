const express = require('express');
const router = express.Router();

const { registrarUsuario, loginUsuario } = require('../controladores/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { guardarResultado, obtenerResultados } = require('../controladores/resultController');

console.log({
  registrarUsuario: typeof registrarUsuario,
  loginUsuario: typeof loginUsuario,
  authenticateToken: typeof authenticateToken,
  guardarResultado: typeof guardarResultado,
  obtenerResultados: typeof obtenerResultados
});

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/results', authenticateToken, guardarResultado);
router.get('/results', authenticateToken, obtenerResultados);

module.exports = router;