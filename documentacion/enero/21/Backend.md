# Backend - Trabajo del 21 de Enero 2026

## 📋 Resumen
Configuración completa del backend API REST con Node.js, Express y autenticación JWT. Se implementó auto-detección de roles y se desactivó temporalmente el cifrado de contraseñas para pruebas.

---

## 🛠️ Configuración Inicial

### Estructura del Proyecto
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Conexión a MariaDB
│   │   └── bd.sql             # Schema de base de datos
│   ├── controllers/
│   │   └── auth.controller.js # Controladores de autenticación
│   ├── routes/
│   │   └── auth.routes.js     # Rutas de autenticación
│   ├── middlewares/
│   │   └── auth.middleware.js # Middleware de verificación JWT
│   ├── utils/
│   │   └── jwt.js             # Utilidades para JWT
│   └── server.js              # Servidor Express
├── .env                       # Variables de entorno
├── .env.example               # Plantilla de variables
├── package.json
└── README.md
```

### Dependencias Instaladas
- `express` - Framework web
- `mysql2` - Cliente MySQL/MariaDB
- `bcryptjs` - Hash de contraseñas (temporalmente desactivado)
- `jsonwebtoken` - Autenticación JWT
- `dotenv` - Variables de entorno
- `cors` - Manejo de CORS
- `nodemon` - Auto-reinicio en desarrollo

---

## 🔧 Configuración de Variables de Entorno

Archivo `.env` creado con:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=aquawash

JWT_SECRET=mi_clave_super_secreta_para_aquawash_2025_blanca_garcia
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development

CORS_ORIGIN=http://localhost:5173
```

---

## 🔐 Sistema de Autenticación

### Auto-detección de Rol en Login
**Modificación principal**: El endpoint de login ahora detecta automáticamente el rol del usuario buscando su email en las tres tablas (`clientes`, `lavanderias`, `admins`).

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "cliente@test.com",
  "password": "cliente123"
}
```

**Response**:
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "cliente@test.com",
    "role": "cliente",
    "nombre": "Juan"
  }
}
```

**Flujo de detección**:
1. Busca el email en la tabla `clientes`
2. Si no lo encuentra, busca en `lavanderias`
3. Si no lo encuentra, busca en `admins`
4. Si no está en ninguna tabla, retorna error de credenciales inválidas

### Registro de Clientes
**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "role": "cliente",
  "nombre": "María",
  "apellidos": "González López",
  "email": "maria@test.com",
  "telefono": "623456789",
  "password": "maria123"
}
```

**Nota**: El frontend solo permite registro de clientes, pero el backend soporta los tres roles.

---

## ⚠️ Desactivación Temporal de Bcrypt

Para facilitar las pruebas iniciales, se desactivó temporalmente el cifrado de contraseñas:

### Cambios en `auth.controller.js`:

**Registro** (línea 52-54):
```javascript
// Hash de la contraseña - TEMPORALMENTE DESACTIVADO
// const hashedPassword = await bcrypt.hash(password, 10);
const hashedPassword = password; // TEMPORAL: contraseña en texto plano
```

**Login** (línea 262-264):
```javascript
// Verificar contraseña - TEMPORALMENTE DESACTIVADO
// const isPasswordValid = await bcrypt.compare(password, user.password);
const isPasswordValid = password === user.password; // TEMPORAL: comparación directa
```

### ⚠️ IMPORTANTE
**Estos cambios son TEMPORALES solo para pruebas. Deben reactivarse antes de producción.**

---

## 🚀 Scripts de Utilidad Creados

### 1. `check-users.js`
Verifica qué usuarios existen en la base de datos.

**Uso**:
```bash
node check-users.js
```

### 2. `simple-check.js`
Cuenta rápidamente cuántos usuarios hay en cada tabla.

**Uso**:
```bash
node simple-check.js
```

**Output**:
```
CLIENTES: 1
LAVANDERIAS: 1
ADMINS: 1
CLIENTE TEST EXISTS: SI
```

### 3. `create-test-users.js`
Genera contraseñas hasheadas con bcrypt para usuarios de prueba.

**Uso**:
```bash
node create-test-users.js
```

---

## 🔍 Resolución de Problemas

### Puerto 3000 en Uso
**Problema**: Error `EADDRINUSE: address already in use :::3000`

**Solución aplicada**:
```powershell
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000

# Detener procesos en el puerto 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

---

## 📊 Estado Actual

✅ **Completado**:
- Servidor Express configurado y corriendo en puerto 3000
- Conexión a MariaDB establecida
- Sistema de autenticación JWT implementado
- Auto-detección de roles en login
- CORS configurado para frontend
- Variables de entorno configuradas
- Scripts de utilidad creados

⏳ **Pendiente**:
- Reactivar bcrypt una vez confirmado que el login funciona
- Implementar endpoints para operaciones CRUD
- Añadir validaciones adicionales
- Implementar recuperación de contraseña
- Añadir tests unitarios

---

## 🔗 Integración con Frontend

**URL del backend**: `http://localhost:3000`
**CORS habilitado para**: `http://localhost:5173`

**Endpoints disponibles**:
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login con auto-detección de rol

---

## 📝 Notas Importantes

1. **Nodemon**: El servidor se reinicia automáticamente al detectar cambios en archivos `.js`
2. **Logs**: El servidor muestra información detallada de cada petición en la consola
3. **Seguridad**: Las contraseñas están temporalmente en texto plano - REACTIVAR BCRYPT
4. **JWT**: Los tokens expiran en 7 días según configuración actual
