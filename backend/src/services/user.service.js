const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users with optional filtering
async function getAllUsers(filters = {}) {
  const { role, status, departmentId, search } = filters;

  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (departmentId) where.departmentId = departmentId;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      department: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single user by ID
async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      department: { select: { id: true, name: true } },
    },
  });
}

// Update a user
async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      status: true,
      department: { select: { id: true, name: true } },
    },
  });
}

// Delete a user
async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
