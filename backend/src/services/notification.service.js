const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all notifications for a specific user
async function getUserNotifications(userId, filters = {}) {
  const { read, type } = filters;

  const where = { userId };
  if (read !== undefined) where.read = read === 'true';
  if (type) where.type = type;

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single notification by ID
async function getNotificationById(id) {
  return prisma.notification.findUnique({ where: { id } });
}

// Create a notification for a user
async function createNotification(data) {
  return prisma.notification.create({ data });
}

// Mark a notification as read
async function markAsRead(id) {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

// Mark all notifications as read for a user
async function markAllAsRead(userId) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

// Delete a notification
async function deleteNotification(id) {
  return prisma.notification.delete({ where: { id } });
}

// Get unread count for a user
async function getUnreadCount(userId) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

module.exports = {
  getUserNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
