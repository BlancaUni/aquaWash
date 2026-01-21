const { verifyToken } = require('../utils/jwt');

/**
 * Middleware para verificar autenticación
 * Verifica que el token JWT sea válido y añade los datos del usuario a req.user
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                ok: false,
                error: {
                    code: 'NO_TOKEN',
                    message: 'No se proporcionó token de autenticación'
                }
            });
        }

        const token = authHeader.substring(7); // Remover 'Bearer '

        // Verificar token
        const decoded = verifyToken(token);

        // Añadir datos del usuario a la request
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email
        };

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            error: {
                code: 'INVALID_TOKEN',
                message: error.message || 'Token inválido'
            }
        });
    }
};

module.exports = authMiddleware;
