const express = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');

const app = express();

app.use(
  myConnection(mysql, {
    host: 'localhost',
    user: 'madoha',
    password: '',
    port: 3306,
    database: 'dbmadoha'
  }, 'single')
);

app.get('/', (req, res) => res.send('Servidor funcionando correctamente 🚀'));

app.get('/productos', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query('SELECT * FROM productos', (err, rows) => {
      if (err) return res.send(err);
      res.json(rows);
    });
  });
});

app.listen(8080, () => console.log('Servidor corriendo en http://localhost:8080'));
