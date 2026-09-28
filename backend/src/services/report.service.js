const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Vehicle utilization report — how much each vehicle is used
async function getVehicleUtilization(filters = {}) {
  const { startDate, endDate } = filters;

  const trips = await prisma.trip.findMany({
    where: {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    include: {
      vehicle: { select: { registration: true, make: true, model: true } },
    },
  });

  // Aggregate by vehicle
  const byVehicle = {};
  for (const trip of trips) {
    const key = trip.vehicle.registration;
    if (!byVehicle[key]) {
      byVehicle[key] = {
        vehicle: `${trip.vehicle.make} ${trip.vehicle.model} (${trip.vehicle.registration})`,
        totalTrips: 0,
        totalDistance: 0,
        totalFuel: 0,
      };
    }
    byVehicle[key].totalTrips++;
    if (trip.mileageEnd && trip.mileageStart) {
      byVehicle[key].totalDistance += trip.mileageEnd - trip.mileageStart;
    }
    if (trip.fuelUsed) {
      byVehicle[key].totalFuel += trip.fuelUsed;
    }
  }

  return Object.values(byVehicle);
}

// Fuel consumption report — fuel usage and costs per vehicle
async function getFuelConsumption(filters = {}) {
  const { startDate, endDate } = filters;

  const records = await prisma.fuelRecord.findMany({
    where: {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    include: {
      vehicle: { select: { registration: true, make: true, model: true } },
    },
  });

  const byVehicle = {};
  for (const record of records) {
    const key = record.vehicle.registration;
    if (!byVehicle[key]) {
      byVehicle[key] = {
        vehicle: `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.registration})`,
        totalLiters: 0,
        totalCost: 0,
        totalRecords: 0,
      };
    }
    byVehicle[key].totalLiters += record.liters;
    byVehicle[key].totalCost += record.totalCost;
    byVehicle[key].totalRecords++;
  }

  const result = Object.values(byVehicle);
  for (const v of result) {
    v.avgCostPerLiter = v.totalLiters > 0 ? v.totalCost / v.totalLiters : 0;
  }
  return result;
}

// Maintenance cost report — costs per vehicle and type
async function getMaintenanceCosts(filters = {}) {
  const { startDate, endDate } = filters;

  const records = await prisma.maintenanceRecord.findMany({
    where: {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    include: {
      vehicle: { select: { registration: true, make: true, model: true } },
    },
  });

  const byVehicle = {};
  for (const record of records) {
    const key = record.vehicle.registration;
    if (!byVehicle[key]) {
      byVehicle[key] = {
        vehicle: `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.registration})`,
        totalCost: 0,
        totalRecords: 0,
        byType: {},
      };
    }
    byVehicle[key].totalCost += record.cost;
    byVehicle[key].totalRecords++;
    if (!byVehicle[key].byType[record.type]) {
      byVehicle[key].byType[record.type] = { count: 0, cost: 0 };
    }
    byVehicle[key].byType[record.type].count++;
    byVehicle[key].byType[record.type].cost += record.cost;
  }

  return Object.values(byVehicle);
}

// Trip summary report — all trips with details
async function getTripSummary(filters = {}) {
  const { startDate, endDate, status } = filters;

  const where = {};
  if (status) where.status = status;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  return prisma.trip.findMany({
    where,
    include: {
      vehicle: { select: { registration: true, make: true, model: true } },
      driver: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Driver activity report — trips and distance per driver
async function getActivityActivity(filters = {}) {
  const { startDate, endDate } = filters;

  const trips = await prisma.trip.findMany({
    where: {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    include: {
      driver: { select: { name: true } },
    },
  });

  const byDriver = {};
  for (const trip of trips) {
    const key = trip.driver.name;
    if (!byDriver[key]) {
      byDriver[key] = {
        driver: trip.driver.name,
        totalTrips: 0,
        totalDistance: 0,
      };
    }
    byDriver[key].totalTrips++;
    if (trip.mileageEnd && trip.mileageStart) {
      byDriver[key].totalDistance += trip.mileageEnd - trip.mileageStart;
    }
  }

  return Object.values(byDriver);
}

// Fleet status report — current fleet overview
async function getFleetStatus() {
  const totalVehicles = await prisma.vehicle.count();
  const available = await prisma.vehicle.count({ where: { status: 'Available' } });
  const assigned = await prisma.vehicle.count({ where: { status: 'Assigned' } });
  const inService = await prisma.vehicle.count({ where: { status: 'In service' } });
  const maintenance = await prisma.vehicle.count({ where: { status: 'Maintenance' } });

  const totalDrivers = await prisma.driver.count();
  const activeDrivers = await prisma.driver.count({ where: { status: 'Active' } });

  const pendingRequests = await prisma.vehicleRequest.count({ where: { status: 'Pending' } });
  const activeTrips = await prisma.trip.count({ where: { status: 'On route' } });

  const openIssues = await prisma.issue.count({ where: { status: 'Open' } });

  return {
    vehicles: { total: totalVehicles, available, assigned, inService, maintenance },
    drivers: { total: totalDrivers, active: activeDrivers },
    requests: { pending: pendingRequests },
    trips: { active: activeTrips },
    issues: { open: openIssues },
  };
}

// Expense summary report — expenses by category
async function getExpenseSummary(filters = {}) {
  const { startDate, endDate } = filters;

  const expenses = await prisma.expense.findMany({
    where: {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    include: {
      vehicle: { select: { registration: true } },
    },
  });

  const byCategory = {};
  for (const expense of expenses) {
    if (!byCategory[expense.category]) {
      byCategory[expense.category] = { category: expense.category, totalAmount: 0, count: 0 };
    }
    byCategory[expense.category].totalAmount += expense.amount;
    byCategory[expense.category].count++;
  }

  return Object.values(byCategory);
}

// Request summary report — requests by status
async function getRequestSummary(filters = {}) {
  const { startDate, endDate } = filters;

  const requests = await prisma.vehicleRequest.findMany({
    where: {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    include: {
      requester: { select: { name: true } },
      department: { select: { name: true } },
    },
  });

  const byStatus = {};
  for (const request of requests) {
    if (!byStatus[request.status]) {
      byStatus[request.status] = { status: request.status, count: 0 };
    }
    byStatus[request.status].count++;
  }

  return {
    summary: Object.values(byStatus),
    requests: requests.map((r) => ({
      id: r.id,
      requester: r.requester.name,
      department: r.department.name,
      destination: r.destination,
      status: r.status,
      date: r.createdAt,
    })),
  };
}

module.exports = {
  getVehicleUtilization,
  getFuelConsumption,
  getMaintenanceCosts,
  getTripSummary,
  getDriverActivity,
  getFleetStatus,
  getExpenseSummary,
  getRequestSummary,
};
