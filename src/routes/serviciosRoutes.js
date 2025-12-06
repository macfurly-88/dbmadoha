const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middlewares/upload');
const serviciosController = require('../controllers/serviciosController');

router.get('/vista', serviciosController.listar);

router.post('/', upload.array('imagenes', 10), serviciosController.crear);

router.get('/editar/:id', serviciosController.editarForm);

router.post('/editar/:id', upload.array('imagenes', 10), (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, duracion_dias } = req.body;
  const nuevasImgs = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión');

    conn.query(
      'UPDATE servicios SET nombre=?, descripcion=?, precio=?, duracion_dias=? WHERE id=?',
      [nombre, descripcion, precio, duracion_dias, id],
      (err) => {
        if (err) {
          console.error('❌ Error al actualizar servicio:', err);
          return res.status(500).send('Error al actualizar servicio');
        }

        if (nuevasImgs.length > 0) {
          conn.query('SELECT ruta_imagen FROM imagenes_servicio WHERE servicio_id=?', [id], (err, imgs) => {
            if (!err && imgs.length > 0) {
              imgs.forEach(img => {
                const imgPath = path.join(__dirname, '..', 'public', img.ruta_imagen.replace('/uploads/', 'uploads/'));
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
              });
            }

            conn.query('DELETE FROM imagenes_servicio WHERE servicio_id=?', [id], (err2) => {
              if (err2) console.error('⚠️ Error al eliminar registros antiguos:', err2);

              const values = nuevasImgs.map(img => [id, img]);
              conn.query('INSERT INTO imagenes_servicio (servicio_id, ruta_imagen) VALUES ?', [values], (err3) => {
                if (err3) console.error('⚠️ Error al insertar nuevas imágenes:', err3);
                res.redirect(`/servicios/editar/${id}`);
              });
            });
          });
        } else {
          res.redirect(`/servicios/editar/${id}`);
        }
      }
    );
  });
});

router.get('/eliminar/:id', (req, res) => {
  const { id } = req.params;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error de conexión');

    conn.query('SELECT ruta_imagen FROM imagenes_servicio WHERE servicio_id=?', [id], (err, imgs) => {
      if (!err && imgs.length > 0) {
        imgs.forEach(img => {
          const imgPath = path.join(__dirname, '..', 'public', img.ruta_imagen.replace('/uploads/', 'uploads/'));
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });
      }

      conn.query('DELETE FROM servicios WHERE id = ?', [id], (err2) => {
        if (err2) return res.status(500).send('Error al eliminar servicio');
        res.redirect('/servicios/vista');
      });
    });
  });
});

router.post('/eliminar-imagen/:id', (req, res) => {
  const { id } = req.params;
  const path = require('path');
  const fs = require('fs');

  req.getConnection((err, conn) => {
    if (err) {
      console.error('❌ Error de conexión:', err);
      return res.status(500).json({ error: 'Error de conexión a la base de datos' });
    }

    conn.query('SELECT servicio_id, ruta_imagen FROM imagenes_servicio WHERE id = ?', [id], (err, rows) => {
      if (err) {
        console.error('❌ Error al buscar imagen:', err);
        return res.status(500).json({ error: 'Error al buscar imagen' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Imagen no encontrada' });
      }

      const servicioId = rows[0].servicio_id;
      const imgPath = path.join(__dirname, '..', 'public', rows[0].ruta_imagen.replace('/uploads/', 'uploads/'));

      if (fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
        } catch (unlinkErr) {
          console.error('⚠️ No se pudo borrar archivo físico:', unlinkErr);
        }
      }

      conn.query('DELETE FROM imagenes_servicio WHERE id = ?', [id], (err2) => {
        if (err2) {
          console.error('❌ Error al eliminar registro de imagen:', err2);
          return res.status(500).json({ error: 'Error al eliminar registro de imagen' });
        }

        return res.json({ success: true, servicioId });
      });
    });
  });
});


module.exports = router;
