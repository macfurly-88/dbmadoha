module.exports = {
  crear: (req, res) => {
    const { nombre, correo, password, empresa, rol } = req.body;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      const nuevo = { nombre, correo, password, empresa, rol };
      conn.query('INSERT INTO usuarios SET ?', nuevo, (err) => {
        if (err) return res.status(500).send('Error al crear usuario');
        res.redirect('/usuarios/vista');
      });
    });
  },

  editarForm: (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      conn.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, rows) => {
        if (err) return res.status(500).send('Error al obtener usuario');
        res.render('editarUsuario', { usuario: rows[0] });
      });
    });
  },

  actualizar: (req, res) => {
    const { id } = req.params;
    const { nombre, correo, password, empresa, rol } = req.body;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      conn.query(
        'UPDATE usuarios SET ? WHERE id = ?',
        [{ nombre, correo, password, empresa, rol }, id],
        (err) => {
          if (err) return res.status(500).send('Error al actualizar usuario');
          res.redirect('/usuarios/vista');
        }
      );
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error de conexión');
      conn.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send('Error al eliminar usuario');
        res.redirect('/usuarios/vista');
      });
    });
  },
};
