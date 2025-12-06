# 🌐 Proyecto MADOHA — Gestión de Servicios Digitales

Aplicación web desarrollada en **Node.js**, **Express** y **MySQL**, diseñada para la **gestión integral de servicios de marketing digital**.  
Permite administrar usuarios, servicios, órdenes, pagos y clientes mediante un panel administrativo y una interfaz para clientes con carrito de compras y pagos simulados.

---

## 🧩 1. Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- 🟢 **Node.js** (versión 18 o superior)
- 📦 **npm** (incluido con Node.js)
- 🐬 **MySQL** (vía **XAMPP** o **MySQL Workbench**)
- 💻 **Git** (opcional, para control de versiones)

---

## 🗃️ 2. Creación de la base de datos

1. Inicia el servicio **MySQL** desde XAMPP o Workbench.  
2. Abre una consola o **MySQL Workbench** y ejecuta el siguiente script SQL:

-- ======================================================
--   SCRIPT DE BASE DE DATOS: dbmadoha
--   Proyecto: Madoha
--   Autor: Maclary
-- ======================================================

DROP DATABASE IF EXISTS dbmadoha;
CREATE DATABASE dbmadoha CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dbmadoha;

CREATE USER IF NOT EXISTS 'dbmadoha'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON dbmadoha.* TO 'dbmadoha'@'localhost';
FLUSH PRIVILEGES;

-- ======================================================
--   TABLA: usuarios
-- ======================================================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  empresa VARCHAR(100),
  rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);

-- ======================================================
--   TABLA: servicios
-- ======================================================
CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  duracion_dias INT DEFAULT 0
);

-- ======================================================
--   TABLA: imagenes_servicio
-- ======================================================
CREATE TABLE imagenes_servicio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  servicio_id INT NOT NULL,
  ruta_imagen VARCHAR(255) NOT NULL,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- ======================================================
--   TABLA: ordenes
-- ======================================================
CREATE TABLE ordenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  servicio_id INT NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('pendiente','en proceso','completado') DEFAULT 'pendiente',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- ======================================================
--   TABLA: pagos
-- ======================================================
CREATE TABLE pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orden_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago DATE NOT NULL,
  metodo_pago ENUM('tarjeta','transferencia','efectivo'),
  FOREIGN KEY (orden_id) REFERENCES ordenes(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- ======================================================
--   INSERTAR USUARIOS POR DEFECTO
-- ======================================================
INSERT INTO usuarios (nombre, correo, password, empresa, rol)
VALUES 
('Macfurly Admin', 'macfurly@admin.com', '$2b$10$i/St/k4Fp95mdwtAPY59/eui78OxKrtct025fSoLjqqga9Ern3cs.', 'Madoha', 'admin'),
('Macfurly Client', 'macfurly@cliente.com', '$2b$10$i/St/k4Fp95mdwtAPY59/eui78OxKrtct025fSoLjqqga9Ern3cs.', 'Macdres', 'cliente');
-- 12345 de password 
-- ======================================================
--   INSERTAR SERVICIOS DE EJEMPLO
-- ======================================================
INSERT INTO servicios (nombre, descripcion, precio, duracion_dias)
VALUES
('Diseño Web Empresarial', 'Sitio web profesional adaptable a dispositivos móviles.', 5000.00, 14),
('Gestión de Redes Sociales', 'Administración y creación de contenido para redes sociales.', 2500.00, 30),
('Optimización SEO', 'Mejora del posicionamiento en buscadores y tráfico orgánico.', 3000.00, 20);

-- ======================================================
--   INSERTAR IMÁGENES DE SERVICIOS
-- ======================================================
INSERT INTO imagenes_servicio (servicio_id, ruta_imagen)
VALUES
(1, '/uploads/web1.jpg'),
(1, '/uploads/web2.jpg'),
(2, '/uploads/redes1.jpg'),
(3, '/uploads/seo1.jpg');

-- ======================================================
--   INSERTAR ORDEN DE EJEMPLO
-- ======================================================
INSERT INTO ordenes (usuario_id, servicio_id, fecha, estado)
VALUES
(2, 1, CURDATE(), 'pendiente');

-- ======================================================
--   INSERTAR PAGO DE EJEMPLO
-- ======================================================
INSERT INTO pagos (orden_id, monto, fecha_pago, metodo_pago)
VALUES
(1, 5000.00, CURDATE(), 'tarjeta');

⚙️ 3. Instalación del proyecto

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

npm install


Esto instalará todas las dependencias necesarias (Express, EJS, MySQL, Multer, Bcrypt, etc.).

Si prefieres automatizar todo (incluyendo creación de carpetas y base), ejecuta:

create.bat

🚀 4. Ejecución del servidor

Asegúrate de que el servicio MySQL esté activo.

Inicia el servidor Node.js con:

node app.js


O con Nodemon para reinicio automático:

npx nodemon app.js


Si todo funciona correctamente, deberías ver algo como:

✅ Servidor corriendo en http://localhost:8080


Abre tu navegador y entra a:

👉 http://localhost:8080

🧠 5. Funcionalidades principales
👨‍💼 Panel de administrador

Gestión de usuarios (CRUD)

Gestión de servicios (con imágenes y duración)

Control de órdenes y pagos

Visualización dinámica con EJS

👥 Interfaz de cliente

Registro y login con contraseña hasheada con bcrypt

Navegación superior moderna (inicio, servicios, carrito, órdenes)

Carrito de compras con modal de pago

Registro automático de órdenes y pagos

💾 Seguridad y sesiones

Uso de express-session para mantener la sesión activa

Contraseñas encriptadas con bcrypt

Restricción por roles (admin / cliente)

🧰 6. Estructura del proyecto
app/
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── public/
│   │   ├── uploads/
│   │   └── img/
│   ├── routes/
│   └── views/
│       ├── cliente/
│       ├── partials/
│       └── admin/
│
├── app.js
├── package.json
└── README.md

👨‍💻 7. Autor

Nombre: Maclary X. López Salazar
Proyecto: MADOHA — E-Business
Materia: E-Business
Fecha: Diciembre 2025
GitHub: https://github.com/macfurly-88/dbmadoha

💡 8. Notas

Si se agregan nuevos módulos, recuerda actualizar package.json con:

npm install <nombre-paquete> --save


Si usas MySQL Workbench, asegúrate de que el puerto en app.js coincida (por defecto 3306).

Puedes cambiar el usuario/contraseña de MySQL en app.js.