module.exports = {
  listar: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión a la base de datos');

      const sql = `
        SELECT p.*, o.id AS orden_id, u.nombre AS usuario, s.nombre AS servicio
        FROM pagos p
        JOIN ordenes o ON p.orden_id = o.id
        JOIN usuarios u ON o.usuario_id = u.id
        JOIN servicios s ON o.servicio_id = s.id
        ORDER BY p.id DESC
      `;

      conn.query(sql, (err, rows) => {
        if (err) return res.status(500).send('Error al obtener pagos');

        conn.query('SELECT id FROM ordenes', (err2, ordenes) => {
          if (err2) return res.status(500).send('Error al obtener órdenes');
          res.render('pagos', { pagos: rows, ordenes });
        });
      });
    });
  },

  crear: (req, res) => {
    const { orden_id, monto, fecha_pago, metodo_pago } = req.body;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      const nuevo = { orden_id, monto, fecha_pago, metodo_pago };
      conn.query('INSERT INTO pagos SET ?', nuevo, (err) => {
        if (err) return res.status(500).send('Error al crear pago');
        res.redirect('/pagos/vista');
      });
    });
  },

  editarForm: (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      conn.query('SELECT * FROM pagos WHERE id = ?', [id], (err, rows) => {
        if (err || rows.length === 0)
          return res.status(404).send('Pago no encontrado');
        const pago = rows[0];
        conn.query('SELECT id FROM ordenes', (err2, ordenes) => {
          res.render('editarPago', { pago, ordenes });
        });
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { orden_id, monto, fecha_pago, metodo_pago } = req.body;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      conn.query(
        'UPDATE pagos SET ? WHERE id = ?',
        [{ orden_id, monto, fecha_pago, metodo_pago }, id],
        (err) => {
          if (err) return res.status(500).send('Error al actualizar pago');
          res.redirect('/pagos/vista');
        }
      );
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
      conn.query('DELETE FROM pagos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar pago');
        res.redirect('/pagos/vista');
      });
    });
  },
};
