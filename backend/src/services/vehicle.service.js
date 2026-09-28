const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllVehicles(filters = {}) {
  const { status, departmentId, search, vehicleType } = filters;

  const where = {};
  if (status) where.status = status;
  if (departmentId) where.departmentId = departmentId;
  if (vehicleType) where.vehicleType = vehicleType;
  if (search) {
    where.OR = [
      { registration: { contains: search, mode: 'insensitive' } },
      { make: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.vehicle.findMany({
    where,
    include: {
      department: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getVehicleById(id) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, name: true } },
      trips: { orderBy: { createdAt: 'desc' }, take: 5 },
      maintenanceRecords: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });
}

async function createVehicle(data) {
  return prisma.vehicle.create({
    data,
    include: { department: { select: { id: true, name: true } } },
  });
}

async function updateVehicle(id, data) {
  return prisma.vehicle.update({
    where: { id },
    data,
    include: { department: { select: { id: true, name: true } } },
  });
}

async function deleteVehicle(id) {
  return prisma.vehicle.delete({ where: { id } });
}

async function getVehicleSummary() {
  const total = await prisma.vehicle.count();
  const available = await prisma.vehicle.count({ where: { status: 'Available' } });
  const assigned = await prisma.vehicle.count({ where: { status: 'Assigned' } });
  const inService = await prisma.vehicle.count({ where: { status: 'In service' } });
  const maintenance = await prisma.vehicle.count({ where: { status: 'Maintenance' } });

  return { total, available, assigned, inService, maintenance };
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleSummary,
};
