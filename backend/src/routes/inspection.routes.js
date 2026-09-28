const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspection.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

router.get('/', inspectionController.getAll);
router.get('/:id', inspectionController.getById);

// Create inspection — Admin, Fleet Manager, Driver
router.post('/', authorize('Admin', 'Fleet Manager', 'Driver'), inspectionController.create);

// Update — Admin, Fleet Manager
router.put('/:id', authorize('Admin', 'Fleet Manager'), inspectionController.update);

// Delete — Admin only
router.delete('/:id', authorize('Admin'), inspectionController.remove);

module.exports = router;
