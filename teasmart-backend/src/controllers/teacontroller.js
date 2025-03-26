import pool from '../config/db.js';

export const getTeaData = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tea_data');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};