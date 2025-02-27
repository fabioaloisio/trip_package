/**
 * @fileoverview Rotas do dashboard
 * @module routes/dashboard
 */

import { Router } from 'express';

const router = Router();

/**
 * Rota principal do dashboard
 * @route GET /dashboard
 */
router.get('/', (req, res) => {
    res.render('dashboard', {
        user: req.session.user
    });
});

export default router; 