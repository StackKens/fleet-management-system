const tripService = require('../services/trip.service');

// GET /api/trips — list all trips
async function getAll(req, res, next) {
  try {
    const trips = await tripService.getAllTrips(req.query);
    res.json({ success: true, data: trips });
  } catch (error) {
    next(error);
  }
}

// GET /api/trips/driver/:driverId — get trips for a specific driver
async function getDriverTrips(req, res, next) {
  try {
    const trips = await tripService.getDriverTrips(req.params.driverId);
    res.json({ success: true, data: trips });
  } catch (error) {
    next(error);
  }
}

// GET /api/trips/:id — get single trip
async function getById(req, res, next) {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
}

// POST /api/trips — create trip
async function create(req, res, next) {
  try {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json({ success: true, message: 'Trip created', data: trip });
  } catch (error) {
    next(error);
  }
}

// PUT /api/trips/:id/status — update trip status
async function updateStatus(req, res, next) {
  try {
    const trip = await tripService.updateTripStatus(req.params.id, req.body);
    res.json({ success: true, message: 'Trip updated', data: trip });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/trips/:id — delete trip
async function remove(req, res, next) {
  try {
    await tripService.deleteTrip(req.params.id);
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getDriverTrips, getById, create, updateStatus, remove };
