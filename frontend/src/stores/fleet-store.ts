// =============================================================================
// FLEET STORE — Central State Management
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file is the SINGLE SOURCE OF TRUTH for all fleet data.
// Every vehicle, driver, request, trip, etc. lives here.
// Any component can read or modify this data.
//
// WHY DO WE NEED A CENTRAL STORE?
// ------------------------------
// Without a central store, each component would have its own copy of data.
// This causes problems:
//   - Component A adds a vehicle, but Component B doesn't see it
//   - Two components show different data for the same thing
//   - No way to know where data came from
//
// With a central store:
//   - Everyone sees the same data
//   - Changes are tracked in one place
//   - The UI always reflects the current state
//
// WHAT IS ZUSTAND?
// ---------------
// Zustand is a state management library. Think of it as a "data room"
// that all components can access.
//
// WHY ZUSTAND OVER REDUX OR CONTEXT?
// ----------------------------------
// - Simpler: No boilerplate, no providers, no dispatch/action types
// - Smaller: ~1KB vs Redux's ~7KB
// - TypeScript-first: Excellent type inference out of the box
// - No provider needed: Just import and use
//
// HOW ZUSTAND WORKS (SIMPLIFIED):
// ------------------------------
// 1. Define the state shape (what data exists)
// 2. Define actions (functions that modify data)
// 3. Components subscribe to the state they need
// 4. When state changes, subscribed components re-render
//
// =============================================================================

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

// =============================================================================
// MOCK DATA
// =============================================================================
// WHY MOCK DATA?
// --------------
// During development, we don't have a real backend. Mock data lets us:
//   - Build and test the UI without a server
//   - See realistic data in tables and dashboards
//   - Develop frontend and backend in parallel
//
// WHEN THE BACKEND IS READY:
// -------------------------
// The mock data will be replaced by API calls. The store actions will call
// the backend instead of modifying local state. The UI won't need to change.
//
// =============================================================================

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

// =============================================================================
// ID GENERATION
// =============================================================================
// WHY DO WE NEED ID COUNTERS?
// -------------------------
// Every record needs a unique ID. We use simple counters for development.
// In production, the backend will generate IDs (e.g., UUIDs or auto-increment).
//
// WHY PREFIXES?
// ------------
// Prefixes make IDs human-readable:
//   REQ-0248 = Request #248
//   VHC-013  = Vehicle #13
//   DRV-009  = Driver #9
//
// This helps with debugging: "Look at REQ-0248" is clearer than "Look at clx123..."
// =============================================================================

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

// Helper function to generate IDs with a prefix
function generateId(prefix: string, num: number) {
  return `${prefix}-${num}`;
}

// =============================================================================
// STORE STATE SHAPE
// =============================================================================
// This TypeScript type defines EVERYTHING that exists in our store.
// It's like a blueprint: "Our store has vehicles, drivers, requests, etc."
//
// WHY DEFINE THE TYPE?
// -------------------
// - TypeScript can catch errors: "You tried to add a vehicle to drivers!"
// - Auto-complete: Your editor knows what actions exist
// - Documentation: New developers can see the entire data model at a glance
// =============================================================================

type FleetState = {
  // ─── Data Arrays ──────────────────────────────────────────────────────────
  // Each entity has an array of records.
  // Example: vehicles: Vehicle[] means "an array of Vehicle objects"
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

  // ─── Request Actions ──────────────────────────────────────────────────────
  // WHY Omit<...>?
  // -------------
  // Omit<VehicleRequest, 'id' | 'requestedDate' | ...> means:
  //   "A VehicleRequest, but WITHOUT these fields."
  //   The caller doesn't provide id, dates, or status — the store sets them.
  //
  // This prevents bugs: A user can't create a request that's already "Approved"
  // because they can't set the status field.
  addRequest: (request: Omit<VehicleRequest, 'id' | 'requestedDate' | 'status' | 'vehicle' | 'driver' | 'reviewedBy' | 'reviewedDate'>) => VehicleRequest;
  updateRequestStatus: (id: string, status: RequestStatus, reviewedBy?: string, reason?: string) => void;
  cancelRequest: (id: string) => void;

  // ─── Vehicle Actions ──────────────────────────────────────────────────────
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  deleteVehicle: (id: string) => void;

  // ─── Driver Actions ───────────────────────────────────────────────────────
  addDriver: (driver: Omit<Driver, 'id'>) => Driver;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  updateDriverStatus: (id: string, status: DriverStatus) => void;
  deleteDriver: (id: string) => void;

  // ─── Trip Actions ─────────────────────────────────────────────────────────
  addTrip: (trip: Omit<Trip, 'id' | 'status' | 'actualReturn' | 'mileageEnd' | 'fuelUsed'>) => Trip;
  updateTripStatus: (id: string, status: TripStatus, mileageEnd?: number, fuelUsed?: number) => void;
  deleteTrip: (id: string) => void;

  // ─── Maintenance Actions ──────────────────────────────────────────────────
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => MaintenanceRecord;
  updateMaintenanceStatus: (id: string, status: MaintenanceStatus, cost?: number) => void;
  deleteMaintenanceRecord: (id: string) => void;

  // ─── Fuel Actions ─────────────────────────────────────────────────────────
  addFuelRecord: (record: Omit<FuelRecord, 'id'>) => FuelRecord;
  deleteFuelRecord: (id: string) => void;

  // ─── Inspection Actions ───────────────────────────────────────────────────
  addInspection: (inspection: Omit<Inspection, 'id' | 'date'>) => Inspection;

  // ─── Issue Actions ────────────────────────────────────────────────────────
  addIssue: (issue: Omit<Issue, 'id' | 'date' | 'status'>) => Issue;
  updateIssueStatus: (id: string, status: IssueStatus) => void;

  // ─── Assignment Actions ───────────────────────────────────────────────────
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Assignment;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
  deleteAssignment: (id: string) => void;

  // ─── Notification Actions ─────────────────────────────────────────────────
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // ─── Derived Selectors ────────────────────────────────────────────────────
  // WHY A FUNCTION INSTEAD OF A VALUE?
  // ----------------------------------
  // Vehicle summary is COMPUTED from the vehicles array.
  // If we stored it as a value, it would go out of sync when vehicles change.
  // By making it a function, it always returns the current, correct summary.
  getVehicleSummary: () => {
    total: number;
    available: number;
    assigned: number;
    inService: number;
    maintenance: number;
  };
};

// =============================================================================
// THE STORE
// =============================================================================
// create<FleetState>((set, get) => ({ ... }))
//
// WHAT ARE `set` AND `get`?
// ------------------------
// - set: Updates the state. "Hey store, change this data."
// - get: Reads the current state. "Hey store, what's the current data?"
//
// WHY AN IMMUTABLE PATTERN?
// ----------------------
// We never modify state directly. Instead, we create new arrays/objects:
//
//   WRONG (mutates state):
//   state.vehicles.push(newVehicle)
//
//   RIGHT (creates new state):
//   set((state) => ({ vehicles: [newVehicle, ...state.vehicles] }))
//
// WHY IMMUTABILITY?
// ----------------
// - React can detect changes efficiently (reference comparison)
// - Time-travel debugging is possible
// - Prevents accidental side effects
// =============================================================================

export const useFleetStore = create<FleetState>((set, get) => ({
  // ─── Initial Data ─────────────────────────────────────────────────────────
  // The store starts with mock data.
  // When the backend is ready, this will be replaced by an API call.
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

  // ===========================================================================
  // REQUEST ACTIONS
  // ===========================================================================
  // WHY DO REQUESTS HAVE SIDE EFFECTS?
  // ---------------------------------
  // When a request is submitted, the Fleet Manager should know.
  // When a request is approved, the requester should know.
  // These are SIDE EFFECTS — things that happen in addition to the main action.
  //
  // This pattern is called "event-driven" — actions trigger notifications.
  // ===========================================================================

  addRequest: (requestData) => {
    // Step 1: Generate a unique ID
    requestCounter += 1;
    const id = generateId('REQ', requestCounter);

    // Step 2: Create the request with default values
    // The caller provides: requester, department, destination, dates, purpose
    // The store provides: id, requestedDate, status, vehicle, driver, reviewedBy
    const newRequest: VehicleRequest = {
      ...requestData,
      id,
      requestedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending', // New requests always start as Pending
      vehicle: null,     // No vehicle assigned yet
      driver: null,      // No driver assigned yet
      reviewedBy: null,  // Not reviewed yet
      reviewedDate: null,
    };

    // Step 3: Add to the beginning of the array (newest first)
    set((state) => ({
      requests: [newRequest, ...state.requests],
    }));

    // Step 4: Side effect — notify the Fleet Manager
    // WHY? The Fleet Manager needs to know there's a new request to review.
    get().addNotification({
      type: 'request',
      title: 'New Vehicle Request',
      message: `Request ${id} from ${requestData.requester} for ${requestData.destination}`,
      link: '/requests',
    });

    return newRequest;
  },

  updateRequestStatus: (id, status, reviewedBy, reason) => {
    // Step 1: Update the request in the array
    // map() creates a new array with the updated request
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? { ...r, status, reviewedBy: reviewedBy ?? r.reviewedBy, reviewedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
          : r, // Keep other requests unchanged
      ),
    }));

    // Step 2: Side effect — notify the requester
    // WHY? The requester needs to know their request was approved/declined.
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
    // Only allow cancelling PENDING requests
    // WHY? You can't cancel a request that's already approved or completed.
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id && r.status === 'Pending' ? { ...r, status: 'Declined' as RequestStatus } : r,
      ),
    }));
  },

  // ===========================================================================
  // VEHICLE ACTIONS
  // ===========================================================================

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
    // Partial<Vehicle> means "some fields of Vehicle, not necessarily all"
    // This allows updating just the status, or just the mileage, etc.
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

    // Side effect: Notify about status change
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
    // WHY FILTER INSTEAD OF SPLICE?
    // ----------------------------
    // filter() creates a new array without the deleted item.
    // splice() modifies the original array (breaks immutability).
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    }));
  },

  // ===========================================================================
  // DRIVER ACTIONS
  // ===========================================================================

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

  // ===========================================================================
  // TRIP ACTIONS
  // ===========================================================================
  // WHY DO TRIPS AFFECT VEHICLES?
  // ----------------------------
  // When a trip is created, the vehicle becomes "Assigned" (not available).
  // When a trip is completed, the vehicle becomes "Available" again.
  // This prevents double-booking the same vehicle.
  // ===========================================================================

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

    // Side effect: Update vehicle status to "Assigned"
    const vehicle = get().vehicles.find((v) => v.registration === tripData.vehicle);
    if (vehicle) {
      get().updateVehicle(vehicle.id, { status: 'Assigned', driver: tripData.driver });
    }

    // Side effect: Notify the driver
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
              // Only set these fields when trip is "Returned"
              ...(status === 'Returned' ? {
                actualReturn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
                mileageEnd: mileageEnd ?? t.mileageEnd,
                fuelUsed: fuelUsed ?? t.fuelUsed,
              } : {}),
            }
          : t,
      ),
    }));

    // Side effect: If trip completed, make vehicle available
    if (status === 'Returned' && trip) {
      const vehicle = get().vehicles.find((v) => v.registration === trip.vehicle);
      if (vehicle) {
        get().updateVehicle(vehicle.id, { status: 'Available', driver: null });
      }
    }

    // Side effect: If trip started, ensure vehicle is "Assigned"
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

  // ===========================================================================
  // MAINTENANCE ACTIONS
  // ===========================================================================
  // WHY DOES MAINTENANCE AFFECT VEHICLES?
  // -----------------------------------
  // When maintenance is booked, the vehicle becomes "Maintenance" (unavailable).
  // When maintenance is completed, the vehicle becomes "Available" again.
  // ===========================================================================

  addMaintenanceRecord: (recordData) => {
    maintenanceCounter += 1;
    const id = generateId('MNT', maintenanceCounter);
    const newRecord: MaintenanceRecord = { ...recordData, id };
    set((state) => ({
      maintenanceRecords: [newRecord, ...state.maintenanceRecords],
    }));

    // Side effect: Update vehicle status
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

    // Side effect: If completed, make vehicle available
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

  // ===========================================================================
  // INSPECTION ACTIONS
  // ===========================================================================

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

    // Side effect: Update vehicle mileage
    // WHY? Inspections record the current odometer reading.
    const vehicle = get().vehicles.find((v) => v.registration === inspectionData.vehicle);
    if (vehicle) {
      get().updateVehicle(vehicle.id, { mileage: inspectionData.mileage });
    }

    return newInspection;
  },

  // ===========================================================================
  // ISSUE ACTIONS
  // ===========================================================================
  // WHY DO CRITICAL ISSUES AFFECT VEHICLES?
  // -------------------------------------
  // A critical issue means the vehicle is unsafe to drive.
  // We automatically set the vehicle to "Maintenance" to prevent assignment.
  // ===========================================================================

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

    // Side effect: Notify Fleet Manager
    get().addNotification({
      type: 'system',
      title: 'New Issue Reported',
      message: `${issueData.type} reported for ${issueData.vehicle} — ${issueData.severity} severity`,
      link: '/report-issue',
    });

    // Side effect: Critical issues make vehicle unavailable
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

  // ===========================================================================
  // FUEL ACTIONS
  // ===========================================================================

  addFuelRecord: (recordData) => {
    fuelCounter += 1;
    const id = generateId('FUL', fuelCounter);
    const newRecord: FuelRecord = { ...recordData, id };
    set((state) => ({
      fuelRecords: [newRecord, ...state.fuelRecords],
    }));

    // Side effect: Update vehicle mileage
    // WHY? Fuel records include the odometer reading at time of refueling.
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

  // ===========================================================================
  // ASSIGNMENT ACTIONS
  // ===========================================================================

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

  // ===========================================================================
  // NOTIFICATION ACTIONS
  // ===========================================================================
  // WHY ARE NOTIFICATIONS STORED IN THE STORE?
  // -----------------------------------------
  // - Multiple actions can trigger notifications
  // - The notification bell needs to show unread count
  // - Users can mark notifications as read
  // - Notifications persist across page navigation
  // ===========================================================================

  addNotification: (notificationData) => {
    notificationCounter += 1;
    const newNotification: AppNotification = {
      ...notificationData,
      id: `NOT-${notificationCounter}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
      read: false, // New notifications are unread
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

  // ===========================================================================
  // DERIVED SELECTORS
  // ===========================================================================
  // WHY A FUNCTION INSTEAD OF A VALUE?
  // ----------------------------------
  // Vehicle summary is COMPUTED from the vehicles array.
  // If we stored it as a value, it would go out of sync when vehicles change.
  // By making it a function, it always returns the current, correct summary.
  //
  // EXAMPLE:
  //   const summary = useFleetStore((state) => state.getVehicleSummary());
  //   // summary = { total: 12, available: 5, assigned: 4, inService: 2, maintenance: 1 }
  // ===========================================================================

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

// =============================================================================
// HOW TO USE THE STORE IN COMPONENTS
// =============================================================================
//
// READING DATA:
// ------------
// const vehicles = useFleetStore((state) => state.vehicles);
//
// CALLING ACTIONS:
// ---------------
// const addVehicle = useFleetStore((state) => state.addVehicle);
// addVehicle({ registration: 'UAX 123A', make: 'Toyota', ... });
//
// READING DERIVED DATA:
// --------------------
// const summary = useFleetStore((state) => state.getVehicleSummary());
//
// WHY THE SELECTOR PATTERN? useFleetStore((state) => state.vehicles)
// ---------------------------------------------------------------
// The selector tells Zustand: "I only care about the vehicles array."
// If vehicles change, the component re-renders.
// If drivers change, the component does NOT re-render (performance win).
//
// =============================================================================
