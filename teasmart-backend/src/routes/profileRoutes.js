import express from 'express';
import pool from '../config/db.js';
import passport from 'passport';

const router = express.Router();

// Fetch user profile
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query('SELECT name, email, phone_number FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;