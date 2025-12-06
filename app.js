const express = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const session = require('express-session');

const app = express();

// Conexión a MySQL
app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'dbmadoha',
  password: '12345',
  port: 3306,
  database: 'dbmadoha'
}, 'single'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src/public'));

// Configurar sesión
app.use(session({
  secret: 'madoha-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

// === RUTAS ===
const authRoutes = require('./src/routes/authRoutes');
app.use('/', authRoutes);

const panelRoutes = require('./src/routes/panelRoutes');
app.use('/panel', panelRoutes);

const usuariosRoutes = require('./src/routes/usuariosRoutes');
app.use('/usuarios', usuariosRoutes);

const serviciosRoutes = require('./src/routes/serviciosRoutes');
app.use('/servicios', serviciosRoutes);

const ordenesRoutes = require('./src/routes/ordenesRoutes');
app.use('/ordenes', ordenesRoutes);

const pagosRoutes = require('./src/routes/pagosRoutes');
app.use('/pagos', pagosRoutes);

const clienteRoutes = require('./src/routes/clienteRoutes');
app.use('/cliente', clienteRoutes);

// Redirigir raíz al login
app.get('/', (req, res) => res.redirect('/login'));

app.listen(8080, () => console.log('✅ Servidor corriendo en http://localhost:8080'));
