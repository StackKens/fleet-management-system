const inspectionService = require('../services/inspection.service');

async function getAll(req, res, next) {
  try {
    const inspections = await inspectionService.getAllInspections(req.query);
    res.json({ success: true, data: inspections });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const inspection = await inspectionService.getInspectionById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }
    res.json({ success: true, data: inspection });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const inspection = await inspectionService.createInspection(req.body);
    res.status(201).json({ success: true, message: 'Inspection created', data: inspection });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const inspection = await inspectionService.updateInspection(req.params.id, req.body);
    res.json({ success: true, message: 'Inspection updated', data: inspection });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await inspectionService.deleteInspection(req.params.id);
    res.json({ success: true, message: 'Inspection deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
