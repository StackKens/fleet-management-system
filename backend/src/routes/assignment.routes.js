const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/assignments — any authenticated user can view
router.get('/', assignmentController.getAll);

// GET /api/assignments/:id
router.get('/:id', assignmentController.getById);

// POST /api/assignments — Admin, Fleet Manager, Supervisor
router.post('/', authorize('Admin', 'Fleet Manager', 'Supervisor'), assignmentController.create);

// PUT /api/assignments/:id — Admin, Fleet Manager
router.put('/:id', authorize('Admin', 'Fleet Manager'), assignmentController.update);

// DELETE /api/assignments/:id — Admin only
router.delete('/:id', authorize('Admin'), assignmentController.remove);

module.exports = router;
