const fs = require('fs');
const path = require('path');

module.exports = {
  listar: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión a la base de datos');

      const sql = `
        SELECT s.*, GROUP_CONCAT(i.ruta_imagen) AS imagenes
        FROM servicios s
        LEFT JOIN imagenes_servicio i ON s.id = i.servicio_id
        GROUP BY s.id
      `;

      conn.query(sql, (err, rows) => {
        if (err) {
          console.error('❌ Error SQL:', err);
          return res.status(500).send('Error al obtener servicios');
        }

        res.render('servicios', { servicios: rows });
      });
    });
  },

  crear: (req, res) => {
    const { nombre, descripcion, precio, duracion_dias } = req.body;
    const imagenes = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');

      const nuevoServicio = { nombre, descripcion, precio, duracion_dias };

      conn.query('INSERT INTO servicios SET ?', nuevoServicio, (err, result) => {
        if (err) {
          console.error('❌ Error al insertar servicio:', err);
          return res.status(500).send('Error al crear servicio');
        }

        const servicioId = result.insertId;

        if (imagenes.length > 0) {
          const values = imagenes.map(img => [servicioId, img]);
          conn.query('INSERT INTO imagenes_servicio (servicio_id, ruta_imagen) VALUES ?', [values]);
        }

        res.redirect('/servicios/vista');
      });
    });
  },

  editarForm: (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');

      conn.query('SELECT * FROM servicios WHERE id = ?', [id], (err, rows) => {
        if (err || rows.length === 0) {
          console.error('❌ Error al obtener servicio:', err);
          return res.status(404).send('Servicio no encontrado');
        }

        const servicio = rows[0];

        conn.query('SELECT * FROM imagenes_servicio WHERE servicio_id = ?', [id], (err2, imgs) => {
          if (err2) {
            console.error('❌ Error al obtener imágenes:', err2);
            return res.status(500).send('Error al cargar imágenes');
          }

          res.render('editarServicio', { servicio, imagenes: imgs });
        });
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, duracion_dias } = req.body;
    const nuevasImgs = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');

      conn.query(
        'UPDATE servicios SET ? WHERE id = ?',
        [{ nombre, descripcion, precio, duracion_dias }, id],
        (err) => {
          if (err) {
            console.error('❌ Error al actualizar servicio:', err);
            return res.status(500).send('Error al actualizar servicio');
          }

          if (nuevasImgs.length > 0) {
            const values = nuevasImgs.map(img => [id, img]);
            conn.query('INSERT INTO imagenes_servicio (servicio_id, ruta_imagen) VALUES ?', [values]);
          }

          res.redirect('/servicios/vista');
        }
      );
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');

      conn.query('DELETE FROM servicios WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('❌ Error al eliminar servicio:', err);
          return res.status(500).send('Error al eliminar servicio');
        }

        res.redirect('/servicios/vista');
      });
    });
  }
};
