/**
 * @fileoverview Rotas de pacotes de viagem
 * @module routes/packages
 */

import { Router } from 'express';
import Package from '../models/Package.js';
import Booking from '../models/Booking.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

/**
 * Lista todos os pacotes
 * @route GET /api/packages
 */
router.get('/', async (req, res) => {
    try {
        const packages = await Package.findAllPublic();
        res.json(packages);
    } catch (error) {
        console.error('Erro ao listar pacotes:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erro ao listar pacotes' });
    }
});

/**
 * Retorna detalhes de um pacote
 * @route GET /api/packages/:id
 */
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const package_ = await Package.findById(req.params.id);
        
        if (!package_) {
            return res.status(404).json({ error: 'Pacote não encontrado' });
        }
        res.json(package_);
    } catch (error) {
        console.error('Erro ao buscar pacote:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erro ao buscar pacote' });
    }
});

/**
 * Realiza a reserva de um pacote
 * @route POST /api/packages/:id/book
 */
router.post('/:id/book', isAuthenticated, async (req, res) => {
    try {
        const { quantity } = req.body;
        const packageId = req.params.id;
        
        // Busca o pacote
        const package_ = await Package.findById(packageId);
        if (!package_) {
            return res.status(404).json({ error: 'Pacote não encontrado' });
        }
        
        // Verifica disponibilidade
        if (package_.available_seats < quantity) {
            return res.status(400).json({ error: 'Quantidade indisponível' });
        }
        
        // Calcula o preço total
        const totalPrice = package_.price * quantity;
        
        // Cria a reserva
        const booking = await Booking.create({
            userId: req.session.user.id,
            packageId,
            quantity,
            totalPrice
        });
        
        // Atualiza a quantidade de lugares disponíveis
        await Package.updateAvailableSeats(packageId, quantity);
        
        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Erro na reserva:', error);
        res.status(500).json({ error: 'Erro ao processar reserva' });
    }
});

export default router; 