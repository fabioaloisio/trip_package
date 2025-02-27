/**
 * @fileoverview Configuração principal do servidor Express
 * @module app
 */

import './config/env.js';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { configureSession } from './config/session.js';
import { initializeDatabase } from './config/initDb.js';
import packageRoutes from './routes/packages.js';
import authRoutes from './routes/auth.js';

async function startServer() {
    try {
        // Inicializa o banco de dados
        await initializeDatabase();

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const app = express();

        // Configuração do CORS
        app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3002',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Configuração do express
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static(join(__dirname, '../../frontend/src')));

        // Configuração da sessão
        app.use(configureSession());

        // Rotas de autenticação
        app.use('/api/auth', authRoutes);

        // Rotas de pacotes
        app.use('/api/packages', packageRoutes);

        // Rota principal
        app.get('/', (req, res) => {
            res.sendFile(join(__dirname, '../../frontend/src/index.html'));
        });

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

        return app;
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();