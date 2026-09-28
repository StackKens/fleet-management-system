const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/departments — any authenticated user can view
router.get('/', departmentController.getAll);

// GET /api/departments/:id
router.get('/:id', departmentController.getById);

// POST /api/departments — Admin only
router.post('/', authorize('Admin'), departmentController.create);

// PUT /api/departments/:id — Admin only
router.put('/:id', authorize('Admin'), departmentController.update);

// DELETE /api/departments/:id — Admin only
router.delete('/:id', authorize('Admin'), departmentController.remove);

module.exports = router;
