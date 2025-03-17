import { Router } from 'express';
import packagesController from '../controllers/packages.controller.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta operação.' });
    }
    next();
};

// Rotas públicas
router.get('/', packagesController.getAllPackages);

// Rota específica para o painel de administração
router.get('/admin/dashboard', isAuthenticated, isAdmin, (req, res) => {
    res.json({ 
        message: 'Painel de administração', 
        user: req.session.user 
    });
});

// Rotas que requerem autenticação
router.get('/:id', isAuthenticated, packagesController.getPackageById);

// Rotas que requerem privilégios de administrador
router.post('/', isAuthenticated, isAdmin, packagesController.createPackage);
router.put('/:id', isAuthenticated, isAdmin, packagesController.updatePackage);
router.delete('/:id', isAuthenticated, isAdmin, packagesController.deletePackage);

export default router;
