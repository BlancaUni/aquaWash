const mysql = require('mysql2/promise');

// Crear pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'aquawash',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Verificar conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a MariaDB establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar con MariaDB:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, testConnection };
