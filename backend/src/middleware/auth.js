/**
 * @fileoverview Middleware de autenticação
 * @module middleware/auth
 */

/**
 * Middleware para verificar se o usuário está autenticado
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
export function isAuthenticated(req, res, next) {
    console.log('Verificando autenticação');
    console.log('Sessão:', req.session);
    console.log('Usuário na sessão:', req.session.user);
    
    if (!req.session.user) {
        console.log('Usuário não autenticado');
        return res.status(401).json({ error: 'Não autorizado' });
    }
    console.log('Usuário autenticado:', req.session.user.id);
    next();
}

export default isAuthenticated; 