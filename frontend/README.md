# AquaWash Frontend

Frontend de la aplicación AquaWash - Plataforma de gestión de lavanderías.

## Stack Tecnológico

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS + CSS personalizado
- **Icons**: Lucide React

## Estructura del Proyecto

```
frontend/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Layout.css   # Estilos globales y variables
│   │   ├── nav/
│   │   │   ├── Header.jsx   # Componente de navegación
│   │   │   ├── Footer.jsx   # Componente de pie de página
│   │   │   ├── NavButton.jsx # Botón de navegación
│   │   │   └── index.js     # Exports
│   │   └── ui/
│   │       ├── FloatingInput.jsx  # Input con label flotante
│   │       ├── Modal.jsx          # Modal de recuperación de contraseña
│   │       └── UserAvatar.jsx     # Avatar de usuario con menú
│   ├── pages/
│   │   ├── Home.jsx         # Página principal
│   │   ├── Home.css         # Estilos de Home
│   │   ├── LoginRegister.jsx # Página de login/registro
│   │   └── login_Registre.css # Estilos de login/registro
│   ├── App.jsx              # Componente principal con rutas
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos base con Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Instalación

```bash
cd frontend
npm install
```

## Configuración

1. **Crear archivo `.env`**:
```bash
copy .env.example .env
```

2. **Editar `.env`**:
```env
VITE_API_URL=http://localhost:3000
```

## Ejecutar en Desarrollo

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## Preview de Producción

```bash
npm run preview
```

## Características Implementadas

### Autenticación
- ✅ Login con 3 roles (Cliente, Lavandería, Admin)
- ✅ Registro con formularios dinámicos según rol
- ✅ Gestión de tokens JWT en localStorage
- ✅ Integración completa con backend API
- ✅ Validaciones de formularios
- ✅ Manejo de errores con mensajes visuales

### Páginas

#### Home (`/`)
- Carousel automático con servicios
- Sección de características
- Call-to-action
- Detección de sesión activa
- Botón de cerrar sesión

#### Login/Registro (`/auth/login_Registre`)
- Toggle animado entre login y registro
- Selector de rol (Cliente, Lavandería, Admin)
- Formularios dinámicos según rol seleccionado
- Campos específicos por rol:
  - **Cliente**: nombre, apellidos, email, password, teléfono
  - **Lavandería**: nombre comercial, email, password, teléfono, descripción, horarios, dirección completa
  - **Admin**: nombre, email, password
- Modal de recuperación de contraseña
- Estados de carga
- Navegación automática tras login/registro exitoso

### Componentes Reutilizables

- **Header**: Navegación con logo y botones
- **Footer**: Pie de página con enlaces
- **NavButton**: Botón estilizado para navegación
- **FloatingInput**: Input con label flotante
- **Modal**: Modal para recuperación de contraseña
- **UserAvatar**: Avatar con menú desplegable

## Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home | Página principal |
| `/auth/login_Registre` | LoginRegister | Login y registro |
| `/customer` | CustomerPage | Panel de cliente (placeholder) |
| `/laundry` | LaundryPage | Panel de lavandería (placeholder) |
| `/admin` | AdminPage | Panel de admin (placeholder) |

## Estilos

### Paleta de Colores (Aurora Mist)

```css
--app-color-primary: #355b82
--app-color-secondary: #5a8595
--app-color-accent: #a9c1bb
--app-color-light: #ABB7B3
--app-color-muted: #839492
```

### Sistema de Diseño

- Variables CSS centralizadas en `Layout.css`
- Tailwind CSS para utilidades
- CSS personalizado para componentes específicos
- Diseño responsive con breakpoints estándar

## Integración con Backend

### API Endpoints Utilizados

```javascript
// Login
POST /api/auth/login
Body: { role, email, password }

// Registro
POST /api/auth/register
Body: { role, email, password, ...campos_específicos }

// Obtener perfil (futuro)
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
```

### Gestión de Estado

- Token JWT almacenado en `localStorage` con key `aquawash_token`
- Rol almacenado en `localStorage` con key `aquawash_role`
- Email almacenado en `localStorage` con key `aquawash_email`
- Context API para autenticación global

## Navegación por Rol

Tras login/registro exitoso, la navegación es automática:

- **Cliente** → `/customer`
- **Lavandería** → `/laundry`
- **Admin** → `/admin`

## Deploy en Render

1. Crear nuevo Static Site
2. Configurar:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Añadir variable de entorno:
   - `VITE_API_URL`: URL del backend en Render

## Notas Importantes

- ⚠️ Las imágenes del carousel están como placeholders. Debes añadir las imágenes reales en `src/assets/images/`
- ⚠️ El logo debe estar en `src/assets/icons/logo.jpg`
- ✅ Todos los formularios tienen validación HTML5
- ✅ Los errores del backend se muestran al usuario
- ✅ Estados de carga durante peticiones API
- ✅ Responsive design implementado

## Próximos Pasos

1. Implementar páginas de cliente, lavandería y admin
2. Añadir protección de rutas (PrivateRoute)
3. Implementar recuperación de contraseña funcional
4. Añadir más validaciones en formularios
5. Implementar sistema de notificaciones
6. Añadir tests unitarios

## Licencia

TFG Blanca García Alonso - 2025
