const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all departments with user/vehicle/driver counts
async function getAllDepartments() {
  return prisma.department.findMany({
    include: {
      _count: { select: { users: true, vehicles: true, drivers: true } },
    },
    orderBy: { name: 'asc' },
  });
}

// Get a single department by ID
async function getDepartmentById(id) {
  return prisma.department.findUnique({
    where: { id },
    include: {
      users: { select: { id: true, name: true, email: true, role: true } },
      vehicles: { select: { id: true, registration: true, status: true } },
    },
  });
}

// Create a new department
async function createDepartment(data) {
  return prisma.department.create({ data });
}

// Update a department
async function updateDepartment(id, data) {
  return prisma.department.update({ where: { id }, data });
}

// Delete a department
async function deleteDepartment(id) {
  return prisma.department.delete({ where: { id } });
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
