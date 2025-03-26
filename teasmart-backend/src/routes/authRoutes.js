import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    // Validate input
    if (!name || !email || !password || !phoneNumber) {
        return res.status(400).json({ error: 'Name, email, password, and phone number are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number format
    const phoneRegex = /^(07\d{8}|\\+254\d{9})$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format. It should start with 07 or +254' });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if the email already exists
        const [existingUserByEmail] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUserByEmail.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check if the phone number already exists
        const [existingUserByPhone] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
        if (existingUserByPhone.length > 0) {
            return res.status(400).json({ error: 'Phone number already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, phoneNumber]
        );

        // Generate a JWT token for the new user
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token and user details
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                name,
                email,
                phoneNumber,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if the user exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with token and user details
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Redirect the user to the frontend with the token
        res.redirect(`http://localhost:3000?token=${token}`);
    }
);

export default router;