const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');

router.use(authenticate);

// GET /api/vehicles — any authenticated user can view
router.get('/', vehicleController.getAll);

// GET /api/vehicles/summary — vehicle status counts
router.get('/summary', vehicleController.getSummary);

// GET /api/vehicles/:id — get single vehicle
router.get('/:id', vehicleController.getById);

// POST /api/vehicles — Admin, Fleet Manager
router.post('/', authorize('Admin', 'Fleet Manager'), validate('vehicle'), vehicleController.create);

// PUT /api/vehicles/:id — Admin, Fleet Manager
router.put('/:id', authorize('Admin', 'Fleet Manager'), validate('vehicleUpdate'), vehicleController.update);

// DELETE /api/vehicles/:id — Admin only
router.delete('/:id', authorize('Admin'), vehicleController.remove);

module.exports = router;
