/**
 * @fileoverview Modelo de pacotes de viagem
 * @module models/Package
 */

import pool from '../config/database.js';

export class Package {
    /**
     * Busca todos os pacotes com informações públicas
     * @returns {Promise<Array>} Lista de pacotes
     */
    static async findAllPublic() {
        console.log('Buscando pacotes públicos...');
        const [rows] = await pool.execute(`
            SELECT 
                id,
                name,
                destination,
                image_url,
                departure_date,
                price
            FROM packages 
            ORDER BY departure_date ASC
        `);
        console.log('SQL executado com sucesso');
        console.log('Resultados:', rows);
        return rows;
    }

    /**
     * Busca todos os pacotes com detalhes completos
     * @returns {Promise<Array>} Lista de pacotes
     */
    static async findAll() {
        const [rows] = await pool.execute(`
            SELECT * FROM packages 
            WHERE departure_date >= CURDATE()
            ORDER BY departure_date ASC
        `);
        return rows;
    }

    /**
     * Busca um pacote pelo ID
     * @param {number} id - ID do pacote
     * @returns {Promise<Object|null>} Pacote encontrado ou null
     */
    static async findById(id) {
        console.log('Buscando pacote por ID:', id);
        const [rows] = await pool.execute(
            'SELECT * FROM packages WHERE id = ?',
            [id]
        );
        console.log('Resultado da busca:', rows[0] || 'Nenhum pacote encontrado');
        return rows[0] || null;
    }

    /**
     * Atualiza a quantidade de lugares disponíveis
     * @param {number} id - ID do pacote
     * @param {number} quantity - Quantidade a reduzir
     */
    static async updateAvailableSeats(id, quantity) {
        await pool.execute(
            'UPDATE packages SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?',
            [quantity, id, quantity]
        );
    }
}

export default Package; 