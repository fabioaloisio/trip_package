/**
 * @fileoverview Configuração da sessão
 * @module config/session
 */

import './env.js';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';

export function configureSession(options) {
    // Usar as mesmas credenciais do banco de dados
    const dbOptions = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'backend'
    };

    const MySQLStoreSession = MySQLStore(session);
    const sessionStore = new MySQLStoreSession(dbOptions);

    return session({
        key: process.env.SESSION_KEY || 'session_cookie_name',
        secret: process.env.SESSION_SECRET || 'sua_chave_secreta',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 24 horas
            secure: process.env.NODE_ENV === 'production'
        }
    });
} 