// src/routes/usuariosRoutes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// === Vista principal (CRUD de usuarios) ===
router.get('/vista', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión');
    conn.query('SELECT * FROM usuarios', (err, rows) => {
      if (err) return res.status(500).send('Error al obtener usuarios');
      res.render('usuarios', { usuarios: rows });
    });
  });
});

// === Crear usuario ===
router.post('/', usuariosController.crear);

// === Editar usuario (mostrar formulario) ===
router.get('/editar/:id', usuariosController.editarForm);

// === Actualizar usuario (guardar cambios) ===
router.post('/editar/:id', usuariosController.actualizar);

// === Eliminar usuario ===
router.get('/eliminar/:id', usuariosController.eliminar);

module.exports = router;
