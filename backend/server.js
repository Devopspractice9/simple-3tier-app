const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Allow Cross-Origin Requests from Frontend
app.use(cors());

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'devuser',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'devdb',
  password: process.env.POSTGRES_PASSWORD || 'devpassword',
  port: 5432,
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Connected to Database!', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Backend listening on port 5000'));
