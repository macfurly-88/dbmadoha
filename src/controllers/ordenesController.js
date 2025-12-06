module.exports = {
  listar: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');

      const sql = `
        SELECT o.*, u.nombre AS usuario, s.nombre AS servicio
        FROM ordenes o
        JOIN usuarios u ON o.usuario_id = u.id
        JOIN servicios s ON o.servicio_id = s.id
        ORDER BY o.id DESC
      `;

      conn.query(sql, (err, rows) => {
        if (err) return res.status(500).send('Error al obtener órdenes');

        conn.query('SELECT id, nombre FROM usuarios', (err2, usuarios) => {
          if (err2) return res.status(500).send('Error al obtener usuarios');
          conn.query('SELECT id, nombre FROM servicios', (err3, servicios) => {
            if (err3) return res.status(500).send('Error al obtener servicios');
            res.render('ordenes', { ordenes: rows, usuarios, servicios });
          });
        });
      });
    });
  },

  crear: (req, res) => {
    const { usuario_id, servicio_id, fecha, estado } = req.body;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      const nueva = { usuario_id, servicio_id, fecha, estado };
      conn.query('INSERT INTO ordenes SET ?', nueva, (err) => {
        if (err) return res.status(500).send('Error al crear orden');
        res.redirect('/ordenes/vista');
      });
    });
  },

  editarForm: (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      conn.query('SELECT * FROM ordenes WHERE id = ?', [id], (err, rows) => {
        if (err || rows.length === 0)
          return res.status(404).send('Orden no encontrada');
        const orden = rows[0];
        conn.query('SELECT id, nombre FROM usuarios', (err2, usuarios) => {
          conn.query('SELECT id, nombre FROM servicios', (err3, servicios) => {
            res.render('editarOrden', { orden, usuarios, servicios });
          });
        });
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { usuario_id, servicio_id, fecha, estado } = req.body;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      conn.query(
        'UPDATE ordenes SET ? WHERE id = ?',
        [{ usuario_id, servicio_id, fecha, estado }, id],
        (err) => {
          if (err) return res.status(500).send('Error al actualizar orden');
          res.redirect('/ordenes/vista');
        }
      );
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
      conn.query('DELETE FROM ordenes WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar orden');
        res.redirect('/ordenes/vista');
      });
    });
  },
};
