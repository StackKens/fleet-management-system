const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/trips — any authenticated user can view
router.get('/', tripController.getAll);

// GET /api/trips/driver/:driverId — get trips for a specific driver
router.get('/driver/:driverId', tripController.getDriverTrips);

// GET /api/trips/:id — get single trip
router.get('/:id', tripController.getById);

// POST /api/trips — Admin, Fleet Manager, Supervisor
router.post('/', authorize('Admin', 'Fleet Manager', 'Supervisor'), tripController.create);

// PUT /api/trips/:id/status — Admin, Fleet Manager, Driver (own trips)
router.put('/:id/status', tripController.updateStatus);

// DELETE /api/trips/:id — Admin only
router.delete('/:id', authorize('Admin'), tripController.remove);

module.exports = router;
