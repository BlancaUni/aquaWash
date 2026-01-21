const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/jwt');

/**
 * Valida el formato de email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Registro de usuario (cliente, lavanderia o admin)
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { role, email, password, ...otherData } = req.body;

        // Validaciones básicas
        if (!role || !['cliente', 'lavanderia', 'admin'].includes(role)) {
            return res.status(400).json({
                ok: false,
                error: {
                    code: 'INVALID_ROLE',
                    message: 'El rol debe ser: cliente, lavanderia o admin'
                }
            });
        }

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                ok: false,
                error: {
                    code: 'INVALID_EMAIL',
                    message: 'Email inválido o no proporcionado'
                }
            });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({
                ok: false,
                error: {
                    code: 'INVALID_PASSWORD',
                    message: 'La contraseña debe tener al menos 8 caracteres'
                }
            });
        }

        // Hash de la contraseña - TEMPORALMENTE DESACTIVADO
        // const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password; // TEMPORAL: contraseña en texto plano

        let query, values, insertId;

        // Registro según el rol
        if (role === 'cliente') {
            const { nombre, apellidos, telefono } = otherData;

            if (!nombre) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        code: 'MISSING_FIELD',
                        message: 'El nombre es requerido para clientes'
                    }
                });
            }

            // Verificar si el email ya existe
            const [existing] = await pool.query('SELECT id_cliente FROM clientes WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(409).json({
                    ok: false,
                    error: {
                        code: 'EMAIL_EXISTS',
                        message: 'El email ya está registrado'
                    }
                });
            }

            query = 'INSERT INTO clientes (nombre, apellidos, email, password, telefono) VALUES (?, ?, ?, ?, ?)';
            values = [nombre, apellidos || null, email, hashedPassword, telefono || null];

            const [result] = await pool.query(query, values);
            insertId = result.insertId;

        } else if (role === 'lavanderia') {
            const { nombre_comercial, telefono, descripcion, horarios, calle, numero, cp, ciudad } = otherData;

            if (!nombre_comercial || !calle || !numero || !cp || !ciudad) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        code: 'MISSING_FIELDS',
                        message: 'Nombre comercial, calle, número, CP y ciudad son requeridos para lavanderías'
                    }
                });
            }

            // Verificar si el email ya existe
            const [existing] = await pool.query('SELECT id_lavanderia FROM lavanderias WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(409).json({
                    ok: false,
                    error: {
                        code: 'EMAIL_EXISTS',
                        message: 'El email ya está registrado'
                    }
                });
            }

            query = 'INSERT INTO lavanderias (nombre_comercial, email, password, telefono, descripcion, horarios, calle, numero, cp, ciudad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            values = [nombre_comercial, email, hashedPassword, telefono || null, descripcion || null, horarios || null, calle, numero, cp, ciudad];

            const [result] = await pool.query(query, values);
            insertId = result.insertId;

        } else if (role === 'admin') {
            const { nombre } = otherData;

            if (!nombre) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        code: 'MISSING_FIELD',
                        message: 'El nombre es requerido para administradores'
                    }
                });
            }

            // Verificar si el email ya existe
            const [existing] = await pool.query('SELECT id_admin FROM admins WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.status(409).json({
                    ok: false,
                    error: {
                        code: 'EMAIL_EXISTS',
                        message: 'El email ya está registrado'
                    }
                });
            }

            query = 'INSERT INTO admins (nombre, email, password) VALUES (?, ?, ?)';
            values = [nombre, email, hashedPassword];

            const [result] = await pool.query(query, values);
            insertId = result.insertId;
        }

        // Generar token
        const token = generateToken({
            id: insertId,
            role: role,
            email: email
        });

        return res.status(201).json({
            ok: true,
            data: {
                token,
                user: {
                    id: insertId,
                    role,
                    email
                }
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            ok: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error interno del servidor'
            }
        });
    }
};

/**
 * Login de usuario - Auto-detecta el rol buscando el email en las 3 tablas
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                ok: false,
                error: {
                    code: 'INVALID_EMAIL',
                    message: 'Email inválido'
                }
            });
        }

        if (!password) {
            return res.status(400).json({
                ok: false,
                error: {
                    code: 'MISSING_PASSWORD',
                    message: 'Contraseña requerida'
                }
            });
        }

        // Buscar el email en las 3 tablas para detectar el rol automáticamente
        let user = null;
        let role = null;

        // Buscar en clientes
        const [clienteRows] = await pool.query(
            'SELECT id_cliente as id, nombre, apellidos, email, password, estado_cuenta as estado FROM clientes WHERE email = ?',
            [email]
        );
        if (clienteRows.length > 0) {
            user = clienteRows[0];
            role = 'cliente';
        }

        // Si no se encontró en clientes, buscar en lavanderías
        if (!user) {
            const [lavanderiaRows] = await pool.query(
                'SELECT id_lavanderia as id, nombre_comercial, email, password, estado FROM lavanderias WHERE email = ?',
                [email]
            );
            if (lavanderiaRows.length > 0) {
                user = lavanderiaRows[0];
                role = 'lavanderia';
            }
        }

        // Si no se encontró en lavanderías, buscar en admins
        if (!user) {
            const [adminRows] = await pool.query(
                'SELECT id_admin as id, nombre, email, password, estado FROM admins WHERE email = ?',
                [email]
            );
            if (adminRows.length > 0) {
                user = adminRows[0];
                role = 'admin';
            }
        }

        // Si no se encontró en ninguna tabla
        if (!user) {
            return res.status(401).json({
                ok: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Email o contraseña incorrectos'
                }
            });
        }

        // Verificar contraseña - TEMPORALMENTE DESACTIVADO
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password === user.password; // TEMPORAL: comparación directa

        if (!isPasswordValid) {
            return res.status(401).json({
                ok: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Email o contraseña incorrectos'
                }
            });
        }

        // Verificar estado de cuenta
        if (user.estado && user.estado !== 'activo' && user.estado !== 'activa') {
            return res.status(403).json({
                ok: false,
                error: {
                    code: 'ACCOUNT_DISABLED',
                    message: 'La cuenta está inactiva o bloqueada'
                }
            });
        }

        // Generar token
        const token = generateToken({
            id: user.id,
            role: role,
            email: user.email
        });

        // Remover password de la respuesta
        delete user.password;

        return res.status(200).json({
            ok: true,
            data: {
                token,
                user: {
                    ...user,
                    role
                }
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            ok: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error interno del servidor'
            }
        });
    }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/me
 */
const getProfile = async (req, res) => {
    try {
        const { id, role } = req.user;

        let query;

        if (role === 'cliente') {
            query = 'SELECT id_cliente as id, nombre, apellidos, email, telefono, estado_cuenta as estado, fecha_alta FROM clientes WHERE id_cliente = ?';
        } else if (role === 'lavanderia') {
            query = 'SELECT id_lavanderia as id, nombre_comercial, email, telefono, descripcion, horarios, calle, numero, cp, ciudad, estado, fecha_alta FROM lavanderias WHERE id_lavanderia = ?';
        } else if (role === 'admin') {
            query = 'SELECT id_admin as id, nombre, email, estado, fecha_alta FROM admins WHERE id_admin = ?';
        }

        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                ok: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'Usuario no encontrado'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            data: {
                ...rows[0],
                role
            }
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return res.status(500).json({
            ok: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Error interno del servidor'
            }
        });
    }
};

module.exports = {
    register,
    login,
    getProfile
};
