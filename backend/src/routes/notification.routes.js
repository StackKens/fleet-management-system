const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// GET /api/notifications — current user's notifications
router.get('/', notificationController.getMine);

// GET /api/notifications/unread-count — unread count
router.get('/unread-count', notificationController.getUnreadCount);

// GET /api/notifications/:id — single notification
router.get('/:id', notificationController.getById);

// POST /api/notifications — create notification (Admin, Fleet Manager)
router.post('/', authorize('Admin', 'Fleet Manager'), notificationController.create);

// PUT /api/notifications/:id/read — mark as read
router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/mark-all-read — mark all as read
router.put('/mark-all-read', notificationController.markAllAsRead);

// DELETE /api/notifications/:id — delete notification
router.delete('/:id', notificationController.remove);

module.exports = router;
