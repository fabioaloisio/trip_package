/**
 * Script para criar um usuário administrador
 * 
 * Uso: node src/scripts/create-admin.js
 */

import '../config/env.js';
import { User } from '../models/User.js';
import { initializeDatabase } from '../config/initDb.js';
import pool from '../config/database.js';

async function createAdminUser() {
    try {
        // Inicializa o banco de dados
        await initializeDatabase();
        
        // Verificar se a coluna role existe na tabela users
        try {
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
            }
        } catch (error) {
            console.error('Erro ao verificar/adicionar coluna role:', error);
            process.exit(1);
        }
        
        const adminData = {
            username: 'admin',
            email: 'admin@exemplo.com',
            password: 'admin123',
            role: 'admin'
        };
        
        console.log('Verificando se o administrador já existe...');
        const existingAdmin = await User.findByEmail(adminData.email);
        
        if (existingAdmin) {
            console.log('Usuário administrador já existe!');
            
            // Se o usuário existir mas não for admin, atualizá-lo para admin
            if (existingAdmin.role !== 'admin') {
                console.log('Atualizando usuário para administrador...');
                await pool.execute(
                    'UPDATE users SET role = ? WHERE id = ?',
                    ['admin', existingAdmin.id]
                );
                console.log('Usuário atualizado para administrador com sucesso!');
            }
            
            process.exit(0);
        }
        
        console.log('Criando usuário administrador...');
        const admin = await User.create(adminData);
        
        console.log('Administrador criado com sucesso!');
        console.log('Email:', adminData.email);
        console.log('Senha:', adminData.password);
        
        process.exit(0);
    } catch (error) {
        console.error('Erro ao criar administrador:', error);
        process.exit(1);
    }
}

createAdminUser();
