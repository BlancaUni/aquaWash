# AquaWash Backend

Backend API REST para la plataforma AquaWash - Sistema de gestión de lavanderías.

## Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MariaDB
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: bcryptjs para hash de contraseñas

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Configuración pool de conexiones MariaDB
│   │   └── schema.sql         # Script SQL para crear tablas
│   ├── controllers/
│   │   └── auth.controller.js # Controladores de autenticación
│   ├── middlewares/
│   │   └── auth.middleware.js # Middleware de verificación JWT
│   ├── routes/
│   │   └── auth.routes.js     # Rutas de autenticación
│   ├── utils/
│   │   └── jwt.js             # Utilidades JWT
│   ├── app.js                 # Configuración Express
│   └── server.js              # Punto de entrada
├── .env.example               # Ejemplo de variables de entorno
└── package.json
```

## Instalación

1. **Instalar dependencias**:
```bash
cd backend
npm install
```

2. **Configurar variables de entorno**:
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tus credenciales de MariaDB
```

3. **Configurar la base de datos**:
   - Asegúrate de que MariaDB esté corriendo
   - La base de datos `aquawash` debe existir
   - Ejecuta el script SQL para crear las tablas:
```bash
# Desde MySQL/MariaDB client:
USE aquawash;
SOURCE src/config/schema.sql;
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del backend con:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=aquawash

# JWT
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Ejecutar el Servidor

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints API

### Autenticación

#### Registro
```
POST /api/auth/register
Content-Type: application/json

Body (Cliente):
{
  "role": "cliente",
  "nombre": "Juan",
  "apellidos": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "612345678"
}

Body (Lavandería):
{
  "role": "lavanderia",
  "nombre_comercial": "Lavandería Express",
  "email": "lavanderia@example.com",
  "password": "password123",
  "telefono": "612345678",
  "descripcion": "Lavandería de confianza",
  "horarios": "L-V: 9:00-20:00",
  "calle": "Calle Mayor",
  "numero": "10",
  "cp": "28001",
  "ciudad": "Madrid"
}

Body (Admin):
{
  "role": "admin",
  "nombre": "Admin",
  "email": "admin@example.com",
  "password": "password123"
}

Response (201):
{
  "ok": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "role": "cliente",
      "email": "juan@example.com"
    }
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "role": "cliente",
  "email": "juan@example.com",
  "password": "password123"
}

Response (200):
{
  "ok": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nombre": "Juan",
      "apellidos": "Pérez",
      "email": "juan@example.com",
      "telefono": "612345678",
      "estado": "activo",
      "fecha_alta": "2025-01-21T19:30:00.000Z",
      "role": "cliente"
    }
  }
}
```

#### Obtener Perfil
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "ok": true,
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellidos": "Pérez",
    "email": "juan@example.com",
    "telefono": "612345678",
    "estado": "activo",
    "fecha_alta": "2025-01-21T19:30:00.000Z",
    "role": "cliente"
  }
}
```

### Health Check
```
GET /health

Response (200):
{
  "ok": true,
  "message": "AquaWash API funcionando correctamente",
  "timestamp": "2025-01-21T19:30:00.000Z"
}
```

## Códigos de Error

- `INVALID_ROLE`: Rol no válido
- `INVALID_EMAIL`: Email inválido
- `INVALID_PASSWORD`: Contraseña no cumple requisitos
- `MISSING_FIELD`: Campo requerido faltante
- `EMAIL_EXISTS`: Email ya registrado
- `INVALID_CREDENTIALS`: Email o contraseña incorrectos
- `ACCOUNT_DISABLED`: Cuenta inactiva o bloqueada
- `NO_TOKEN`: Token no proporcionado
- `INVALID_TOKEN`: Token inválido o expirado
- `USER_NOT_FOUND`: Usuario no encontrado
- `SERVER_ERROR`: Error interno del servidor

## Deploy en Render

1. Crear nuevo Web Service en Render
2. Conectar repositorio
3. Configurar:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Añadir variables de entorno en Render
5. Conectar con base de datos MariaDB en Clever Cloud

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ JWT para autenticación stateless
- ✅ Validación de inputs
- ✅ CORS configurado
- ✅ Protección contra SQL injection (prepared statements)
- ✅ Variables de entorno para secretos

## Licencia

TFG Blanca García Alonso - 2025
