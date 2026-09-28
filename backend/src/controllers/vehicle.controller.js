const vehicleService = require('../services/vehicle.service');

// GET /api/vehicles — list all vehicles with filters
async function getAll(req, res, next) {
  try {
    const vehicles = await vehicleService.getAllVehicles(req.query);
    res.json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
}

// GET /api/vehicles/summary — get vehicle status counts
async function getSummary(req, res, next) {
  try {
    const summary = await vehicleService.getVehicleSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

// GET /api/vehicles/:id — get single vehicle
async function getById(req, res, next) {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
}

// POST /api/vehicles — create vehicle
async function create(req, res, next) {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ success: true, message: 'Vehicle created', data: vehicle });
  } catch (error) {
    next(error);
  }
}

// PUT /api/vehicles/:id — update vehicle
async function update(req, res, next) {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.json({ success: true, message: 'Vehicle updated', data: vehicle });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/vehicles/:id — delete vehicle
async function remove(req, res, next) {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getSummary, getById, create, update, remove };
