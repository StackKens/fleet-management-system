const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All user routes require authentication
router.use(authenticate);

// GET /api/users — list users (Admin, Fleet Manager, Supervisor)
router.get('/', authorize('Admin', 'Fleet Manager', 'Supervisor'), userController.getAll);

// GET /api/users/:id — get single user
router.get('/:id', userController.getById);

// PUT /api/users/:id — update user (Admin, Fleet Manager)
router.put('/:id', authorize('Admin', 'Fleet Manager'), userController.update);

// DELETE /api/users/:id — delete user (Admin only)
router.delete('/:id', authorize('Admin'), userController.remove);

module.exports = router;
