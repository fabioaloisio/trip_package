/**
 * @fileoverview Configuração de conexão com o banco de dados
 * @module config/database
 */

import './env.js';
import mysql from 'mysql2/promise';

console.log('Configurações do banco:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Criar o banco de dados se não existir
async function createDatabaseIfNotExists() {
    try {
        // Primeiro, conectar sem especificar o banco de dados
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Banco de dados ${process.env.DB_NAME} criado/verificado com sucesso`);
        
        await connection.end();
    } catch (error) {
        console.error('Erro ao criar banco de dados:', error);
        throw error;
    }
}

// Criar pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexão
pool.getConnection()
    .then(connection => {
        console.log('Conexão com o banco de dados estabelecida com sucesso');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar com o banco de dados:', err);
    });

export { createDatabaseIfNotExists };
export default pool; 