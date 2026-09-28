const fuelService = require('../services/fuel.service');

// GET /api/fuel — list all fuel records
async function getAll(req, res, next) {
  try {
    const records = await fuelService.getAllFuelRecords(req.query);
    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
}

// GET /api/fuel/summary — fuel consumption summary
async function getSummary(req, res, next) {
  try {
    const summary = await fuelService.getFuelSummary(req.query);
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

// GET /api/fuel/:id — get single record
async function getById(req, res, next) {
  try {
    const record = await fuelService.getFuelRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Fuel record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
}

// POST /api/fuel — create fuel record
async function create(req, res, next) {
  try {
    const record = await fuelService.createFuelRecord(req.body);
    res.status(201).json({ success: true, message: 'Fuel record created', data: record });
  } catch (error) {
    next(error);
  }
}

// PUT /api/fuel/:id — update fuel record
async function update(req, res, next) {
  try {
    const record = await fuelService.updateFuelRecord(req.params.id, req.body);
    res.json({ success: true, message: 'Fuel record updated', data: record });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/fuel/:id — delete fuel record
async function remove(req, res, next) {
  try {
    await fuelService.deleteFuelRecord(req.params.id);
    res.json({ success: true, message: 'Fuel record deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getSummary, getById, create, update, remove };
