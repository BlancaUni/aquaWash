# Frontend - Trabajo del 21 de Enero 2026

## 📋 Resumen
Desarrollo completo del frontend de AquaWash con React, Vite y Tailwind CSS. Se implementó el sistema de autenticación, páginas principales, componentes reutilizables y la integración con el backend API.

---

## 🛠️ Configuración Inicial

### Stack Tecnológico
- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **Axios** (implícito en fetch) - Peticiones HTTP

### Estructura del Proyecto
```
frontend/
├── public/
│   └── logo.svg                    # Logo placeholder
├── src/
│   ├── components/
│   │   ├── assets/                 # Imágenes y recursos
│   │   │   ├── logo.jpg
│   │   │   ├── lavado.jpg
│   │   │   ├── planchado.jpg
│   │   │   └── tintoreria.jpg
│   │   ├── layout/
│   │   │   └── Layout.css          # Estilos globales de navegación
│   │   ├── nav/
│   │   │   ├── Header.jsx          # Navegación superior
│   │   │   ├── Footer.jsx          # Pie de página
│   │   │   ├── NavButton.jsx       # Botón de navegación
│   │   │   └── index.js            # Exportaciones
│   │   └── ui/
│   │       ├── FloatingInput.jsx   # Input con label flotante
│   │       ├── Modal.jsx           # Modal reutilizable
│   │       └── UserAvatar.jsx      # Avatar con menú
│   ├── pages/
│   │   ├── Home.jsx                # Página principal
│   │   ├── Home.css                # Estilos de Home
│   │   ├── LoginRegister.jsx       # Login y registro
│   │   └── login_Registre.css      # Estilos de auth
│   ├── App.jsx                     # Componente principal con rutas
│   ├── main.jsx                    # Punto de entrada
│   └── index.css                   # Estilos globales
├── .env                            # Variables de entorno
├── .env.example                    # Plantilla
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🎨 Componentes Desarrollados

### 1. Header (`components/nav/Header.jsx`)
Navegación superior con logo y botones.

**Características**:
- Logo de AquaWash
- Título "AquaWash"
- Contenedor para botones de navegación
- Responsive

**Imports corregidos**:
```javascript
import logo from '../assets/logo.jpg';
```

### 2. Footer (`components/nav/Footer.jsx`)
Pie de página simple con información de copyright.

### 3. NavButton (`components/nav/NavButton.jsx`)
Botón estilizado reutilizable para navegación.

**Props**:
- `children`: Contenido del botón
- `onClick`: Función al hacer clic
- `className`: Clases CSS adicionales

### 4. FloatingInput (`components/ui/FloatingInput.jsx`)
Input con label flotante animado.

**Props**:
- `label`: Texto del label
- `type`: Tipo de input
- `value`: Valor del input
- `onChange`: Función de cambio
- `required`: Si es requerido

### 5. Modal (`components/ui/Modal.jsx`)
Modal reutilizable para recuperación de contraseña.

**Props**:
- `open`: Booleano para mostrar/ocultar
- `onClose`: Función al cerrar

### 6. UserAvatar (`components/ui/UserAvatar.jsx`)
Avatar de usuario con menú desplegable.

**Características**:
- Muestra iniciales del usuario
- Menú con opciones (Perfil, Pedidos, Configuración, Cerrar sesión)
- Cierre automático al hacer clic fuera
- Soporte para tecla Escape

---

## 📄 Páginas Implementadas

### 1. Home (`pages/Home.jsx`)

**Características**:
- Carrusel automático de servicios (Lavado, Planchado, Tintorería)
- Sección de características del servicio
- Call-to-action para registro
- **Indicador de estado de autenticación**:
  - Muestra rol y email si está logueado
  - Botón de cerrar sesión
  - Mensaje de bienvenida

**Carrusel**:
```javascript
const services = [
  { title: 'Lavado Profesional', image: lavadoImg, desc: '...' },
  { title: 'Planchado Perfecto', image: planchadoImg, desc: '...' },
  { title: 'Tintorería Especializada', image: tintoreriaImg, desc: '...' }
];
```

**Corrección de imports de imágenes**:
```javascript
import lavadoImg from '../components/assets/lavado.jpg';
import planchadoImg from '../components/assets/planchado.jpg';
import tintoreriaImg from '../components/assets/tintoreria.jpg';
```

### 2. LoginRegister (`pages/LoginRegister.jsx`)

**Características principales**:
- Interfaz animada para alternar entre Login y Registro
- Integración completa con backend
- Manejo de estados de carga y errores
- Validaciones de formulario
- Almacenamiento de token en localStorage
- Navegación automática según rol

**Modificaciones importantes**:

#### Login Simplificado (sin selector de rol)
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.ok) {
      localStorage.setItem('token', data.token);
      login(data.user);
      
      // Navegación según rol detectado por el backend
      switch(data.user.role) {
        case 'cliente': navigate('/customer'); break;
        case 'lavanderia': navigate('/laundry'); break;
        case 'admin': navigate('/admin'); break;
      }
    }
  } catch (error) {
    setError('Error de conexión con el servidor');
  }
};
```

#### Registro Solo para Clientes
```javascript
const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const userData = {
    role: 'cliente', // Hardcodeado - solo registro de clientes
    nombre,
    apellidos,
    email,
    telefono,
    password
  };

  // Envío al backend...
};
```

**Cambios en el formulario**:
- ❌ Eliminado selector de rol
- ❌ Eliminados campos específicos de lavandería/admin
- ✅ Solo campos de cliente (nombre, apellidos, email, teléfono, contraseña)
- ✅ Título cambiado a "Registrate"

---

## 🔐 Sistema de Autenticación

### AuthContext (`App.jsx`)

**Estado global**:
```javascript
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

**Funciones**:
```javascript
const login = (userData) => {
  setUser(userData);
  setIsAuthenticated(true);
};

const logout = () => {
  setUser(null);
  setIsAuthenticated(false);
  localStorage.removeItem('token');
  navigate('/');
};
```

**Persistencia**:
- Token guardado en `localStorage`
- Verificación al cargar la aplicación
- Limpieza al cerrar sesión

---

## 🛣️ Rutas Configuradas

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/auth/login_Registre" element={<LoginRegister />} />
  <Route path="/customer" element={<div>Customer Dashboard</div>} />
  <Route path="/laundry" element={<div>Laundry Dashboard</div>} />
  <Route path="/admin" element={<div>Admin Dashboard</div>} />
</Routes>
```

**Nota**: Las rutas `/customer`, `/laundry` y `/admin` son placeholders pendientes de implementación.

---

## 🎨 Estilos y Diseño

### Layout.css
Define variables CSS globales y estilos de navegación:

**Variables de color (Aurora Mist Palette)**:
```css
:root {
  --color-primary: hsl(210, 100%, 56%);
  --color-secondary: hsl(280, 100%, 70%);
  --color-accent: hsl(340, 100%, 70%);
  --color-background: hsl(220, 20%, 10%);
  --color-surface: hsl(220, 15%, 15%);
  --color-text: hsl(0, 0%, 95%);
}
```

**Sombras**:
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
```

### Home.css
Estilos específicos para la página principal:
- Carrusel de servicios
- Animaciones de transición
- Sección de características
- Call-to-action
- Responsive design

### login_Registre.css
Estilos para la página de autenticación:
- Contenedor animado
- Formularios con transiciones
- Inputs flotantes
- Botones estilizados
- Modo oscuro

---

## 🔧 Configuración

### Variables de Entorno (`.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Vite Config (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

### Tailwind Config (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 🐛 Problemas Resueltos

### 1. Imports de Imágenes
**Problema**: Las imágenes no se cargaban correctamente.

**Solución**: Actualizar todos los imports para apuntar a la carpeta correcta:
```javascript
// Antes
import logo from '../../assets/icons/logo.jpg';

// Después
import logo from '../components/assets/logo.jpg';
```

### 2. Imports de CSS
**Problema**: Los archivos CSS no encontraban `Layout.css`.

**Solución**: Corregir la ruta de importación:
```css
/* Antes */
@import url('../layout/Layout.css');

/* Después */
@import url('../components/layout/Layout.css');
```

### 3. Logo Placeholder
**Problema**: No existía el archivo de logo.

**Solución temporal**: Crear `public/logo.svg` como placeholder:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#3b82f6"/>
  <text x="50" y="60" text-anchor="middle" fill="white" font-size="30">AW</text>
</svg>
```

---

## 🔌 Integración con Backend

### Configuración de API
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### Peticiones HTTP

**Login**:
```javascript
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

**Registro**:
```javascript
const response = await fetch(`${API_URL}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
```

**Manejo de respuestas**:
```javascript
const data = await response.json();

if (data.ok) {
  // Éxito
  localStorage.setItem('token', data.token);
  login(data.user);
  navigate('/customer');
} else {
  // Error
  setError(data.error.message);
}
```

---

## 📊 Estado Actual

✅ **Completado**:
- Estructura de proyecto React con Vite
- Componentes de navegación (Header, Footer, NavButton)
- Componentes UI reutilizables (FloatingInput, Modal, UserAvatar)
- Página Home con carrusel y estado de autenticación
- Página LoginRegister con integración backend
- Sistema de autenticación con Context API
- Enrutamiento con React Router
- Estilos con Tailwind CSS y CSS custom
- Variables de entorno configuradas
- Corrección de todos los imports

⏳ **Pendiente**:
- Implementar páginas de Customer, Laundry y Admin
- Protección de rutas privadas
- Recuperación de contraseña funcional
- Edición de perfil de usuario
- Sistema de notificaciones/toasts
- Tests unitarios
- Optimización de imágenes
- PWA features

---

## 🚀 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Uso**:
```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview
```

---

## 📝 Decisiones de Diseño

### 1. Sin Selector de Rol en Login
Se eliminó el selector de rol porque el backend ahora detecta automáticamente el rol buscando el email en las tres tablas.

### 2. Registro Solo para Clientes
El formulario de registro solo permite crear cuentas de cliente. Las lavanderías y admins se crean directamente en la base de datos.

### 3. Context API para Autenticación
Se usa Context API en lugar de Redux porque:
- Aplicación pequeña/mediana
- Estado de autenticación simple
- Menos boilerplate
- Más fácil de mantener

### 4. Tailwind + CSS Custom
Se combina Tailwind con CSS custom porque:
- Tailwind para utilidades rápidas
- CSS custom para componentes complejos y animaciones
- Mejor organización de estilos específicos

### 5. Vite en lugar de Create React App
Vite ofrece:
- Inicio más rápido
- Hot Module Replacement instantáneo
- Build más rápido
- Configuración más simple

---

## 🎯 Próximos Pasos

1. **Implementar dashboards** para cada rol
2. **Proteger rutas** con middleware de autenticación
3. **Añadir sistema de notificaciones** (react-toastify)
4. **Implementar recuperación de contraseña**
5. **Crear componente de perfil** editable
6. **Añadir validaciones** más robustas en formularios
7. **Optimizar rendimiento** (lazy loading, code splitting)
8. **Añadir tests** (Vitest + React Testing Library)
9. **Implementar PWA** features
10. **Mejorar accesibilidad** (ARIA labels, keyboard navigation)

---

## 📚 Dependencias

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```
