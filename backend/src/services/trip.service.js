const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all trips with optional filters
async function getAllTrips(filters = {}) {
  const { status, vehicleId, driverId, assignmentId } = filters;

  const where = {};
  if (status) where.status = status;
  if (vehicleId) where.vehicleId = vehicleId;
  if (driverId) where.driverId = driverId;
  if (assignmentId) where.assignmentId = assignmentId;

  return prisma.trip.findMany({
    where,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single trip by ID
async function getTripById(id) {
  return prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: { select: { id: true, name: true, phone: true, email: true } },
      assignment: { include: { request: true } },
    },
  });
}

// Create a new trip
async function createTrip(data) {
  return prisma.trip.create({
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true, phone: true } },
    },
  });
}

// Update trip status (start, complete, cancel)
async function updateTripStatus(id, data) {
  return prisma.trip.update({
    where: { id },
    data,
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
      driver: { select: { id: true, name: true, phone: true } },
    },
  });
}

// Delete a trip
async function deleteTrip(id) {
  return prisma.trip.delete({ where: { id } });
}

// Get trips for a specific driver
async function getDriverTrips(driverId) {
  return prisma.trip.findMany({
    where: { driverId },
    include: {
      vehicle: { select: { id: true, registration: true, make: true, model: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTripStatus,
  deleteTrip,
  getDriverTrips,
};
