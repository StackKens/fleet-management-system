const requestService = require('../services/request.service');

// GET /api/requests — list all requests with filters
async function getAll(req, res, next) {
  try {
    // Staff can only see their own requests
    const filters = { ...req.query };
    if (req.userRole === 'Staff') {
      filters.requesterId = req.userId;
    }
    const requests = await requestService.getAllRequests(filters);
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
}

// GET /api/requests/summary — request status counts
async function getSummary(req, res, next) {
  try {
    const summary = await requestService.getRequestSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

// GET /api/requests/:id — get single request
async function getById(req, res, next) {
  try {
    const request = await requestService.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    // Staff can only view their own requests
    if (req.userRole === 'Staff' && request.requesterId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
}

// POST /api/requests — create a new request
async function create(req, res, next) {
  try {
    const request = await requestService.createRequest({
      ...req.body,
      requesterId: req.userId,
    });
    res.status(201).json({ success: true, message: 'Request created', data: request });
  } catch (error) {
    next(error);
  }
}

// PUT /api/requests/:id/status — approve or decline a request
async function updateStatus(req, res, next) {
  try {
    const { status, reviewReason } = req.body;
    const request = await requestService.updateRequestStatus(
      req.params.id,
      status,
      req.userName,
      reviewReason
    );
    res.json({ success: true, message: `Request ${status.toLowerCase()}`, data: request });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/requests/:id — delete a request
async function remove(req, res, next) {
  try {
    await requestService.deleteRequest(req.params.id);
    res.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getSummary, getById, create, updateStatus, remove };
