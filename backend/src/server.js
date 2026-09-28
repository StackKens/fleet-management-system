const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Fleet Management API is running' });
});

app.use('/api/auth', require('./routes/auth.routes'));

app.get('/api/protected', require('./middleware/auth'), (req, res) => {
  res.json({
    success: true,
    message: 'You have access to this protected route',
    user: { id: req.userId, name: req.userName, role: req.userRole },
  });
});

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/vehicles', require('./routes/vehicle.routes'));
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/assignments', require('./routes/assignment.routes'));
app.use('/api/trips', require('./routes/trip.routes'));
app.use('/api/maintenance', require('./routes/maintenance.routes'));
app.use('/api/fuel', require('./routes/fuel.routes'));
app.use('/api/inspections', require('./routes/inspection.routes'));
app.use('/api/issues', require('./routes/issue.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/reports', require('./routes/report.routes'));

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
