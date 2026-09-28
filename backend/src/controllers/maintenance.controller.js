const maintenanceService = require('../services/maintenance.service');

// GET /api/maintenance — list all maintenance records
async function getAll(req, res, next) {
  try {
    const records = await maintenanceService.getAllMaintenance(req.query);
    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
}

// GET /api/maintenance/summary — maintenance status and cost summary
async function getSummary(req, res, next) {
  try {
    const summary = await maintenanceService.getMaintenanceSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

// GET /api/maintenance/:id — get single record
async function getById(req, res, next) {
  try {
    const record = await maintenanceService.getMaintenanceById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
}

// POST /api/maintenance — create maintenance record
async function create(req, res, next) {
  try {
    const record = await maintenanceService.createMaintenance(req.body);
    res.status(201).json({ success: true, message: 'Maintenance record created', data: record });
  } catch (error) {
    next(error);
  }
}

// PUT /api/maintenance/:id — update record
async function update(req, res, next) {
  try {
    const record = await maintenanceService.updateMaintenance(req.params.id, req.body);
    res.json({ success: true, message: 'Maintenance record updated', data: record });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/maintenance/:id — delete record
async function remove(req, res, next) {
  try {
    await maintenanceService.deleteMaintenance(req.params.id);
    res.json({ success: true, message: 'Maintenance record deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getSummary, getById, create, update, remove };
