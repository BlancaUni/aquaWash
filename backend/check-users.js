const { pool } = require('./src/config/db');

async function checkUsers() {
    try {
        console.log('🔍 Verificando usuarios en la base de datos...\n');

        // Verificar clientes
        const [clientes] = await pool.query('SELECT id_cliente, nombre, email FROM clientes');
        console.log('👥 CLIENTES:');
        if (clientes.length === 0) {
            console.log('   ❌ No hay clientes registrados');
        } else {
            clientes.forEach(c => {
                console.log(`   ✅ ${c.nombre} - ${c.email}`);
            });
        }

        // Verificar lavanderías
        const [lavanderias] = await pool.query('SELECT id_lavanderia, nombre_comercial, email FROM lavanderias');
        console.log('\n🏪 LAVANDERÍAS:');
        if (lavanderias.length === 0) {
            console.log('   ❌ No hay lavanderías registradas');
        } else {
            lavanderias.forEach(l => {
                console.log(`   ✅ ${l.nombre_comercial} - ${l.email}`);
            });
        }

        // Verificar admins
        const [admins] = await pool.query('SELECT id_admin, nombre, email FROM admins');
        console.log('\n👨‍💼 ADMINS:');
        if (admins.length === 0) {
            console.log('   ❌ No hay admins registrados');
        } else {
            admins.forEach(a => {
                console.log(`   ✅ ${a.nombre} - ${a.email}`);
            });
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
