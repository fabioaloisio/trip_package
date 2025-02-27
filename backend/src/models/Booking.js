/**
 * @fileoverview Modelo de reservas
 * @module models/Booking
 */

import pool from '../config/database.js';

export class Booking {
    /**
     * Cria uma nova reserva
     * @param {Object} bookingData - Dados da reserva
     * @returns {Promise<Object>} Reserva criada
     */
    static async create({ userId, packageId, quantity, totalPrice }) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO bookings (user_id, package_id, quantity, total_price) VALUES (?, ?, ?, ?)',
                [userId, packageId, quantity, totalPrice]
            );
            
            return {
                id: result.insertId,
                userId,
                packageId,
                quantity,
                totalPrice
            };
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            throw error;
        }
    }

    /**
     * Busca reservas de um usuário
     * @param {number} userId - ID do usuário
     * @returns {Promise<Array>} Lista de reservas
     */
    static async findByUserId(userId) {
        const [rows] = await pool.execute(`
            SELECT b.*, p.name, p.destination, p.departure_date
            FROM bookings b
            JOIN packages p ON b.package_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [userId]);
        return rows;
    }
}

export default Booking; 