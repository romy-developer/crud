require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Requests from tools may not have an Origin header; browser requests must match our local frontend.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
}));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ success: true, message: 'API and PostgreSQL are connected.' });
  } catch {
    return res.status(503).json({ success: false, error: { message: 'PostgreSQL is unavailable.' } });
  }
});

app.use('/api/employees', employeeRoutes);
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found.' } });
});
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Employee API listening on http://localhost:${port}`);
});

function shutDown() {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
