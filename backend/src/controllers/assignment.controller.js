const assignmentService = require('../services/assignment.service');

// GET /api/assignments — list all assignments
async function getAll(req, res, next) {
  try {
    const assignments = await assignmentService.getAllAssignments(req.query);
    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
}

// GET /api/assignments/:id — get single assignment
async function getById(req, res, next) {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
}

// POST /api/assignments — create assignment (link vehicle + driver)
async function create(req, res, next) {
  try {
    const assignment = await assignmentService.createAssignment(req.body);
    res.status(201).json({ success: true, message: 'Assignment created', data: assignment });
  } catch (error) {
    next(error);
  }
}

// PUT /api/assignments/:id — update assignment
async function update(req, res, next) {
  try {
    const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
    res.json({ success: true, message: 'Assignment updated', data: assignment });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/assignments/:id — delete assignment
async function remove(req, res, next) {
  try {
    await assignmentService.deleteAssignment(req.params.id);
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
