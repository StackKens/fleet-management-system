// Server — Express app entry point
// This file sets up the Express server with all middleware and routes

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
// CORS — allows frontend to call this backend
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// JSON parsing — parses incoming JSON request bodies
app.use(express.json());

// Logging — logs each request to the console
app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────────────────────────
// Health check — simple endpoint to verify server is running
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Fleet Management API is running' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
// This must be last — catches all errors from routes above
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`CORS enabled for: ${config.corsOrigin}`);
});
