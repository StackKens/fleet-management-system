const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

router.get('/', issueController.getAll);
router.get('/:id', issueController.getById);

// Create issue — any authenticated user can report
router.post('/', issueController.create);

// Update — Admin, Fleet Manager
router.put('/:id', authorize('Admin', 'Fleet Manager'), issueController.update);

// Delete — Admin only
router.delete('/:id', authorize('Admin'), issueController.remove);

module.exports = router;
