const express = require('express');
const router = express.Router();

function verificarCliente(req, res, next) {
  if (!req.session.usuario || req.session.usuario.rol !== 'cliente') {
    return res.redirect('/login');
  }
  next();
}

router.get('/panel', verificarCliente, (req, res) => {
  res.render('clienteDashboard');
});

router.get('/inicio', verificarCliente, (req, res) => {
  res.render('clienteInicio');
});

router.get('/servicios', verificarCliente, (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión');
    conn.query(`
      SELECT s.*, 
      (SELECT ruta_imagen FROM imagenes_servicio WHERE servicio_id = s.id LIMIT 1) AS imagen_principal
      FROM servicios s
    `, (err, rows) => {
      if (err) return res.status(500).send('Error al obtener servicios');
      res.render('clienteServicios', { servicios: rows });
    });
  });
});


router.get('/carrito', verificarCliente, (req, res) => {
  const carrito = req.session.carrito || [];
  res.render('clienteCarrito', { carrito });
});

router.post('/carrito/agregar', verificarCliente, (req, res) => {
  const { servicio_id } = req.body;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión');

    conn.query('SELECT * FROM servicios WHERE id = ?', [servicio_id], (err, rows) => {
      if (err || rows.length === 0) return res.status(404).send('Servicio no encontrado');

      const servicio = rows[0];
      if (!req.session.carrito) req.session.carrito = [];

      // Evitar duplicados
      const existe = req.session.carrito.find(item => item.id === servicio.id);
      if (!existe) {
        req.session.carrito.push(servicio);
      }

      res.redirect('/cliente/carrito');
    });
  });
});

router.get('/carrito/eliminar/:id', verificarCliente, (req, res) => {
  const id = parseInt(req.params.id);
  req.session.carrito = (req.session.carrito || []).filter(item => item.id !== id);
  res.redirect('/cliente/carrito');
});

router.get('/ordenes', verificarCliente, (req, res) => {
  const usuarioId = req.session.usuario.id;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión');
    conn.query(`
      SELECT o.*, s.nombre AS servicio, s.precio 
      FROM ordenes o
      JOIN servicios s ON o.servicio_id = s.id
      WHERE o.usuario_id = ?
    `, [usuarioId], (err, rows) => {
      if (err) return res.status(500).send('Error al obtener órdenes');
      res.render('clienteOrdenes', { ordenes: rows });
    });
  });
});

// === PAGAR ===
router.post('/pagar', verificarCliente, (req, res) => {
  const usuarioId = req.session.usuario.id;
  const carrito = req.session.carrito || [];
  const fecha = new Date();
  const fechaStr = fecha.toISOString().split('T')[0];

  if (carrito.length === 0) return res.redirect('/cliente/carrito');

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión');

    carrito.forEach(servicio => {
      conn.query(
        'INSERT INTO ordenes (usuario_id, servicio_id, fecha, estado) VALUES (?, ?, ?, "pendiente")',
        [usuarioId, servicio.id, fechaStr],
        (err, result) => {
          if (!err) {
            const ordenId = result.insertId;
            conn.query(
              'INSERT INTO pagos (orden_id, monto, fecha_pago, metodo_pago) VALUES (?, ?, ?, "tarjeta")',
              [ordenId, servicio.precio, fechaStr]
            );
          }
        }
      );
    });

    req.session.carrito = [];

    res.redirect('/cliente/carrito?pago=exito');
  });
});


module.exports = router;
