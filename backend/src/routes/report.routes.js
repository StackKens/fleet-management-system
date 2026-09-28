const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/reports — list available report types
router.get('/', reportController.listReports);

// GET /api/reports/:type — view report data (JSON)
router.get('/:type', authorize('Admin', 'Fleet Manager', 'Supervisor'), reportController.viewReport);

// GET /api/reports/:type/export — export report as CSV
router.get('/:type/export', authorize('Admin', 'Fleet Manager', 'Supervisor'), reportController.exportReport);

module.exports = router;
