/**
 * @fileoverview Modelo de pacotes de viagem
 * @module models/Package
 */

import pool from '../config/database.js';

export class Package {
    /**
     * Cria um novo pacote de viagem
     * @param {Object} packageData - Dados do pacote
     * @returns {Promise<Object>} Pacote criado
     */
    static async create({ name, description, destination, image_url, departure_date, duration, price, available_seats }) {
        console.log('Criando novo pacote:', { name, destination });
        
        const [result] = await pool.execute(
            `INSERT INTO packages 
            (name, description, destination, image_url, departure_date, duration, price, available_seats) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, destination, image_url, departure_date, duration, price, available_seats]
        );
        
        console.log('Pacote criado com ID:', result.insertId);
        return {
            id: result.insertId,
            name,
            description,
            destination,
            image_url,
            departure_date,
            duration,
            price,
            available_seats
        };
    }
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
     * Busca todos os pacotes (incluindo passados) - para administradores
     * @returns {Promise<Array>} Lista completa de pacotes
     */
    static async findAllForAdmin() {
        const [rows] = await pool.execute(`
            SELECT * FROM packages 
            ORDER BY departure_date DESC
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
    
    /**
     * Atualiza um pacote existente
     * @param {number} id - ID do pacote
     * @param {Object} packageData - Dados atualizados do pacote
     * @returns {Promise<boolean>} Sucesso da operação
     */
    static async update(id, packageData) {
        console.log('Atualizando pacote ID:', id);
        
        const allowedFields = [
            'name', 'description', 'destination', 'image_url', 
            'departure_date', 'duration', 'price', 'available_seats'
        ];
        
        // Filtra apenas os campos permitidos que foram fornecidos
        const fields = Object.keys(packageData)
            .filter(key => allowedFields.includes(key) && packageData[key] !== undefined);
        
        if (fields.length === 0) {
            console.log('Nenhum campo válido para atualizar');
            return false;
        }
        
        // Constrói a query dinamicamente
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => packageData[field]);
        values.push(id); // Adiciona o ID para a cláusula WHERE
        
        const query = `UPDATE packages SET ${setClause} WHERE id = ?`;
        console.log('Query de atualização:', query);
        
        const [result] = await pool.execute(query, values);
        console.log('Resultado da atualização:', result.affectedRows > 0 ? 'Sucesso' : 'Falha');
        
        return result.affectedRows > 0;
    }
    
    /**
     * Exclui um pacote pelo ID
     * @param {number} id - ID do pacote
     * @returns {Promise<boolean>} Sucesso da operação
     */
    static async delete(id) {
        console.log('Excluindo pacote ID:', id);
        
        // Verificar se existem reservas para este pacote
        const [bookings] = await pool.execute(
            'SELECT COUNT(*) as count FROM bookings WHERE package_id = ?',
            [id]
        );
        
        if (bookings[0].count > 0) {
            console.log('Não é possível excluir: pacote possui reservas');
            throw new Error('Não é possível excluir um pacote que possui reservas');
        }
        
        const [result] = await pool.execute(
            'DELETE FROM packages WHERE id = ?',
            [id]
        );
        
        console.log('Resultado da exclusão:', result.affectedRows > 0 ? 'Sucesso' : 'Falha');
        return result.affectedRows > 0;
    }
}

export default Package;
