// ─── Vehicle ────────────────────────────────────────────────────────────────
export type VehicleStatus = 'Available' | 'Assigned' | 'In service' | 'Maintenance';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';

export type Vehicle = {
  id: string;
  registration: string;
  make: string;
  model: string;
  vehicleType: string;
  year: number;
  color: string;
  fuelType: FuelType;
  status: VehicleStatus;
  mileage: number;
  driver: string | null;
  department: string;
  lastService: string;
  nextService: string;
  insuranceExpiry: string;
  inspectionExpiry: string;
};

export type VehicleSummary = {
  total: number;
  available: number;
  assigned: number;
  inService: number;
  maintenance: number;
};

// ─── Driver ─────────────────────────────────────────────────────────────────
export type DriverStatus = 'Active' | 'On leave' | 'Suspended' | 'Inactive';

export type Driver = {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  department: string;
  assignedVehicle: string | null;
  tripsCompleted: number;
  rating: number;
  joinDate: string;
};

// ─── Vehicle Request ─────────────────────────────────────────────────────────
export type RequestStatus = 'Pending' | 'Approved' | 'Declined' | 'Completed';

export type VehicleRequest = {
  id: string;
  requester: string;
  department: string;
  destination: string;
  requestedDate: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: RequestStatus;
  vehicle: string | null;
  driver: string | null;
  reviewedBy: string | null;
  reviewedDate: string | null;
};

// ─── Trip ───────────────────────────────────────────────────────────────────
export type TripStatus = 'Scheduled' | 'On route' | 'Returned' | 'Cancelled';

export type Trip = {
  id: string;
  vehicle: string;
  driver: string;
  destination: string;
  departure: string;
  expectedReturn: string;
  actualReturn: string | null;
  status: TripStatus;
  purpose: string;
  mileageStart: number;
  mileageEnd: number | null;
  fuelUsed: number | null;
};

// ─── Maintenance ────────────────────────────────────────────────────────────
export type MaintenanceStatus = 'Scheduled' | 'In progress' | 'Completed' | 'Cancelled';
export type MaintenanceType = 'Routine service' | 'Repair' | 'Inspection' | 'Emergency';

export type MaintenanceRecord = {
  id: string;
  vehicle: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  description: string;
  reportedDate: string;
  scheduledDate: string;
  completedDate: string | null;
  cost: number;
  partsReplaced: string[];
  workshop: string;
  mileageAtService: number;
};

// ─── Fuel ───────────────────────────────────────────────────────────────────
export type FuelRecord = {
  id: string;
  vehicle: string;
  driver: string;
  date: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  mileage: number;
  fuelStation: string;
  fuelType: FuelType;
};

// ─── Assignment ─────────────────────────────────────────────────────────────
export type Assignment = {
  id: string;
  vehicle: string;
  driver: string;
  department: string;
  startDate: string;
  endDate: string | null;
  status: 'Active' | 'Completed' | 'Cancelled';
  purpose: string;
};

// ─── User ───────────────────────────────────────────────────────────────────
export type UserRole = 'Admin' | 'Fleet Manager' | 'Driver' | 'Staff' | 'Supervisor';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  joinDate: string;
};

// ─── Department ─────────────────────────────────────────────────────────────
export type Department = {
  id: string;
  name: string;
  head: string;
  vehicleCount: number;
  driverCount: number;
};

// ─── Notification ───────────────────────────────────────────────────────────
export type NotificationType = 'maintenance' | 'request' | 'assignment' | 'document' | 'system';

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link: string;
};

// ─── Attention Item ─────────────────────────────────────────────────────────
export type AttentionSeverity = 'high' | 'medium' | 'low';

export type AttentionItem = {
  id: string;
  category: string;
  title: string;
  detail: string;
  severity: AttentionSeverity;
};

// ─── Activity ───────────────────────────────────────────────────────────────
export type ActivityType = 'assignment' | 'request' | 'maintenance' | 'system' | 'fuel' | 'trip';

export type ActivityEvent = {
  id: string;
  message: string;
  timestamp: string;
  type: ActivityType;
};

// ─── Expense ────────────────────────────────────────────────────────────────
export type Expense = {
  id: string;
  vehicle: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  recordedBy: string;
};

// ─── Report ─────────────────────────────────────────────────────────────────
export type ReportType =
  | 'Vehicle utilization'
  | 'Fuel consumption'
  | 'Maintenance costs'
  | 'Trip summary'
  | 'Driver activity'
  | 'Fleet status'
  | 'Expense summary'
  | 'Request summary';

export type Report = {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  generatedDate: string;
  period: string;
};
