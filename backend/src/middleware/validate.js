const { z } = require('zod');

// Validation schemas — define what valid input looks like
const schemas = {
  register: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Admin', 'Fleet Manager', 'Driver', 'Staff', 'Supervisor']).optional(),
    phone: z.string().optional(),
    departmentId: z.string().optional(),
  }),

  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),

  vehicle: z.object({
    registration: z.string().min(1, 'Registration is required'),
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    vehicleType: z.string().min(1, 'Vehicle type is required'),
    year: z.number().int().min(1900).max(2100),
    color: z.string().optional(),
    fuelType: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']).optional(),
    status: z.enum(['Available', 'In Use', 'Maintenance', 'Out of Service']).optional(),
    mileage: z.number().int().min(0).optional(),
    lastService: z.string().optional(),
    nextService: z.string().optional(),
    insuranceExpiry: z.string().optional(),
    inspectionExpiry: z.string().optional(),
    departmentId: z.string().optional(),
  }),

  request: z.object({
    destination: z.string().min(1, 'Destination is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    departmentId: z.string().optional(),
  }),

  trip: z.object({
    vehicleId: z.string().min(1, 'Vehicle is required'),
    driverId: z.string().min(1, 'Driver is required'),
    destination: z.string().min(1, 'Destination is required'),
    departure: z.string().min(1, 'Departure is required'),
    expectedReturn: z.string().min(1, 'Expected return is required'),
    mileageStart: z.number().int().min(0).optional(),
    assignmentId: z.string().optional(),
  }),
};

// Partial version for PUT updates — only the supplied fields are validated,
// so a client can update just one field without resending the whole record.
schemas.vehicleUpdate = schemas.vehicle.partial();

// Middleware factory — validates request body against a schema
function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next();
    }

    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      const message = error.errors?.[0]?.message || 'Invalid input';
      return res.status(400).json({ success: false, message });
    }
  };
}

module.exports = validate;
