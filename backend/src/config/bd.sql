-- Schema para AquaWash
-- Este script crea las tablas necesarias si no existen

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  estado_cuenta ENUM('activo', 'inactivo', 'bloqueado') DEFAULT 'activo',
  fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_cliente (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de lavanderías
CREATE TABLE IF NOT EXISTS lavanderias (
  id_lavanderia INT AUTO_INCREMENT PRIMARY KEY,
  nombre_comercial VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  descripcion TEXT,
  horarios VARCHAR(500),
  calle VARCHAR(255),
  numero VARCHAR(10),
  cp VARCHAR(10),
  ciudad VARCHAR(100),
  estado ENUM('activa', 'inactiva', 'pendiente', 'bloqueada') DEFAULT 'pendiente',
  fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_lavanderia (email),
  INDEX idx_ciudad (ciudad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_admin (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
