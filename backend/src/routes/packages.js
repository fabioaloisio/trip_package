/**
 * @fileoverview Rotas de pacotes de viagem
 * @module routes/packages
 */

import { Router } from 'express';
import Package from '../models/Package.js';
import Booking from '../models/Booking.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta operação.' });
    }
    next();
};

/**
 * Lista todos os pacotes
 * @route GET /api/packages
 */
router.get('/', async (req, res) => {
    try {
        // Se o usuário for admin, retorna todos os pacotes com detalhes completos
        if (req.session && req.session.user && req.session.user.role === 'admin') {
            const packages = await Package.findAllForAdmin();
            return res.json(packages);
        }
        
        // Para usuários normais, retorna apenas informações públicas
        const packages = await Package.findAllPublic();
        res.json(packages);
    } catch (error) {
        console.error('Erro ao listar pacotes:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Erro ao listar pacotes' });
    }
});

/**
 * Painel de administração
 * @route GET /api/packages/admin/dashboard
 */
router.get('/admin/dashboard', isAuthenticated, isAdmin, async (req, res) => {
    try {
        // Busca estatísticas para o painel
        const [
            packages,
            bookingsCount,
            totalRevenue
        ] = await Promise.all([
            Package.findAllForAdmin(),
            pool.execute('SELECT COUNT(*) as count FROM bookings').then(([rows]) => rows[0].count),
            pool.execute('SELECT SUM(total_price) as total FROM bookings').then(([rows]) => rows[0].total || 0)
        ]);
        
        res.json({
            success: true,
            stats: {
                totalPackages: packages.length,
                totalBookings: bookingsCount,
                totalRevenue: totalRevenue
            },
            packages: packages
        });
    } catch (error) {
        console.error('Erro ao carregar painel de administração:', error);
        res.status(500).json({ error: 'Erro ao carregar painel de administração' });
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

/**
 * Cria um novo pacote (apenas admin)
 * @route POST /api/packages
 */
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { 
            name, description, destination, image_url, 
            departure_date, duration, price, available_seats 
        } = req.body;
        
        // Validação básica
        if (!name || !destination || !departure_date || !price || !available_seats) {
            return res.status(400).json({ 
                error: 'Dados incompletos. Todos os campos obrigatórios devem ser preenchidos.' 
            });
        }
        
        const newPackage = await Package.create({
            name, 
            description, 
            destination, 
            image_url, 
            departure_date, 
            duration, 
            price, 
            available_seats
        });
        
        res.status(201).json({
            success: true,
            package: newPackage
        });
    } catch (error) {
        console.error('Erro ao criar pacote:', error);
        res.status(500).json({ error: 'Erro ao criar pacote' });
    }
});

/**
 * Atualiza um pacote existente (apenas admin)
 * @route PUT /api/packages/:id
 */
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const packageId = req.params.id;
        
        // Verifica se o pacote existe
        const existingPackage = await Package.findById(packageId);
        if (!existingPackage) {
            return res.status(404).json({ error: 'Pacote não encontrado' });
        }
        
        // Atualiza o pacote
        const success = await Package.update(packageId, req.body);
        
        if (success) {
            // Busca o pacote atualizado
            const updatedPackage = await Package.findById(packageId);
            res.json({
                success: true,
                package: updatedPackage
            });
        } else {
            res.status(400).json({ error: 'Não foi possível atualizar o pacote' });
        }
    } catch (error) {
        console.error('Erro ao atualizar pacote:', error);
        res.status(500).json({ error: 'Erro ao atualizar pacote' });
    }
});

/**
 * Exclui um pacote (apenas admin)
 * @route DELETE /api/packages/:id
 */
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const packageId = req.params.id;
        
        // Verifica se o pacote existe
        const existingPackage = await Package.findById(packageId);
        if (!existingPackage) {
            return res.status(404).json({ error: 'Pacote não encontrado' });
        }
        
        // Tenta excluir o pacote
        try {
            const success = await Package.delete(packageId);
            if (success) {
                res.json({ success: true, message: 'Pacote excluído com sucesso' });
            } else {
                res.status(400).json({ error: 'Não foi possível excluir o pacote' });
            }
        } catch (error) {
            if (error.message.includes('possui reservas')) {
                return res.status(400).json({ 
                    error: 'Não é possível excluir um pacote que possui reservas' 
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Erro ao excluir pacote:', error);
        res.status(500).json({ error: 'Erro ao excluir pacote' });
    }
});

export default router;
