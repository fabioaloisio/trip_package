/**
 * @fileoverview Script para atualizar o esquema do banco de dados
 * 
 * Uso: node src/scripts/update-db.js
 */

import '../config/env.js';
import pool from '../config/database.js';

async function updateDatabase() {
    try {
        console.log('Iniciando atualização do banco de dados...');
        
        // Verificar se a coluna role existe na tabela users
        const [columns] = await pool.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'role'
        `);
        
        // Se a coluna não existir, adicioná-la
        if (columns.length === 0) {
            console.log('Adicionando coluna role à tabela users...');
            await pool.execute(`
                ALTER TABLE users 
                ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'
            `);
            console.log('Coluna role adicionada com sucesso');
        } else {
            console.log('Coluna role já existe na tabela users');
        }
        
        console.log('Atualização do banco de dados concluída com sucesso');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao atualizar banco de dados:', error);
        process.exit(1);
    }
}

updateDatabase();
