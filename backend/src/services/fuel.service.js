const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all fuel records with optional filters
async function getAllFuelRecords(filters = {}) {
  const { vehicleId, driverId, startDate, endDate } = filters;

  const where = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (driverId) where.driverId = driverId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  return prisma.fuelRecord.findMany({
    where,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single fuel record by ID
async function getFuelRecordById(id) {
  return prisma.fuelRecord.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: { select: { id: true, name: true, phone: true } },
    },
  });
}

// Create a new fuel record
async function createFuelRecord(data) {
  return prisma.fuelRecord.create({
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
  });
}

// Update a fuel record
async function updateFuelRecord(id, data) {
  return prisma.fuelRecord.update({
    where: { id },
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true } },
    },
  });
}

// Delete a fuel record
async function deleteFuelRecord(id) {
  return prisma.fuelRecord.delete({ where: { id } });
}

// Get fuel summary (total liters, total cost, avg cost per liter)
async function getFuelSummary(filters = {}) {
  const { vehicleId } = filters;

  const where = {};
  if (vehicleId) where.vehicleId = vehicleId;

  const totalRecords = await prisma.fuelRecord.count({ where });
  const totalLiters = await prisma.fuelRecord.aggregate({
    _sum: { liters: true },
    where,
  });
  const totalCost = await prisma.fuelRecord.aggregate({
    _sum: { totalCost: true },
    where,
  });

  const totalLitersValue = totalLiters._sum.liters || 0;
  const totalCostValue = totalCost._sum.totalCost || 0;

  return {
    totalRecords,
    totalLiters: totalLitersValue,
    totalCost: totalCostValue,
    avgCostPerLiter: totalLitersValue > 0 ? totalCostValue / totalLitersValue : 0,
  };
}

module.exports = {
  getAllFuelRecords,
  getFuelRecordById,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
  getFuelSummary,
};
