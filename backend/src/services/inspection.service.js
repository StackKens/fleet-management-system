const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all inspections with optional filters
async function getAllInspections(filters = {}) {
  const { vehicleId, type, result, driverId } = filters;

  const where = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (type) where.type = type;
  if (result) where.result = result;
  if (driverId) where.driverId = driverId;

  return prisma.inspection.findMany({
    where,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single inspection by ID
async function getInspectionById(id) {
  return prisma.inspection.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: { select: { id: true, name: true, phone: true } },
    },
  });
}

// Create a new inspection
async function createInspection(data) {
  return prisma.inspection.create({
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
  });
}

// Update an inspection
async function updateInspection(id, data) {
  return prisma.inspection.update({
    where: { id },
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
  });
}

// Delete an inspection
async function deleteInspection(id) {
  return prisma.inspection.delete({ where: { id } });
}

module.exports = {
  getAllInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  deleteInspection,
};
