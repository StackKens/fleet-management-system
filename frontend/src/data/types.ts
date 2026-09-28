// =============================================================================
// TYPES — TypeScript Type Definitions
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file defines the SHAPE of all data in the application.
// Every vehicle, driver, request, trip, etc. has a type defined here.
//
// WHY DEFINE TYPES?
// ----------------
// 1. Error prevention: TypeScript catches mistakes at compile time
//    - vehicle.name = 123 → ERROR: Type 'number' is not assignable to 'string'
//    - vehicle.nonexistent → ERROR: Property 'nonexistent' does not exist
//
// 2. Auto-complete: Your editor knows what fields exist
//    - Type "vehicle." → editor shows: id, registration, make, model, ...
//
// 3. Documentation: New developers can read this file to understand the data model
//
// 4. Refactoring: Change a type, TypeScript shows every place that needs updating
//
// WHAT IS A TYPE?
// --------------
// A type describes the shape of data — what fields exist and what values they hold.
//
// EXAMPLE:
//   type Vehicle = {
//     id: string;        // id is a string
//     registration: string;  // registration is a string
//     mileage: number;   // mileage is a number
//     driver: string | null;  // driver is a string OR null
//   }
//
// The `|` means "or". So `string | null` means "a string or null".
// This is called a UNION TYPE.
//
// =============================================================================

// =============================================================================
// VEHICLE TYPES
// =============================================================================

// VehicleStatus: The possible states a vehicle can be in
// WHY A UNION TYPE INSTEAD OF AN ENUM?
// -----------------------------------
// - TypeScript union types are simpler (no runtime code)
// - Easy to check: if (status === 'Available') { ... }
// - Easy to extend: Just add '| NewStatus' to the union
export type VehicleStatus = 'Available' | 'Assigned' | 'In service' | 'Maintenance';

// FuelType: The types of fuel a vehicle can use
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';

// Vehicle: A fleet vehicle with all its properties
// WHY `driver: string | null`?
// --------------------------
// - string: The name of the assigned driver (e.g., "Robert Okello")
// - null: No driver is assigned (vehicle is available)
//
// WHY `driver: string` INSTEAD OF A DRIVER OBJECT?
// ----------------------------------------------
// - Simplicity: We only need the driver's name for display
// - Performance: No need to join/query the Driver table
// - Consistency: The name comes from the assignment, not the driver profile
export type Vehicle = {
  id: string;                    // Unique identifier (e.g., "VHC-001")
  registration: string;          // License plate (e.g., "UAX 482C")
  make: string;                  // Manufacturer (e.g., "Toyota")
  model: string;                 // Model name (e.g., "Land Cruiser Prado")
  vehicleType: string;           // Category (e.g., "Field SUV", "Pickup")
  year: number;                  // Manufacturing year
  color: string;                 // Exterior color
  fuelType: FuelType;            // Type of fuel
  status: VehicleStatus;         // Current availability status
  mileage: number;               // Odometer reading in kilometers
  driver: string | null;         // Assigned driver's name (null = unassigned)
  department: string;            // Owning department
  lastService: string;           // Date of last maintenance
  nextService: string;           // Date of next scheduled service
  insuranceExpiry: string;       // Insurance expiration date
  inspectionExpiry: string;      // Inspection certificate expiry
};

// VehicleSummary: Fleet statistics computed from vehicles
// WHY A SEPARATE TYPE?
// -------------------
// - Clarity: Clearly defines what the summary contains
// - Type safety: Ensures all required fields are present
// - Documentation: Shows the shape of summary data
export type VehicleSummary = {
  total: number;       // Total vehicles in fleet
  available: number;   // Vehicles ready for assignment
  assigned: number;    // Vehicles currently assigned
  inService: number;   // Vehicles being serviced
  maintenance: number; // Vehicles under maintenance
};

// =============================================================================
// DRIVER TYPES
// =============================================================================

export type DriverStatus = 'Active' | 'On leave' | 'Suspended' | 'Inactive';

export type Driver = {
  id: string;              // Unique identifier
  name: string;            // Full name
  phone: string;           // Contact number
  email: string;           // Email address
  licenseNumber: string;   // Driving license number
  licenseExpiry: string;   // License expiration date
  status: DriverStatus;    // Current status
  department: string;      // Assigned department
  assignedVehicle: string | null;  // Vehicle currently assigned (null = none)
  tripsCompleted: number;  // Lifetime trips completed
  rating: number;          // Performance rating (0-5)
  joinDate: string;        // Date joined the organization
};

// =============================================================================
// VEHICLE REQUEST TYPES
// =============================================================================

// RequestStatus: The lifecycle of a vehicle request
// WHY THESE STATUSES?
// ------------------
// - Pending: Awaiting review by Fleet Manager
// - Approved: Approved, awaiting vehicle/driver assignment
// - Declined: Rejected by Fleet Manager
// - Completed: Trip has been completed
//
// The status determines what actions are available:
//   Pending → Approve, Decline, Cancel
//   Approved → Assign vehicle/driver
//   Declined → (no further actions)
//   Completed → (no further actions)
export type RequestStatus = 'Pending' | 'Approved' | 'Declined' | 'Completed';

export type VehicleRequest = {
  id: string;                // Unique identifier (e.g., "REQ-0248")
  requester: string;         // Name of person making the request
  department: string;        // Requester's department
  destination: string;       // Where the vehicle needs to go
  requestedDate: string;     // When the request was submitted
  startDate: string;         // When the vehicle is needed
  endDate: string;           // When the vehicle will be returned
  purpose: string;           // Reason for the trip
  status: RequestStatus;     // Current status in the workflow
  vehicle: string | null;    // Assigned vehicle (null = not yet assigned)
  driver: string | null;     // Assigned driver (null = not yet assigned)
  reviewedBy: string | null; // Who approved/declined (null = not reviewed)
  reviewedDate: string | null; // When it was reviewed
};

// =============================================================================
// TRIP TYPES
// =============================================================================

// TripStatus: The lifecycle of a trip
// - Scheduled: Trip is planned but hasn't started
// - On route: Driver has started the trip
// - Returned: Trip is completed
// - Cancelled: Trip was cancelled
export type TripStatus = 'Scheduled' | 'On route' | 'Returned' | 'Cancelled';

export type Trip = {
  id: string;                // Unique identifier
  vehicle: string;           // Vehicle registration number
  driver: string;            // Driver's name
  destination: string;       // Trip destination
  departure: string;         // When the trip started
  expectedReturn: string;    // When the trip is expected to end
  actualReturn: string | null; // When the trip actually ended (null = in progress)
  status: TripStatus;        // Current status
  purpose: string;           // Reason for the trip
  mileageStart: number;      // Odometer reading at departure
  mileageEnd: number | null; // Odometer reading at return (null = in progress)
  fuelUsed: number | null;   // Fuel consumed (null = in progress)
};

// =============================================================================
// MAINTENANCE TYPES
// =============================================================================

export type MaintenanceStatus = 'Scheduled' | 'In progress' | 'Completed' | 'Cancelled';

export type MaintenanceType = 'Routine service' | 'Repair' | 'Inspection' | 'Emergency';

export type MaintenanceRecord = {
  id: string;                // Unique identifier
  vehicle: string;           // Vehicle registration
  type: MaintenanceType;     // Type of maintenance
  status: MaintenanceStatus; // Current status
  description: string;       // What needs to be done
  reportedDate: string;      // When the issue was reported
  scheduledDate: string;     // When maintenance is planned
  completedDate: string | null; // When maintenance was finished
  cost: number;              // Cost in UGX (0 = not yet known)
  partsReplaced: string[];   // List of parts that were replaced
  workshop: string;          // Where maintenance is performed
  mileageAtService: number;  // Vehicle mileage at time of service
};

// =============================================================================
// FUEL TYPES
// =============================================================================

export type FuelRecord = {
  id: string;                // Unique identifier
  vehicle: string;           // Vehicle registration
  driver: string;            // Driver who purchased fuel
  date: string;              // Date of fuel purchase
  liters: number;            // Quantity in liters
  costPerLiter: number;      // Price per liter in UGX
  totalCost: number;         // Total cost (liters × costPerLiter)
  mileage: number;           // Odometer reading at time of refueling
  fuelStation: string;       // Where fuel was purchased
  fuelType: FuelType;        // Type of fuel
};

// =============================================================================
// ASSIGNMENT TYPES
// =============================================================================

export type Assignment = {
  id: string;                // Unique identifier
  vehicle: string;           // Vehicle registration
  driver: string;            // Driver's name
  department: string;        // Department the assignment is for
  startDate: string;         // When the assignment starts
  endDate: string | null;    // When the assignment ends (null = ongoing)
  status: 'Active' | 'Completed' | 'Cancelled';
  purpose: string;           // Reason for the assignment
};

// =============================================================================
// USER TYPES
// =============================================================================

// UserRole: The possible roles in the system
// WHY THESE ROLES?
// ---------------
// - Admin: Manages the platform (users, roles, settings)
// - Fleet Manager: Manages daily fleet operations
// - Driver: Drives vehicles and reports issues
// - Staff: Requests vehicles for trips
// - Supervisor: Oversees fleet operations (limited Admin)
export type UserRole = 'Admin' | 'Fleet Manager' | 'Driver' | 'Staff' | 'Supervisor';

export type User = {
  id: string;                // Unique identifier
  name: string;              // Full name
  email: string;             // Email (used for login)
  role: UserRole;            // Determines permissions
  department: string;        // Assigned department
  phone: string;             // Contact number
  status: 'Active' | 'Inactive'; // Whether the account is active
  lastLogin: string;         // Last login timestamp
  joinDate: string;          // When the user was created
};

// =============================================================================
// DEPARTMENT TYPES
// =============================================================================

export type Department = {
  id: string;                // Unique identifier
  name: string;              // Department name
  head: string;              // Department head's name
  vehicleCount: number;      // Number of vehicles assigned
  driverCount: number;       // Number of drivers assigned
};

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export type NotificationType = 'maintenance' | 'request' | 'assignment' | 'document' | 'system';

export type AppNotification = {
  id: string;                // Unique identifier
  type: NotificationType;    // Category of notification
  title: string;             // Short headline
  message: string;           // Detailed message
  timestamp: string;         // When the notification was created
  read: boolean;             // Whether the user has seen it
  link: string;              // URL to the relevant page
};

// =============================================================================
// ATTENTION ITEM TYPES
// =============================================================================

export type AttentionSeverity = 'high' | 'medium' | 'low';

export type AttentionItem = {
  id: string;                // Unique identifier
  category: string;          // Category (e.g., "Maintenance", "Insurance")
  title: string;             // Short headline
  detail: string;            // Detailed description
  severity: AttentionSeverity; // How urgent the item is
};

// =============================================================================
// ACTIVITY TYPES
// =============================================================================

export type ActivityType = 'assignment' | 'request' | 'maintenance' | 'system' | 'fuel' | 'trip';

export type ActivityEvent = {
  id: string;                // Unique identifier
  message: string;           // What happened
  timestamp: string;         // When it happened
  type: ActivityType;        // Category of activity
};

// =============================================================================
// EXPENSE TYPES
// =============================================================================

export type Expense = {
  id: string;                // Unique identifier
  vehicle: string;           // Related vehicle
  category: string;          // Expense category (e.g., "Fuel", "Tolls")
  amount: number;            // Amount in UGX
  date: string;              // Date of expense
  description: string;       // What the expense was for
  recordedBy: string;        // Who recorded it
};

// =============================================================================
// REPORT TYPES
// =============================================================================

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
  id: string;                // Unique identifier
  type: ReportType;          // Type of report
  title: string;             // Report title
  description: string;       // What the report covers
  generatedDate: string;     // When the report was generated
  period: string;            // Time period covered (e.g., "June 2024")
};

// =============================================================================
// INSPECTION TYPES
// =============================================================================

export type InspectionType = 'Pre-trip' | 'Post-trip' | 'Weekly' | 'Monthly';
export type InspectionResult = 'Passed' | 'Failed' | 'Pending';

export type Inspection = {
  id: string;                // Unique identifier
  vehicle: string;           // Vehicle registration
  type: InspectionType;      // Type of inspection
  result: InspectionResult;  // Outcome of inspection
  mileage: number;           // Vehicle mileage at inspection
  notes: string;             // Additional observations
  date: string;              // Date of inspection
  submittedBy: string;       // Driver who submitted
};

// =============================================================================
// ISSUE TYPES
// =============================================================================

export type IssueType = 'Vehicle problem' | 'Accident' | 'Incident' | 'Other';
export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Open' | 'In progress' | 'Resolved';

export type Issue = {
  id: string;                // Unique identifier
  vehicle: string;           // Vehicle registration
  type: IssueType;           // Category of issue
  severity: IssueSeverity;   // How serious the issue is
  status: IssueStatus;       // Current resolution status
  description: string;       // Detailed description
  location: string;          // Where the issue occurred
  date: string;              // When the issue was reported
  reportedBy: string;        // Who reported the issue
};

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. Type: Describes the shape of data (what fields exist, what values they hold)
// 2. Union Type: `string | null` means "a string or null"
// 3. String Literal Union: `'Available' | 'Assigned'` means "one of these strings"
// 4. Optional Field: `head: string?` means "string or undefined"
// 5. Default Value: Defined in the database schema, not in the type
// 6. Relationship: Types don't define relationships — the database does
//    (e.g., a Trip has a vehicle string, but the database links it to the Vehicle table)
//
// WHY TYPES MATTER:
// ----------------
// - Catch errors before runtime
// - Enable auto-complete
// - Document the data model
// - Make refactoring safe
//
// =============================================================================
