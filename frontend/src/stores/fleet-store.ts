import { create } from 'zustand';
import type {
  Vehicle,
  VehicleRequest,
  Driver,
  Trip,
  MaintenanceRecord,
  FuelRecord,
  Assignment,
  AppNotification,
  Department,
  Inspection,
  Issue,
  Expense,
  AttentionItem,
  ActivityEvent,
  Report,
  VehicleStatus,
  RequestStatus,
  TripStatus,
  MaintenanceStatus,
  DriverStatus,
  IssueStatus,
} from '@/data/types';
import {
  vehicles as mockVehicles,
  requests as mockRequests,
  drivers as mockDrivers,
  trips as mockTrips,
  maintenanceRecords as mockMaintenance,
  fuelRecords as mockFuel,
  assignments as mockAssignments,
  notifications as mockNotifications,
  expenses as mockExpenses,
  attentionItems as mockAttentionItems,
  activity as mockActivity,
  reports as mockReports,
} from '@/data/mock-data';

const mockDepartments: Department[] = [
  { id: 'DEP-001', name: 'Field Operations', head: 'Robert Okello', vehicleCount: 8, driverCount: 12 },
  { id: 'DEP-002', name: 'Public Health', head: 'Dr. Grace Namusoke', vehicleCount: 6, driverCount: 8 },
  { id: 'DEP-003', name: 'Water & Sanitation', head: 'James Kato', vehicleCount: 5, driverCount: 6 },
  { id: 'DEP-004', name: 'Administration', head: 'Sarah Nalwoga', vehicleCount: 4, driverCount: 3 },
  { id: 'DEP-005', name: 'Logistics', head: 'David Ssemwanga', vehicleCount: 3, driverCount: 4 },
  { id: 'DEP-006', name: 'Programmes', head: 'Agnes Kiconco', vehicleCount: 4, driverCount: 5 },
];

const mockInspections: Inspection[] = [
  { id: 'INS-001', vehicle: 'UAX 482C', type: 'Pre-trip', result: 'Passed', mileage: 128420, notes: 'All systems normal', date: '18 Jul 2024', submittedBy: 'Robert Okello' },
  { id: 'INS-002', vehicle: 'UAX 482C', type: 'Post-trip', result: 'Passed', mileage: 128650, notes: 'Minor wear on front tires noted', date: '17 Jul 2024', submittedBy: 'Robert Okello' },
  { id: 'INS-003', vehicle: 'UAX 482C', type: 'Weekly', result: 'Pending', mileage: 128420, notes: 'Scheduled weekly inspection', date: '16 Jul 2024', submittedBy: 'Robert Okello' },
];

const mockIssues: Issue[] = [
  { id: 'ISS-001', vehicle: 'UAX 482C', type: 'Vehicle problem', severity: 'Medium', status: 'In progress', description: 'Brake noise from front left wheel', location: 'Kampala', date: '15 Jul 2024', reportedBy: 'Robert Okello' },
  { id: 'ISS-002', vehicle: 'UAX 482C', type: 'Vehicle problem', severity: 'Low', status: 'Resolved', description: 'Engine warning light on dashboard', location: 'Kampala', date: '10 Jul 2024', reportedBy: 'Robert Okello' },
];

let notificationCounter = 100;
let requestCounter = 248;
let vehicleCounter = 12;
let driverCounter = 8;
let tripCounter = 915;
let maintenanceCounter = 8;
let fuelCounter = 7;
let assignmentCounter = 10;
let inspectionCounter = 3;
let issueCounter = 2;

function generateId(prefix: string, num: number) {
  return `${prefix}-${num}`;
}

// ─── Store State Shape ──────────────────────────────────────────────────────

type FleetState = {
  // Data
  vehicles: Vehicle[];
  requests: VehicleRequest[];
  drivers: Driver[];
  trips: Trip[];
  maintenanceRecords: MaintenanceRecord[];
  fuelRecords: FuelRecord[];
  assignments: Assignment[];
  notifications: AppNotification[];
  departments: Department[];
  inspections: Inspection[];
  issues: Issue[];
  expenses: Expense[];
  attentionItems: AttentionItem[];
  activity: ActivityEvent[];
  reports: Report[];

  // Request actions
  addRequest: (request: Omit<VehicleRequest, 'id' | 'requestedDate' | 'status' | 'vehicle' | 'driver' | 'reviewedBy' | 'reviewedDate'>) => VehicleRequest;
  updateRequestStatus: (id: string, status: RequestStatus, reviewedBy?: string, reason?: string) => void;
  cancelRequest: (id: string) => void;

  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  deleteVehicle: (id: string) => void;

  // Driver actions
  addDriver: (driver: Omit<Driver, 'id'>) => Driver;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  updateDriverStatus: (id: string, status: DriverStatus) => void;
  deleteDriver: (id: string) => void;

  // Trip actions
  addTrip: (trip: Omit<Trip, 'id' | 'status' | 'actualReturn' | 'mileageEnd' | 'fuelUsed'>) => Trip;
  updateTripStatus: (id: string, status: TripStatus, mileageEnd?: number, fuelUsed?: number) => void;
  deleteTrip: (id: string) => void;

  // Maintenance actions
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => MaintenanceRecord;
  updateMaintenanceStatus: (id: string, status: MaintenanceStatus, cost?: number) => void;
  deleteMaintenanceRecord: (id: string) => void;

  // Fuel actions
  addFuelRecord: (record: Omit<FuelRecord, 'id'>) => FuelRecord;
  deleteFuelRecord: (id: string) => void;

  // Inspection actions
  addInspection: (inspection: Omit<Inspection, 'id' | 'date'>) => Inspection;

  // Issue actions
  addIssue: (issue: Omit<Issue, 'id' | 'date' | 'status'>) => Issue;
  updateIssueStatus: (id: string, status: IssueStatus) => void;

  // Assignment actions
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Assignment;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
  deleteAssignment: (id: string) => void;

  // Notification actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Derived selectors
  getVehicleSummary: () => {
    total: number;
    available: number;
    assigned: number;
    inService: number;
    maintenance: number;
  };
};

// ─── Store ──────────────────────────────────────────────────────────────────

export const useFleetStore = create<FleetState>((set, get) => ({
  // Initial data from mock-data
  vehicles: mockVehicles,
  requests: mockRequests,
  drivers: mockDrivers,
  trips: mockTrips,
  maintenanceRecords: mockMaintenance,
  fuelRecords: mockFuel,
  assignments: mockAssignments,
  notifications: mockNotifications,
  departments: mockDepartments,
  inspections: mockInspections,
  issues: mockIssues,
  expenses: mockExpenses,
  attentionItems: mockAttentionItems,
  activity: mockActivity,
  reports: mockReports,

  // ─── Request Actions ──────────────────────────────────────────────────────

  addRequest: (requestData) => {
    requestCounter += 1;
    const id = generateId('REQ', requestCounter);
    const newRequest: VehicleRequest = {
      ...requestData,
      id,
      requestedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending',
      vehicle: null,
      driver: null,
      reviewedBy: null,
      reviewedDate: null,
    };
    set((state) => ({
      requests: [newRequest, ...state.requests],
    }));

    // Notify Fleet Manager
    get().addNotification({
      type: 'request',
      title: 'New Vehicle Request',
      message: `Request ${id} from ${requestData.requester} for ${requestData.destination}`,
      link: '/requests',
    });

    return newRequest;
  },

  updateRequestStatus: (id, status, reviewedBy, reason) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? { ...r, status, reviewedBy: reviewedBy ?? r.reviewedBy, reviewedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
          : r,
      ),
    }));

    const request = get().requests.find((r) => r.id === id);
    if (request) {
      get().addNotification({
        type: 'request',
        title: `Request ${status}`,
        message: `Request ${id} has been ${status.toLowerCase()}.${reason ? ` Reason: ${reason}` : ''}`,
        link: '/requests',
      });
    }
  },

  cancelRequest: (id) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id && r.status === 'Pending' ? { ...r, status: 'Declined' as RequestStatus } : r,
      ),
    }));
  },

  // ─── Vehicle Actions ──────────────────────────────────────────────────────

  addVehicle: (vehicleData) => {
    vehicleCounter += 1;
    const id = generateId('VHC', vehicleCounter);
    const newVehicle: Vehicle = { ...vehicleData, id };
    set((state) => ({
      vehicles: [newVehicle, ...state.vehicles],
    }));
    return newVehicle;
  },

  updateVehicle: (id, updates) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  },

  updateVehicleStatus: (id, status) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id
          ? { ...v, status, ...(status === 'Available' ? { driver: null } : {}) }
          : v,
      ),
    }));

    const vehicle = get().vehicles.find((v) => v.id === id);
    if (vehicle) {
      get().addNotification({
        type: 'system',
        title: 'Vehicle Status Updated',
        message: `${vehicle.registration} is now ${status}`,
        link: '/vehicles',
      });
    }
  },

  deleteVehicle: (id) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    }));
  },

  // ─── Driver Actions ───────────────────────────────────────────────────────

  addDriver: (driverData) => {
    driverCounter += 1;
    const id = generateId('DRV', driverCounter);
    const newDriver: Driver = { ...driverData, id };
    set((state) => ({
      drivers: [newDriver, ...state.drivers],
    }));
    return newDriver;
  },

  updateDriver: (id, updates) => {
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  },

  updateDriverStatus: (id, status) => {
    set((state) => ({
      drivers: state.drivers.map((d) => (d.id === id ? { ...d, status } : d)),
    }));
  },

  deleteDriver: (id) => {
    set((state) => ({
      drivers: state.drivers.filter((d) => d.id !== id),
    }));
  },

  // ─── Trip Actions ─────────────────────────────────────────────────────────

  addTrip: (tripData) => {
    tripCounter += 1;
    const id = generateId('TRP', tripCounter);
    const newTrip: Trip = {
      ...tripData,
      id,
      status: 'Scheduled',
      actualReturn: null,
      mileageEnd: null,
      fuelUsed: null,
    };
    set((state) => ({
      trips: [newTrip, ...state.trips],
    }));

    // Update vehicle status
    const vehicle = get().vehicles.find((v) => v.registration === tripData.vehicle);
    if (vehicle) {
      get().updateVehicle(vehicle.id, { status: 'Assigned', driver: tripData.driver });
    }

    // Notify driver
    get().addNotification({
      type: 'assignment',
      title: 'New Trip Assigned',
      message: `Trip ${id} to ${tripData.destination} has been assigned to you`,
      link: '/my-trips',
    });

    return newTrip;
  },

  updateTripStatus: (id, status, mileageEnd, fuelUsed) => {
    const trip = get().trips.find((t) => t.id === id);
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              ...(status === 'Returned' ? {
                actualReturn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
                mileageEnd: mileageEnd ?? t.mileageEnd,
                fuelUsed: fuelUsed ?? t.fuelUsed,
              } : {}),
            }
          : t,
      ),
    }));

    // If trip completed, make vehicle available again
    if (status === 'Returned' && trip) {
      const vehicle = get().vehicles.find((v) => v.registration === trip.vehicle);
      if (vehicle) {
        get().updateVehicle(vehicle.id, { status: 'Available', driver: null });
      }
    }

    if (status === 'On route') {
      const vehicle = get().vehicles.find((v) => v.registration === trip?.vehicle);
      if (vehicle) {
        get().updateVehicle(vehicle.id, { status: 'Assigned' });
      }
    }
  },

  deleteTrip: (id) => {
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== id),
    }));
  },

  // ─── Maintenance Actions ──────────────────────────────────────────────────

  addMaintenanceRecord: (recordData) => {
    maintenanceCounter += 1;
    const id = generateId('MNT', maintenanceCounter);
    const newRecord: MaintenanceRecord = { ...recordData, id };
    set((state) => ({
      maintenanceRecords: [newRecord, ...state.maintenanceRecords],
    }));

    // Update vehicle status
    const vehicle = get().vehicles.find((v) => v.registration === recordData.vehicle);
    if (vehicle) {
      get().updateVehicle(vehicle.id, { status: 'Maintenance', driver: null });
    }

    get().addNotification({
      type: 'maintenance',
      title: 'Maintenance Booked',
      message: `Maintenance booked for ${recordData.vehicle} — ${recordData.type}`,
      link: '/maintenance',
    });

    return newRecord;
  },

  updateMaintenanceStatus: (id, status, cost) => {
    const record = get().maintenanceRecords.find((r) => r.id === id);
    set((state) => ({
      maintenanceRecords: state.maintenanceRecords.map((r) =>
        r.id === id
          ? { ...r, status, cost: cost ?? r.cost, completedDate: status === 'Completed' ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : r.completedDate }
          : r,
      ),
    }));

    // If completed, make vehicle available
    if (status === 'Completed' && record) {
      const vehicle = get().vehicles.find((v) => v.registration === record.vehicle);
      if (vehicle) {
        get().updateVehicle(vehicle.id, { status: 'Available', driver: null });
      }

      get().addNotification({
        type: 'maintenance',
        title: 'Maintenance Completed',
        message: `${record.vehicle} has been returned to service`,
        link: '/maintenance',
      });
    }
  },

  deleteMaintenanceRecord: (id) => {
    set((state) => ({
      maintenanceRecords: state.maintenanceRecords.filter((r) => r.id !== id),
    }));
  },

  // ─── Inspection Actions ───────────────────────────────────────────────────

  addInspection: (inspectionData) => {
    inspectionCounter += 1;
    const id = generateId('INS', inspectionCounter);
    const newInspection: Inspection = {
      ...inspectionData,
      id,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    set((state) => ({
      inspections: [newInspection, ...state.inspections],
    }));

    // Update vehicle mileage
    const vehicle = get().vehicles.find((v) => v.registration === inspectionData.vehicle);
    if (vehicle) {
      get().updateVehicle(vehicle.id, { mileage: inspectionData.mileage });
    }

    return newInspection;
  },

  // ─── Issue Actions ────────────────────────────────────────────────────────

  addIssue: (issueData) => {
    issueCounter += 1;
    const id = generateId('ISS', issueCounter);
    const newIssue: Issue = {
      ...issueData,
      id,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Open',
    };
    set((state) => ({
      issues: [newIssue, ...state.issues],
    }));

    // Notify Fleet Manager
    get().addNotification({
      type: 'system',
      title: 'New Issue Reported',
      message: `${issueData.type} reported for ${issueData.vehicle} — ${issueData.severity} severity`,
      link: '/report-issue',
    });

    // If critical severity, update vehicle status
    if (issueData.severity === 'Critical') {
      const vehicle = get().vehicles.find((v) => v.registration === issueData.vehicle);
      if (vehicle) {
        get().updateVehicle(vehicle.id, { status: 'Maintenance', driver: null });
      }
    }

    return newIssue;
  },

  updateIssueStatus: (id, status: IssueStatus) => {
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, status } : i)),
    }));

    const issue = get().issues.find((i) => i.id === id);
    if (issue && status === 'Resolved') {
      get().addNotification({
        type: 'system',
        title: 'Issue Resolved',
        message: `Issue ${id} for ${issue.vehicle} has been resolved`,
        link: '/report-issue',
      });
    }
  },

  // ─── Fuel Actions ─────────────────────────────────────────────────────────

  addFuelRecord: (recordData) => {
    fuelCounter += 1;
    const id = generateId('FUL', fuelCounter);
    const newRecord: FuelRecord = { ...recordData, id };
    set((state) => ({
      fuelRecords: [newRecord, ...state.fuelRecords],
    }));

    // Update vehicle mileage
    const vehicle = get().vehicles.find((v) => v.registration === recordData.vehicle);
    if (vehicle) {
      get().updateVehicle(vehicle.id, { mileage: recordData.mileage });
    }

    return newRecord;
  },

  deleteFuelRecord: (id) => {
    set((state) => ({
      fuelRecords: state.fuelRecords.filter((r) => r.id !== id),
    }));
  },

  // ─── Assignment Actions ───────────────────────────────────────────────────

  addAssignment: (assignmentData) => {
    assignmentCounter += 1;
    const id = generateId('ASG', assignmentCounter);
    const newAssignment: Assignment = { ...assignmentData, id };
    set((state) => ({
      assignments: [newAssignment, ...state.assignments],
    }));
    return newAssignment;
  },

  updateAssignmentStatus: (id, status) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id
          ? { ...a, status, endDate: status !== 'Active' ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : a.endDate }
          : a,
      ),
    }));
  },

  deleteAssignment: (id) => {
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    }));
  },

  // ─── Notification Actions ─────────────────────────────────────────────────

  addNotification: (notificationData) => {
    notificationCounter += 1;
    const newNotification: AppNotification = {
      ...notificationData,
      id: `NOT-${notificationCounter}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  // ─── Derived Selectors ────────────────────────────────────────────────────

  getVehicleSummary: () => {
    const vehicles = get().vehicles;
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === 'Available').length,
      assigned: vehicles.filter((v) => v.status === 'Assigned').length,
      inService: vehicles.filter((v) => v.status === 'In service').length,
      maintenance: vehicles.filter((v) => v.status === 'Maintenance').length,
    };
  },
}));
