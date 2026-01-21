const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Configurar CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({
        ok: true,
        message: 'AquaWash API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta 404
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Ruta no encontrada'
        }
    });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        ok: false,
        error: {
            code: 'SERVER_ERROR',
            message: 'Error interno del servidor'
        }
    });
});

module.exports = app;
