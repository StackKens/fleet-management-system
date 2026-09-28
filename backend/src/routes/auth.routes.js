const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');

// POST /api/auth/register — create a new account
router.post('/register', authController.register);

// POST /api/auth/login — authenticate and get token
router.post('/login', authController.login);

// GET /api/auth/me — get current user profile (protected)
router.get('/me', authenticate, authController.getMe);

module.exports = router;
