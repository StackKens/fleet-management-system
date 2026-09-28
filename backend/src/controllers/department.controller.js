const departmentService = require('../services/department.service');

// GET /api/departments — list all departments
async function getAll(req, res, next) {
  try {
    const departments = await departmentService.getAllDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
}

// GET /api/departments/:id — get single department
async function getById(req, res, next) {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
}

// POST /api/departments — create department
async function create(req, res, next) {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({ success: true, message: 'Department created', data: department });
  } catch (error) {
    next(error);
  }
}

// PUT /api/departments/:id — update department
async function update(req, res, next) {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.json({ success: true, message: 'Department updated', data: department });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/departments/:id — delete department
async function remove(req, res, next) {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
