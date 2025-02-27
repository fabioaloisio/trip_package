/**
 * @fileoverview Inicialização do banco de dados
 * @module config/initDb
 */

import pool from './database.js';
import { createDatabaseIfNotExists } from './database.js';

export async function initializeDatabase() {
    try {
        console.log('Iniciando criação das tabelas...');

        // Criar banco de dados se não existir
        await createDatabaseIfNotExists();

        // Criar tabela users primeiro (pois é referenciada por bookings)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabela users criada com sucesso');
        
        // Criar tabela de pacotes
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS packages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                destination VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(255),
                departure_date DATE NOT NULL,
                duration INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                available_seats INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('Tabela packages criada com sucesso');
        
        // Verificar se já existem pacotes
        const [existingPackages] = await pool.execute('SELECT COUNT(*) as count FROM packages');
        console.log('Verificando pacotes existentes:', existingPackages[0].count);
        
        // Se não houver pacotes, inserir os exemplos
        if (existingPackages[0].count === 0) {
            console.log('Inserindo pacotes de exemplo...');
            await pool.execute(`
                INSERT INTO packages (
                    name, destination, description, image_url, 
                    departure_date, duration, price, available_seats
                ) VALUES 
                    ('Pacote Paris Romântica', 'Paris, França', 
                     'Explore a cidade luz com este pacote romântico que inclui visita à Torre Eiffel e passeio de barco no Rio Sena.', 
                     'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', 
                     '2024-06-15', 7, 5999.99, 20),
                    
                    ('Aventura na Amazônia', 'Manaus, Brasil', 
                     'Uma experiência única na maior floresta tropical do mundo, com passeios de barco e trilhas pela selva.', 
                     'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?auto=format&fit=crop&w=800&q=80',
                     '2024-07-10', 5, 2999.99, 15),
                    
                    ('Praias de Cancún', 'Cancún, México', 
                     'Relaxe nas praias paradisíacas de Cancún com este pacote all-inclusive em resort 5 estrelas.', 
                     'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=800&q=80', 
                     '2024-08-20', 6, 4599.99, 25)
            `);
            console.log('Pacotes de exemplo inseridos com sucesso');
        }
        
        // Criar tabela de reservas por último (pois depende de users e packages)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                package_id INT NOT NULL,
                quantity INT NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (package_id) REFERENCES packages(id)
            )
        `);
        
        console.log('Tabela bookings criada com sucesso');
        
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        throw error;
    }
} 