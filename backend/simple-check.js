const { pool } = require('./src/config/db');

async function simpleCheck() {
    try {
        const [clientes] = await pool.query('SELECT COUNT(*) as total FROM clientes');
        const [lavanderias] = await pool.query('SELECT COUNT(*) as total FROM lavanderias');
        const [admins] = await pool.query('SELECT COUNT(*) as total FROM admins');

        console.log('CLIENTES:', clientes[0].total);
        console.log('LAVANDERIAS:', lavanderias[0].total);
        console.log('ADMINS:', admins[0].total);

        // Verificar si existe el usuario de prueba
        const [testUser] = await pool.query('SELECT email FROM clientes WHERE email = ?', ['cliente@test.com']);
        console.log('CLIENTE TEST EXISTS:', testUser.length > 0 ? 'SI' : 'NO');

        await pool.end();
    } catch (error) {
        console.error('ERROR:', error.message);
    }
}

simpleCheck();
