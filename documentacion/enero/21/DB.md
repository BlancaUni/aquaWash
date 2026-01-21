# Base de Datos - Trabajo del 21 de Enero 2026

## 📋 Resumen
Diseño e implementación del esquema de base de datos para AquaWash usando MariaDB/MySQL. Se crearon las tablas principales para clientes, lavanderías y administradores, junto con scripts de inserción de datos de prueba.

---

## 🗄️ Esquema de Base de Datos

### Archivo: `backend/src/config/bd.sql`

El esquema define tres tablas principales con sus respectivas relaciones y constraints.

---

## 📊 Tabla: `clientes`

Almacena información de los usuarios clientes de la aplicación.

```sql
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
```

**Campos**:
- `id_cliente`: ID único auto-incremental
- `nombre`: Nombre del cliente (requerido)
- `apellidos`: Apellidos del cliente (opcional)
- `email`: Email único (requerido, indexado)
- `password`: Contraseña (temporalmente en texto plano)
- `telefono`: Número de teléfono (opcional)
- `estado_cuenta`: Estado de la cuenta (activo/inactivo/bloqueado)
- `fecha_alta`: Fecha de registro automática

**Índices**:
- `PRIMARY KEY` en `id_cliente`
- `UNIQUE` en `email`
- `INDEX` en `email` para búsquedas rápidas

---

## 🏪 Tabla: `lavanderias`

Almacena información de las lavanderías registradas en la plataforma.

```sql
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
```

**Campos**:
- `id_lavanderia`: ID único auto-incremental
- `nombre_comercial`: Nombre comercial de la lavandería (requerido)
- `email`: Email único (requerido, indexado)
- `password`: Contraseña (temporalmente en texto plano)
- `telefono`: Número de teléfono (opcional)
- `descripcion`: Descripción de servicios (opcional)
- `horarios`: Horarios de atención (opcional)
- `calle`, `numero`, `cp`, `ciudad`: Dirección separada en campos
- `estado`: Estado de la lavandería (activa/inactiva/pendiente/bloqueada)
- `fecha_alta`: Fecha de registro automática

**Índices**:
- `PRIMARY KEY` en `id_lavanderia`
- `UNIQUE` en `email`
- `INDEX` en `email` para búsquedas rápidas
- `INDEX` en `ciudad` para búsquedas geográficas

---

## 👨‍💼 Tabla: `admins`

Almacena información de los administradores del sistema.

```sql
CREATE TABLE IF NOT EXISTS admins (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_admin (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos**:
- `id_admin`: ID único auto-incremental
- `nombre`: Nombre del administrador (requerido)
- `email`: Email único (requerido, indexado)
- `password`: Contraseña (temporalmente en texto plano)
- `estado`: Estado del admin (activo/inactivo)
- `fecha_alta`: Fecha de creación automática

**Índices**:
- `PRIMARY KEY` en `id_admin`
- `UNIQUE` en `email`
- `INDEX` en `email` para búsquedas rápidas

---

## 🧪 Datos de Prueba

### Archivo: `insert-test-users-plain.sql`

Script SQL para insertar usuarios de prueba con contraseñas en texto plano (temporal).

```sql
-- Eliminar usuarios existentes
DELETE FROM clientes WHERE email = 'cliente@test.com';
DELETE FROM lavanderias WHERE email = 'lavanderia@test.com';
DELETE FROM admins WHERE email = 'admin@test.com';

-- Cliente de prueba
INSERT INTO clientes (nombre, apellidos, email, telefono, password, estado_cuenta)
VALUES ('Juan', 'Pérez García', 'cliente@test.com', '612345678', 'cliente123', 'activo');

-- Lavandería de prueba
INSERT INTO lavanderias (nombre_comercial, email, telefono, password, descripcion, horarios, calle, numero, cp, ciudad, estado)
VALUES ('Lavandería Express', 'lavanderia@test.com', '913456789', 'lavanderia123', 
        'Lavandería profesional con servicios de lavado, planchado y tintorería',
        'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00', 'Avenida Comercial', '45', '28001', 'Madrid', 'activa');

-- Admin de prueba
INSERT INTO admins (nombre, email, password, estado)
VALUES ('Administrador', 'admin@test.com', 'admin123', 'activo');
```

### Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Cliente** | `cliente@test.com` | `cliente123` |
| **Lavandería** | `lavanderia@test.com` | `lavanderia123` |
| **Admin** | `admin@test.com` | `admin123` |

---

## 🔄 Evolución del Esquema

### Versión Inicial (con bcrypt)
Originalmente se creó `insert-test-users.sql` con contraseñas hasheadas usando bcrypt:
```sql
password_hash = '$2a$10$9kW7lD3vck66BKI/9VAU4.yYygYHt5eZF6VD/vOX9fK'
```

### Versión Actual (texto plano - temporal)
Para facilitar las pruebas iniciales, se simplificó a texto plano:
```sql
password = 'cliente123'
```

**⚠️ IMPORTANTE**: Las contraseñas en texto plano son TEMPORALES solo para pruebas. Deben volver a hashearse con bcrypt antes de producción.

---

## 🔧 Configuración de Conexión

**Archivo**: `backend/src/config/db.js`

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

**Variables de entorno**:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=aquawash
```

---

## 📊 Estado Actual de la Base de Datos

Verificado con el script `simple-check.js`:

```
CLIENTES: 1
LAVANDERIAS: 1
ADMINS: 1
CLIENTE TEST EXISTS: SI
```

---

## 🔍 Scripts de Verificación

### 1. Verificar Usuarios
```bash
node check-users.js
```

Muestra todos los usuarios registrados en cada tabla.

### 2. Conteo Rápido
```bash
node simple-check.js
```

Muestra el número total de registros en cada tabla.

---

## 📝 Decisiones de Diseño

### 1. Separación de Tablas por Rol
Se decidió usar **tres tablas separadas** en lugar de una tabla única con un campo `role` porque:
- Cada rol tiene campos específicos diferentes
- Facilita las consultas y el mantenimiento
- Mejor rendimiento en búsquedas
- Mayor flexibilidad para futuras expansiones

### 2. Dirección de Lavandería Separada
La dirección de las lavanderías se almacena en campos separados (`calle`, `numero`, `cp`, `ciudad`) para:
- Facilitar búsquedas geográficas
- Permitir filtros por ciudad
- Mejor estructuración de datos
- Preparación para futuras integraciones con mapas

### 3. Estados ENUM
Se usan tipos `ENUM` para los estados porque:
- Garantizan valores válidos
- Mejor rendimiento que VARCHAR
- Documentación implícita de valores permitidos
- Prevención de errores de tipeo

### 4. Índices
Se crearon índices en:
- `email`: Búsquedas frecuentes durante login
- `ciudad`: Búsquedas geográficas de lavanderías

---

## ⚠️ Consideraciones de Seguridad

### Temporal (Actual)
- ❌ Contraseñas en texto plano
- ❌ Sin validación de formato de email en DB
- ❌ Sin constraints de longitud mínima de password

### Producción (Pendiente)
- ✅ Reactivar bcrypt para hash de contraseñas
- ✅ Añadir triggers para validaciones
- ✅ Implementar auditoría de cambios
- ✅ Añadir campos de fecha_modificacion
- ✅ Implementar soft-delete en lugar de DELETE

---

## 🚀 Próximos Pasos

1. **Reactivar bcrypt** una vez confirmado que el login funciona
2. **Añadir tablas adicionales**:
   - `pedidos`
   - `servicios`
   - `valoraciones`
   - `favoritos`
3. **Implementar relaciones** entre tablas
4. **Añadir constraints** de integridad referencial
5. **Crear vistas** para consultas complejas
6. **Implementar procedures** para operaciones comunes
7. **Añadir auditoría** de cambios

---

## 📚 Recursos

- **Motor**: MariaDB/MySQL
- **Charset**: utf8mb4 (soporte completo Unicode)
- **Collation**: utf8mb4_unicode_ci
- **Engine**: InnoDB (transacciones ACID)
