const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all origins
app.use(cors());
app.use(express.json());

// Database Connection Configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'devuser',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'devdb',
  password: process.env.POSTGRES_PASSWORD || 'devpassword',
  port: 5432,
});

// 1. Root Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '3-Tier Backend API is running smoothly!',
    endpoints: {
      health: '/health',
      data: '/api/data'
    }
  });
});

// 2. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// 3. Database Connection Route
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'Successfully connected to PostgreSQL database!',
      db_timestamp: result.rows[0].now,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database',
      error: err.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
