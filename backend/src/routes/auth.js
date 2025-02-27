/**
 * @fileoverview Rotas de autenticação
 * @module routes/auth
 */

import { Router } from 'express';
import User from '../models/User.js';
import pool from '../config/database.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

/**
 * Rota de registro de usuário
 * @route POST /auth/register
 */
router.post('/register', async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);
        const { username, email, password } = req.body;
        
        // Validação básica
        if (!username || !email || !password) {
            console.log('Dados inválidos:', { username, email, password });
            return res.status(400).json({ 
                error: 'Todos os campos são obrigatórios' 
            });
        }

        // Verificar se usuário já existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            console.log('Email já existe:', email);
            return res.status(400).json({ 
                error: 'Email já está em uso' 
            });
        }

        const user = await User.create({ username, email, password });
        
        req.session.user = { 
            id: user.id, 
            username: user.username 
        };
        
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                username: user.username 
            } 
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        // Verificar o tipo específico de erro
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                error: 'Nome de usuário ou email já existe' 
            });
        }
        // Log mais detalhado do erro
        console.error('Detalhes do erro:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            error: 'Erro interno do servidor ao criar usuário'
        });
    }
});

/**
 * Rota de login
 * @route POST /auth/login
 */
router.post('/login', async (req, res) => {
    try {
        console.log('Tentativa de login:', { email: req.body.email });
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('Dados de login inválidos');
            return res.status(400).json({ 
                error: 'Email e senha são obrigatórios' 
            });
        }

        const user = await User.findByEmail(email);
        console.log('Usuário encontrado:', user ? 'sim' : 'não');
        
        if (!user || !(await User.checkPassword(password, user.password))) {
            console.log('Senha inválida ou usuário não encontrado');
            return res.status(401).json({ 
                error: 'Credenciais inválidas' 
            });
        }

        console.log('Login bem-sucedido para:', user.username);
        req.session.user = { 
            id: user.id, 
            username: user.username 
        };
        
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                username: user.username 
            } 
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * Rota de logout
 * @route GET /auth/logout
 */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Adicionar rota de debug (remover em produção)
router.get('/debug/users', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, email, created_at FROM users');
        const [tableInfo] = await pool.execute('DESCRIBE users');
        res.json({
            tableStructure: tableInfo,
            users: rows
        });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

/**
 * Verifica se o usuário está autenticado
 * @route GET /api/auth/check
 */
router.get('/check', (req, res) => {
    res.json({ 
        authenticated: !!req.session.user,
        user: req.session.user 
    });
});

export default router; 