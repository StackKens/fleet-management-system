const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/maintenance — any authenticated user can view
router.get('/', maintenanceController.getAll);

// GET /api/maintenance/summary — maintenance status and cost summary
router.get('/summary', maintenanceController.getSummary);

// GET /api/maintenance/:id
router.get('/:id', maintenanceController.getById);

// POST /api/maintenance — Admin, Fleet Manager
router.post('/', authorize('Admin', 'Fleet Manager'), maintenanceController.create);

// PUT /api/maintenance/:id — Admin, Fleet Manager
router.put('/:id', authorize('Admin', 'Fleet Manager'), maintenanceController.update);

// DELETE /api/maintenance/:id — Admin only
router.delete('/:id', authorize('Admin'), maintenanceController.remove);

module.exports = router;
