require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 3000;

// Iniciar servidor
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        await testConnection();

        // Iniciar servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 CORS habilitado para: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
