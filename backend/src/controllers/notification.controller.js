const notificationService = require('../services/notification.service');

// GET /api/notifications — get current user's notifications
async function getMine(req, res, next) {
  try {
    const notifications = await notificationService.getUserNotifications(req.userId, req.query);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

// GET /api/notifications/unread-count — get unread count
async function getUnreadCount(req, res, next) {
  try {
    const count = await notificationService.getUnreadCount(req.userId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
}

// GET /api/notifications/:id — get single notification
async function getById(req, res, next) {
  try {
    const notification = await notificationService.getNotificationById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
}

// POST /api/notifications — create notification (Admin, Fleet Manager)
async function create(req, res, next) {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json({ success: true, message: 'Notification created', data: notification });
  } catch (error) {
    next(error);
  }
}

// PUT /api/notifications/:id/read — mark as read
async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    next(error);
  }
}

// PUT /api/notifications/mark-all-read — mark all as read
async function markAllAsRead(req, res, next) {
  try {
    await notificationService.markAllAsRead(req.userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/notifications/:id — delete notification
async function remove(req, res, next) {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMine, getUnreadCount, getById, create, markAsRead, markAllAsRead, remove };
