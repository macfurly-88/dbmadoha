const express = require('express');
const mysql = require('mysql');

const myConnection= require('express-myconnection');

const app = express();

app.use(myConnection(mysql,{
  host: 'localhost',
  user: 'madoha',
  password: '',
  port: 3306,
  database: 'dbmadoha'
}))

app.get('/', (req, res) => res.send('Hola!'));
app.listen(8080);