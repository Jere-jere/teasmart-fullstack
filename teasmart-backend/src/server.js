import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import axios from 'axios';
import africastalking from 'africastalking'; // Replace Twilio with Africa's Talking
import teaRoutes from './routes/teaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import pool from './config/db.js'; // Import your MySQL connection pool

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Africa's Talking
const africastalkingCredentials = {
    apiKey: process.env.AFRICASTALKING_API_KEY, // Add this to your .env file
    username: process.env.AFRICASTALKING_USERNAME || 'Teasmart', // Use 'sandbox' for testing
};

const africastalkingClient = africastalking(africastalkingCredentials);
const sms = africastalkingClient.SMS;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ==================================================
// JWT Strategy Configuration
// ==================================================
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [payload.id]);
            if (rows.length > 0) {
                return done(null, rows[0]);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

// ==================================================
// Google OAuth Strategy Configuration
// ==================================================
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const [rows] = await pool.query('SELECT * FROM users WHERE googleId = ?', [profile.id]);
                if (rows.length > 0) {
                    return done(null, rows[0]);
                }

                const [result] = await pool.query(
                    'INSERT INTO users (name, email, googleId) VALUES (?, ?, ?)',
                    [profile.displayName, profile.emails[0].value, profile.id]
                );

                const newUser = { id: result.insertId, ...profile };
                done(null, newUser);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// ==================================================
// Serialize and Deserialize User
// ==================================================
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length > 0) {
            done(null, rows[0]);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (error) {
        done(error, null);
    }
});

// ==================================================
// Routes
// ==================================================
app.use('/api', teaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);

// ==================================================
// Rasa Chat Endpoint
// ==================================================
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        const rasaResponse = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
            sender: 'user',
            message: message,
        });

        console.log('Rasa response:', rasaResponse.data);
        const botReply = rasaResponse.data[0].text;
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error communicating with Rasa:', error);
        res.status(500).json({ error: 'Failed to communicate with the bot' });
    }
});

// ==================================================
// Fetch All News
// ==================================================
app.get('/api/news', async (req, res) => {
    try {
        console.log('Fetching news from the database...');
        const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
        console.log('News data:', rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news.' });
    }
});

// ==================================================
// Fetch All Upcoming Events
// ==================================================
app.get('/api/events', async (req, res) => {
    try {
        console.log('Fetching events from the database...');
        const [rows] = await pool.query('SELECT * FROM events WHERE event_date >= NOW() ORDER BY event_date ASC');
        console.log('Events data:', rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events.' });
    }
});

// ==================================================
// Fetch Latest News and Upcoming Event (for SMS)
// ==================================================
async function fetchLatestNews() {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC LIMIT 1');
    return rows[0];
}

async function fetchUpcomingEvents() {
    const [rows] = await pool.query('SELECT * FROM events WHERE event_date >= NOW() ORDER BY event_date ASC LIMIT 1');
    return rows[0];
}

// ==================================================
// Send News/Events via SMS Endpoint (Using Africa's Talking)
// ==================================================
app.post('/api/send-news', async (req, res) => {
    console.log('Request body:', req.body); // Log the request body

    const { phoneNumber } = req.body;

    // Validate input
    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    // Format phone number
    const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`;

    try {
        // Fetch latest news and events
        const latestNews = await fetchLatestNews();
        const upcomingEvent = await fetchUpcomingEvents();

        // Check if there's data to send
        if (!latestNews && !upcomingEvent) {
            return res.status(400).json({ success: false, message: 'No news or events available to send.' });
        }

        // Compose SMS message
        let message = 'Latest updates from TeaSmart:\n';
        if (latestNews) {
            message += `📰 News: ${latestNews.title}\n${latestNews.description}\n\n`;
        }
        if (upcomingEvent) {
            message += `🎉 Event: ${upcomingEvent.title}\n📅 Date: ${upcomingEvent.event_date}\n📍 Location: ${upcomingEvent.location}\n`;
        }

        // Truncate message if too long
        if (message.length > 1600) {
            message = message.substring(0, 1600);
        }

        // Send SMS using Africa's Talking
        const response = await sms.send({
            to: [formattedPhoneNumber],
            message: message,
        });

        console.log('Africa\'s Talking response:', response);

        // Check if the recipient is blacklisted
        if (response.SMSMessageData.Recipients[0].status === 'UserInBlacklist') {
            return res.status(400).json({ success: false, message: 'Recipient is blacklisted.', response });
        }

        res.status(200).json({ success: true, message: 'News/events sent successfully!', response });
    } catch (error) {
        console.error('Africa\'s Talking error:', error);
        res.status(500).json({ success: false, message: 'Failed to send news/events.', error: error.message });
    }
});

// ==================================================
// Start the server
// ==================================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});