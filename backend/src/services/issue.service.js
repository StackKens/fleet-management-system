const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all issues with optional filters
async function getAllIssues(filters = {}) {
  const { status, vehicleId, severity, type } = filters;

  const where = {};
  if (status) where.status = status;
  if (vehicleId) where.vehicleId = vehicleId;
  if (severity) where.severity = severity;
  if (type) where.type = type;

  return prisma.issue.findMany({
    where,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single issue by ID
async function getIssueById(id) {
  return prisma.issue.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: { select: { id: true, name: true, phone: true } },
    },
  });
}

// Create a new issue
async function createIssue(data) {
  return prisma.issue.create({
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
  });
}

// Update an issue
async function updateIssue(id, data) {
  return prisma.issue.update({
    where: { id },
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
  });
}

// Delete an issue
async function deleteIssue(id) {
  return prisma.issue.delete({ where: { id } });
}

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};
