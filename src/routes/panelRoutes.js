const express = require('express');
const router = express.Router();
const path = require('path');

function verificarAdmin(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.rol === 'admin') {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', verificarAdmin, (req, res) => {
  res.render('panelAdmin'); // Renderiza la vista principal del panel
});

module.exports = router;
