const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/requests — list requests (staff see only their own)
router.get('/', requestController.getAll);

// GET /api/requests/summary — request status counts
router.get('/summary', requestController.getSummary);

// GET /api/requests/:id — get single request
router.get('/:id', requestController.getById);

// POST /api/requests — create request (any authenticated user)
router.post('/', requestController.create);

// PUT /api/requests/:id/status — approve/decline (Admin, Fleet Manager)
router.put('/:id/status', authorize('Admin', 'Fleet Manager'), requestController.updateStatus);

// DELETE /api/requests/:id — delete request (Admin only)
router.delete('/:id', authorize('Admin'), requestController.remove);

module.exports = router;
