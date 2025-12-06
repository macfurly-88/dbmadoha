const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;

// === VISTA DE LOGIN/REGISTRO ===
router.get(['/login', '/'], (req, res) => {
  res.render('login', { error: null });
});

// === LOGIN ===
router.post('/login', (req, res) => {
  const { correo, password } = req.body;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión a la base de datos');

    conn.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, rows) => {
      if (err) return res.status(500).send('Error al consultar usuario');
      if (rows.length === 0)
        return res.render('login', { error: 'Usuario no encontrado' });

      const usuario = rows[0];

      bcrypt.compare(password, usuario.password, (err, isMatch) => {
        if (err) return res.status(500).send('Error al verificar contraseña');
        if (!isMatch)
          return res.render('login', { error: 'Contraseña incorrecta' });

        // Guardar sesión (coherente con clienteRoutes)
        req.session.usuario = {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        };


        // Redirigir según el rol
        if (usuario.rol === 'admin') {
          res.redirect('/panel');
        } else {
          res.redirect('/cliente/panel');
        }
      });
    });
  });
});

// === REGISTRO DE CLIENTE ===
router.post('/registrar', (req, res) => {
  const { nombre, correo, password, empresa } = req.body;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).send('Error al encriptar la contraseña');

    const nuevoUsuario = {
      nombre,
      correo,
      password: hashedPassword,
      empresa,
      rol: 'cliente'
    };

    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');

      conn.query('INSERT INTO usuarios SET ?', nuevoUsuario, (err) => {
        if (err) {
          console.error(' Error al registrar usuario:', err);
          return res.render('login', { error: 'El correo ya está registrado' });
        }

        res.render('login', { error: 'Registro exitoso. Ahora inicia sesión.' });
      });
    });
  });
});

// === LOGOUT ===
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
