const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all maintenance records with optional filters
async function getAllMaintenance(filters = {}) {
  const { status, vehicleId, type } = filters;

  const where = {};
  if (status) where.status = status;
  if (vehicleId) where.vehicleId = vehicleId;
  if (type) where.type = type;

  return prisma.maintenanceRecord.findMany({
    where,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single maintenance record by ID
async function getMaintenanceById(id) {
  return prisma.maintenanceRecord.findUnique({
    where: { id },
    include: { vehicle: true },
  });
}

// Create a new maintenance record
async function createMaintenance(data) {
  return prisma.maintenanceRecord.create({
    data,
    include: { vehicle: { select: { id: true, registration: true, make: true, model: true } } },
  });
}

// Update maintenance record (status, cost, parts, etc.)
async function updateMaintenance(id, data) {
  return prisma.maintenanceRecord.update({
    where: { id },
    data,
    include: { vehicle: { select: { id: true, registration: true, make: true, model: true } } },
  });
}

// Delete a maintenance record
async function deleteMaintenance(id) {
  return prisma.maintenanceRecord.delete({ where: { id } });
}

// Get maintenance summary (total cost, count by status)
async function getMaintenanceSummary() {
  const total = await prisma.maintenanceRecord.count();
  const scheduled = await prisma.maintenanceRecord.count({ where: { status: 'Scheduled' } });
  const inProgress = await prisma.maintenanceRecord.count({ where: { status: 'In progress' } });
  const completed = await prisma.maintenanceRecord.count({ where: { status: 'Completed' } });

  const totalCost = await prisma.maintenanceRecord.aggregate({
    _sum: { cost: true },
    where: { status: 'Completed' },
  });

  return {
    total,
    scheduled,
    inProgress,
    completed,
    totalCost: totalCost._sum.cost || 0,
  };
}

module.exports = {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceSummary,
};
