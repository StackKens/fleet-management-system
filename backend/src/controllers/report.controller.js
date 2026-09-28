const reportService = require('../services/report.service');

// GET /api/reports/:type — view report data
async function viewReport(req, res, next) {
  try {
    const { type } = req.params;
    const filters = req.query;
    let data;

    switch (type) {
      case 'vehicle-utilization':
        data = await reportService.getVehicleUtilization(filters);
        break;
      case 'fuel-consumption':
        data = await reportService.getFuelConsumption(filters);
        break;
      case 'maintenance-costs':
        data = await reportService.getMaintenanceCosts(filters);
        break;
      case 'trip-summary':
        data = await reportService.getTripSummary(filters);
        break;
      case 'driver-activity':
        data = await reportService.getDriverActivity(filters);
        break;
      case 'fleet-status':
        data = await reportService.getFleetStatus();
        break;
      case 'expense-summary':
        data = await reportService.getExpenseSummary(filters);
        break;
      case 'request-summary':
        data = await reportService.getRequestSummary(filters);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Unknown report type' });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// GET /api/reports/:type/export — export report as CSV
async function exportReport(req, res, next) {
  try {
    const { type } = req.params;
    const filters = req.query;
    let data;
    let headers;

    switch (type) {
      case 'vehicle-utilization':
        data = await reportService.getVehicleUtilization(filters);
        headers = ['Vehicle', 'Total Trips', 'Total Distance (km)', 'Total Fuel (L)'];
        break;
      case 'fuel-consumption':
        data = await reportService.getFuelConsumption(filters);
        headers = ['Vehicle', 'Total Liters', 'Total Cost', 'Avg Cost/L'];
        break;
      case 'maintenance-costs':
        data = await reportService.getMaintenanceCosts(filters);
        headers = ['Vehicle', 'Total Cost', 'Total Records'];
        break;
      case 'trip-summary':
        data = await reportService.getTripSummary(filters);
        headers = ['Vehicle', 'Driver', 'Destination', 'Status', 'Departure'];
        break;
      case 'driver-activity':
        data = await reportService.getDriverActivity(filters);
        headers = ['Driver', 'Total Trips', 'Total Distance (km)'];
        break;
      case 'expense-summary':
        data = await reportService.getExpenseSummary(filters);
        headers = ['Category', 'Total Amount', 'Count'];
        break;
      case 'request-summary':
        data = await reportService.getRequestSummary(filters);
        headers = ['Requester', 'Department', 'Destination', 'Status', 'Date'];
        break;
      default:
        return res.status(400).json({ success: false, message: 'Unknown report type' });
    }

    // Convert to CSV
    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = Object.values(row).map((v) => {
        if (typeof v === 'string' && v.includes(',')) return `"${v}"`;
        return v;
      });
      csvRows.push(values.join(','));
    }

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
}

// GET /api/reports — list available report types
async function listReports(req, res) {
  res.json({
    success: true,
    data: [
      { type: 'vehicle-utilization', title: 'Vehicle Utilization' },
      { type: 'fuel-consumption', title: 'Fuel Consumption' },
      { type: 'maintenance-costs', title: 'Maintenance Costs' },
      { type: 'trip-summary', title: 'Trip Summary' },
      { type: 'driver-activity', title: 'Driver Activity' },
      { type: 'fleet-status', title: 'Fleet Status' },
      { type: 'expense-summary', title: 'Expense Summary' },
      { type: 'request-summary', title: 'Request Summary' },
    ],
  });
}

module.exports = { viewReport, exportReport, listReports };
