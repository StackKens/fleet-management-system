const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all requests with optional filters
async function getAllRequests(filters = {}) {
  const { status, departmentId, requesterId, search } = filters;

  const where = {};
  if (status) where.status = status;
  if (departmentId) where.departmentId = departmentId;
  if (requesterId) where.requesterId = requesterId;
  if (search) {
    where.OR = [
      { destination: { contains: search, mode: 'insensitive' } },
      { purpose: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.vehicleRequest.findMany({
    where,
    include: {
      requester: { select: { id: true, name: true, email: true } },
      department: { select: { id: true, name: true } },
      assignment: { include: { vehicle: true, driver: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single request by ID
async function getRequestById(id) {
  return prisma.vehicleRequest.findUnique({
    where: { id },
    include: {
      requester: { select: { id: true, name: true, email: true } },
      department: { select: { id: true, name: true } },
      assignment: { include: { vehicle: true, driver: true } },
    },
  });
}

// Create a new vehicle request
async function createRequest(data) {
  return prisma.vehicleRequest.create({
    data,
    include: {
      requester: { select: { id: true, name: true, email: true } },
      department: { select: { id: true, name: true } },
    },
  });
}

// Update request status (approve/decline)
async function updateRequestStatus(id, status, reviewedBy, reviewReason) {
  return prisma.vehicleRequest.update({
    where: { id },
    data: { status, reviewedBy, reviewedDate: new Date().toISOString(), reviewReason },
    include: {
      requester: { select: { id: true, name: true, email: true } },
      department: { select: { id: true, name: true } },
    },
  });
}

// Delete a request
async function deleteRequest(id) {
  return prisma.vehicleRequest.delete({ where: { id } });
}

// Get request status summary
async function getRequestSummary() {
  const total = await prisma.vehicleRequest.count();
  const pending = await prisma.vehicleRequest.count({ where: { status: 'Pending' } });
  const approved = await prisma.vehicleRequest.count({ where: { status: 'Approved' } });
  const declined = await prisma.vehicleRequest.count({ where: { status: 'Declined' } });
  const completed = await prisma.vehicleRequest.count({ where: { status: 'Completed' } });

  return { total, pending, approved, declined, completed };
}

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
  getRequestSummary,
};
