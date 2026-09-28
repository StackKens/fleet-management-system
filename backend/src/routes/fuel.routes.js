const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuel.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/fuel — any authenticated user can view
router.get('/', fuelController.getAll);

// GET /api/fuel/summary — fuel consumption summary
router.get('/summary', fuelController.getSummary);

// GET /api/fuel/:id
router.get('/:id', fuelController.getById);

// POST /api/fuel — Admin, Fleet Manager, Driver
router.post('/', authorize('Admin', 'Fleet Manager', 'Driver'), fuelController.create);

// PUT /api/fuel/:id — Admin, Fleet Manager
router.put('/:id', authorize('Admin', 'Fleet Manager'), fuelController.update);

// DELETE /api/fuel/:id — Admin only
router.delete('/:id', authorize('Admin'), fuelController.remove);

module.exports = router;
