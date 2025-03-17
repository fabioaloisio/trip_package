/**
 * @fileoverview Modelo de usuário para autenticação com MySQL
 * @module models/User
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Configuração da conexão usando pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'seu_usuario',
    password: process.env.DB_PASSWORD || 'sua_senha',
    database: process.env.DB_NAME || 'seu_banco'
});

/**
 * Classe que representa um usuário
 * @class User
 */
export class User {
    /**
     * Cria um novo usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise<Object>} Usuário criado
     */
    static async create({ username, email, password, role = 'user' }) {
        // Validar dados
        if (!username || !email || !password) {
            throw new Error('Dados inválidos');
        }
    
        console.log('Tentando criar usuário:', { username, email, role });
        const hashedPassword = await bcrypt.hash(password, 10);
    
        try {
            const [result] = await pool.execute(
                'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
                [username, email, hashedPassword, role]
            );
        
            console.log('Usuário criado com sucesso:', result.insertId);
            return {
                id: result.insertId,
                username,
                email,
                role
            };
        } catch (error) {
            console.error('Erro detalhado ao criar usuário:', {
                code: error.code,
                errno: error.errno,
                sqlMessage: error.sqlMessage,
                sqlState: error.sqlState
            });
            throw error;
        }
    }

    /**
     * Encontra um usuário pelo email
     * @param {string} email - Email do usuário
     * @returns {Promise<Object|null>} Usuário encontrado ou null
     */
    static async findByEmail(email) {
        if (!email) return null;
        
        console.log('Procurando usuário por email:', email);
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        console.log('Resultado da busca:', rows[0] ? 'encontrado' : 'não encontrado');
        return rows[0] ?? null;
    }

    /**
     * Verifica se a senha está correta
     * @param {string} password - Senha a ser verificada
     * @param {string} hashedPassword - Senha hash armazenada
     * @returns {Promise<boolean>} Resultado da verificação
     */
    static async checkPassword(password, hashedPassword) {
        console.log('Verificando senha');
        const isValid = await bcrypt.compare(password, hashedPassword);
        console.log('Senha válida:', isValid);
        return isValid;
    }
}

export default User; 
