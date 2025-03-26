import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Usually 'localhost'
    user: process.env.DB_USER, // Usually 'root'
    password: process.env.DB_PASSWORD, //'#Jeremy5471'
    database: process.env.DB_NAME, // 'teasmat_db'
    port: process.env.DB_PORT || 3306, // MySQL port (default is 3306)
}).promise();

// Test the database connection
pool.getConnection()
    .then((connection) => {
        console.log('Connected to the database successfully!');
        connection.release(); // Release the connection
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

// Log database queries (optional)
pool.on('connection', (connection) => {
    console.log('New database connection established');

    connection.on('query', (query) => {
        console.log('Executing query:', query.sql);
    });

    connection.on('error', (err) => {
        console.error('Database connection error:', err);
    });
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

export default pool;