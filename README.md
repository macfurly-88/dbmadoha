🧾 README.md — Proyecto dbmadoha
📌 Información general

Nombre del proyecto: dbmadoha
Descripción: Aplicación web desarrollada en Node.js con Express y MySQL, diseñada para la gestión de servicios de marketing digital.
Permite administrar clientes, servicios, órdenes y pagos desde una interfaz web conectada a una base de datos local.

🧩 1. Requisitos previos

Antes de ejecutar este proyecto, asegúrate de tener instalado lo siguiente:

Node.js (versión 18 o superior)

npm (instalado automáticamente con Node.js)

XAMPP o MySQL Workbench (para ejecutar el servidor MySQL)

🗃️ 2. Creación de la base de datos

Inicia el servicio MySQL desde XAMPP o tu instalación local.

Abre MySQL Workbench o la terminal MySQL.

Copia y ejecuta el siguiente script SQL:

DROP DATABASE IF EXISTS dbmadoha;
CREATE DATABASE dbmadoha CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dbmadoha;

CREATE USER IF NOT EXISTS 'dbmadoha'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON dbmadoha.* TO 'dbmadoha'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100),
  telefono VARCHAR(20),
  empresa VARCHAR(100)
);

CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE ordenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  servicio_id INT NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('pendiente','en proceso','completado') DEFAULT 'pendiente',
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

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


Guarda el diseño .mwb (diagrama) dentro de la carpeta /db.

⚙️ 3. Instalación del proyecto

Abre una terminal en la carpeta principal del proyecto:

cd C:\Users\macla\Escritorio\7\E-business\app


Instala las dependencias ejecutando:

npm install


Si prefieres crear todo desde cero automáticamente, puedes ejecutar:

create.bat

🌐 4. Ejecución del servidor

Asegúrate de que el servicio MySQL esté corriendo.

Ejecuta el servidor Node.js con uno de los siguientes comandos:

Con Node:

node app.js


Con Nodemon (reinicio automático):

npx nodemon app.js


Verás un mensaje similar a:

Servidor corriendo en http://localhost:8080


Abre tu navegador y entra a:
👉 http://localhost:8080


👨‍💻 5. Autor

Nombre: Madoha
Proyecto: MADOHA
Materia: E-Business
Fecha: Octubre 2025
