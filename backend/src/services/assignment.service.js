const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all assignments with optional filters
async function getAllAssignments(filters = {}) {
  const { status, departmentId, vehicleId, driverId } = filters;

  const where = {};
  if (status) where.status = status;
  if (departmentId) where.departmentId = departmentId;
  if (vehicleId) where.vehicleId = vehicleId;
  if (driverId) where.driverId = driverId;

  return prisma.assignment.findMany({
    where,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true, phone: true } },
      department: { select: { id: true, name: true } },
      trips: { select: { id: true, status: true, destination: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single assignment by ID
async function getAssignmentById(id) {
  return prisma.assignment.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: { select: { id: true, name: true, phone: true, email: true } },
      department: { select: { id: true, name: true } },
      request: { select: { id: true, destination: true, purpose: true } },
      trips: { orderBy: { createdAt: 'desc' } },
    },
  });
}

// Create a new assignment (links vehicle + driver to a request)
async function createAssignment(data) {
  return prisma.assignment.create({
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true, phone: true } },
      department: { select: { id: true, name: true } },
    },
  });
}

// Update assignment status
async function updateAssignment(id, data) {
  return prisma.assignment.update({
    where: { id },
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true, phone: true } },
    },
  });
}

// Delete an assignment
async function deleteAssignment(id) {
  return prisma.assignment.delete({ where: { id } });
}

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
