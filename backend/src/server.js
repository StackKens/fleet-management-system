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

// Authentication routes — register, login, get current user
app.use('/api/auth', require('./routes/auth.routes'));

// Protected test route — only accessible with valid token
app.get('/api/protected', require('./middleware/auth'), (req, res) => {
  res.json({
    success: true,
    message: 'You have access to this protected route',
    user: { id: req.userId, name: req.userName, role: req.userRole },
  });
});

// User management routes
app.use('/api/users', require('./routes/user.routes'));

// Department management routes
app.use('/api/departments', require('./routes/department.routes'));

// Vehicle management routes
app.use('/api/vehicles', require('./routes/vehicle.routes'));

// Vehicle request management routes
app.use('/api/requests', require('./routes/request.routes'));

// Assignment management routes
app.use('/api/assignments', require('./routes/assignment.routes'));

// Trip management routes
app.use('/api/trips', require('./routes/trip.routes'));

// Maintenance management routes
app.use('/api/maintenance', require('./routes/maintenance.routes'));

// Fuel management routes
app.use('/api/fuel', require('./routes/fuel.routes'));

// Inspection management routes
app.use('/api/inspections', require('./routes/inspection.routes'));

// Issue management routes
app.use('/api/issues', require('./routes/issue.routes'));

// ─── Error Handler ────────────────────────────────────────────────────────────
// This must be last — catches all errors from routes above
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`CORS enabled for: ${config.corsOrigin}`);
});
