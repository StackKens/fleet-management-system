// =============================================================================
// CAPABILITIES — Role-Based Access Control (RBAC)
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file defines what each role is allowed to do in the system.
// It's the foundation of our Role-Based Access Control (RBAC) system.
//
// WHAT IS RBAC?
// ------------
// RBAC = Role-Based Access Control
//
// Instead of assigning permissions to individual users, we:
// 1. Define ROLES (Admin, Fleet Manager, Driver, Staff, Supervisor)
// 2. Assign CAPABILITIES to each role (e.g., "manage_vehicles", "view_reports")
// 3. Check capabilities when a user tries to do something
//
// WHY RBAC INSTEAD OF HARDCODED ROLE CHECKS?
// -----------------------------------------
// WITHOUT RBAC (hardcoded):
//   if (user.role === 'Admin') { showUserManagement(); }
//   if (user.role === 'Fleet Manager') { showVehicles(); }
//
// Problems:
// - Adding a new role requires changing code in many places
// - Can't change permissions without changing code
// - Can't have temporary permissions
// - Hard to test
//
// WITH RBAC (capabilities):
//   if (hasCapability('manage_users')) { showUserManagement(); }
//   if (hasCapability('view_vehicles')) { showVehicles(); }
//
// Benefits:
// - Flexible: Change permissions without changing code
// - Testable: Easy to test "what can a Fleet Manager do?"
// - Scalable: Add new roles by assigning existing capabilities
// - Auditable: Easy to see what each role can do
//
// WHAT IS A CAPABILITY?
// --------------------
// A capability is a specific action a user can perform.
// Examples:
//   - 'view_vehicles' — Can see the vehicle list
//   - 'manage_vehicles' — Can add/edit/delete vehicles
//   - 'approve_requests' — Can approve vehicle requests
//   - 'view_reports' — Can view fleet reports
//
// WHY NOT JUST CHECK ROLES?
// ------------------------
// - Roles are broad: "Admin" can do many things
// - Capabilities are specific: "manage_users" is one specific action
// - A role can have different permissions in different contexts
// - Easier to grant temporary permissions
//
// =============================================================================

import type { UserRole } from './types';

// =============================================================================
// CAPABILITY DEFINITIONS
// =============================================================================
// We define all capabilities as a const object.
//
// WHY A CONST OBJECT INSTEAD OF STRINGS?
// -------------------------------------
// - Auto-complete: Your editor suggests capability names
// - Type safety: TypeScript checks that capabilities exist
// - Refactoring: Rename a capability, TypeScript shows all usages
// - No typos: 'view_vehilce' would be a type error
//
// NAMING CONVENTION:
// ----------------
// - view_X: Can see X (read-only)
// - manage_X: Can create, edit, and delete X (full control)
// - create_X: Can create X (but not edit/delete)
// - update_X: Can modify X (but not create/delete)
// =============================================================================

export const CAPABILITIES = {
  // ─── Fleet Manager Capabilities ───────────────────────────────────────────
  // These are the permissions needed to manage daily fleet operations.
  VIEW_FLEET_DASHBOARD: 'view_fleet_dashboard',
  VIEW_VEHICLES: 'view_vehicles',
  MANAGE_VEHICLES: 'manage_vehicles',
  VIEW_DRIVERS: 'view_drivers',
  MANAGE_DRIVERS: 'manage_drivers',
  VIEW_REQUESTS: 'view_requests',
  APPROVE_REQUESTS: 'approve_requests',
  VIEW_ASSIGNMENTS: 'view_assignments',
  MANAGE_ASSIGNMENTS: 'manage_assignments',
  VIEW_TRIPS: 'view_trips',
  MANAGE_TRIPS: 'manage_trips',
  VIEW_MAINTENANCE: 'view_maintenance',
  MANAGE_MAINTENANCE: 'manage_maintenance',
  VIEW_FUEL: 'view_fuel',
  MANAGE_FUEL: 'manage_fuel',
  VIEW_REPORTS: 'view_reports',
  VIEW_ACTIVITY: 'view_activity',

  // ─── Driver Capabilities ─────────────────────────────────────────────────
  // These are the permissions needed by drivers to do their job.
  // Drivers have LIMITED access — they only see their own assignments.
  VIEW_DRIVER_DASHBOARD: 'view_driver_dashboard',
  VIEW_ASSIGNED_VEHICLE: 'view_assigned_ehicle',
  VIEW_ASSIGNED_TRIPS: 'view_assigned_trips',
  UPDATE_TRIP_STATUS: 'update_trip_status',
  SUBMIT_INSPECTION: 'submit_inspection',
  SUBMIT_FUEL: 'submit_fuel',
  REPORT_VEHICLE_ISSUE: 'report_vehicle_issue',
  REPORT_INCIDENT: 'report_incident',
  VIEW_OWN_NOTIFICATIONS: 'view_own_notifications',

  // ─── Staff Capabilities ──────────────────────────────────────────────────
  // These are the permissions needed by staff to request vehicles.
  // Staff can ONLY see their own requests and trips.
  VIEW_STAFF_DASHBOARD: 'view_staff_dashboard',
  CREATE_VEHICLE_REQUEST: 'create_vehicle_request',
  VIEW_OWN_REQUESTS: 'view_own_requests',
  CANCEL_ELIGIBLE_REQUEST: 'cancel_eligible_request',
  VIEW_OWN_TRIPS: 'view_own_trips',

  // ─── Admin Capabilities ──────────────────────────────────────────────────
  // These are the permissions needed to manage the platform itself.
  // Admins manage USERS, ROLES, and SETTINGS — not daily operations.
  VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_DEPARTMENTS: 'manage_departments',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',
} as const;

// =============================================================================
// CAPABILITY TYPE
// =============================================================================
// This creates a type that is the union of all capability values.
//
// WHAT DOES THIS DO?
// ----------------
// type Capability = 'view_fleet_dashboard' | 'view_vehicles' | 'manage_vehicles' | ...
//
// WHY IS THIS USEFUL?
// ------------------
// - Type safety: You can't pass an invalid capability
// - Auto-complete: Your editor suggests valid capabilities
// - Documentation: See all available capabilities in one place
// =============================================================================

export type Capability = (typeof CAPABILITIES)[keyof typeof CAPABILITIES];

// =============================================================================
// ROLE → CAPABILITY MAPPING
// =============================================================================
// This is the heart of RBAC: it defines what each role can do.
//
// WHY AN OBJECT INSTEAD OF IF/ELSE?
// --------------------------------
// - Data-driven: Permissions are data, not code
// - Easy to update: Change permissions without changing logic
// - Easy to test: "What can a Fleet Manager do?" → Look at this object
// - Easy to extend: Add a new role by adding a new entry
//
// HOW TO READ THIS:
// ----------------
// 'Fleet Manager': [CAPABILITIES.VIEW_VEHICLES, ...]
//   → The Fleet Manager role has the VIEW_VEHICLES capability
//
// WHY DOES DRIVER HAVE VIEW_OWN_NOTIFICATIONS?
// ------------------------------------------
// Drivers need to see notifications about their assignments.
// Without this capability, they wouldn't see the notifications bell.
//
// WHY DOES ADMIN HAVE VIEW_OWN_NOTIFICATIONS?
// -----------------------------------------
// Admins also need to see system notifications (e.g., "New user registered").
// =============================================================================

export const ROLE_CAPABILITIES: Record<UserRole, Capability[]> = {
  // FLEET MANAGER: Full operational access
  // Can manage vehicles, drivers, requests, trips, maintenance, fuel, reports
  // Cannot manage users, roles, or system settings (that's Admin's job)
  'Fleet Manager': [
    CAPABILITIES.VIEW_FLEET_DASHBOARD,
    CAPABILITIES.VIEW_VEHICLES,
    CAPABILITIES.MANAGE_VEHICLES,
    CAPABILITIES.VIEW_DRIVERS,
    CAPABILITIES.MANAGE_DRIVERS,
    CAPABILITIES.VIEW_REQUESTS,
    CAPABILITIES.APPROVE_REQUESTS,
    CAPABILITIES.VIEW_ASSIGNMENTS,
    CAPABILITIES.MANAGE_ASSIGNMENTS,
    CAPABILITIES.VIEW_TRIPS,
    CAPABILITIES.MANAGE_TRIPS,
    CAPABILITIES.VIEW_MAINTENANCE,
    CAPABILITIES.MANAGE_MAINTENANCE,
    CAPABILITIES.VIEW_FUEL,
    CAPABILITIES.MANAGE_FUEL,
    CAPABILITIES.VIEW_REPORTS,
    CAPABILITIES.VIEW_ACTIVITY,
    CAPABILITIES.MANAGE_DEPARTMENTS,
  ],

  // DRIVER: Limited, self-service access
  // Can only see and manage their own assignments
  // Cannot see other drivers, vehicles, or fleet-wide data
  Driver: [
    CAPABILITIES.VIEW_DRIVER_DASHBOARD,
    CAPABILITIES.VIEW_ASSIGNED_VEHICLE,
    CAPABILITIES.VIEW_ASSIGNED_TRIPS,
    CAPABILITIES.UPDATE_TRIP_STATUS,
    CAPABILITIES.SUBMIT_INSPECTION,
    CAPABILITIES.SUBMIT_FUEL,
    CAPABILITIES.REPORT_VEHICLE_ISSUE,
    CAPABILITIES.REPORT_INCIDENT,
    CAPABILITIES.VIEW_OWN_NOTIFICATIONS,
  ],

  // STAFF: Request-only access
  // Can request vehicles and track their own requests
  // Cannot see fleet management, other staff, or operational data
  Staff: [
    CAPABILITIES.VIEW_STAFF_DASHBOARD,
    CAPABILITIES.CREATE_VEHICLE_REQUEST,
    CAPABILITIES.VIEW_OWN_REQUESTS,
    CAPABILITIES.CANCEL_ELIGIBLE_REQUEST,
    CAPABILITIES.VIEW_OWN_TRIPS,
    CAPABILITIES.VIEW_OWN_NOTIFICATIONS,
  ],

  // ADMIN: Platform administration access
  // Can manage users, roles, departments, and system settings
  // Cannot perform daily fleet operations (that's Fleet Manager's job)
  Admin: [
    CAPABILITIES.VIEW_ADMIN_DASHBOARD,
    CAPABILITIES.MANAGE_USERS,
    CAPABILITIES.MANAGE_ROLES,
    CAPABILITIES.MANAGE_DEPARTMENTS,
    CAPABILITIES.VIEW_AUDIT_LOGS,
    CAPABILITIES.MANAGE_SYSTEM_SETTINGS,
    CAPABILITIES.VIEW_OWN_NOTIFICATIONS,
  ],

  // SUPERVISOR: Operational oversight (limited Admin)
  // Can view fleet data and approve requests
  // Cannot manage users, roles, or fuel records
  Supervisor: [
    CAPABILITIES.VIEW_FLEET_DASHBOARD,
    CAPABILITIES.VIEW_VEHICLES,
    CAPABILITIES.VIEW_DRIVERS,
    CAPABILITIES.VIEW_REQUESTS,
    CAPABILITIES.APPROVE_REQUESTS,
    CAPABILITIES.VIEW_ASSIGNMENTS,
    CAPABILITIES.MANAGE_ASSIGNMENTS,
    CAPABILITIES.VIEW_TRIPS,
    CAPABILITIES.MANAGE_TRIPS,
    CAPABILITIES.VIEW_MAINTENANCE,
    CAPABILITIES.VIEW_FUEL,
    CAPABILITIES.VIEW_REPORTS,
    CAPABILITIES.VIEW_ACTIVITY,
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// getCapabilitiesForRole: Get all capabilities for a given role
// USAGE:
//   const caps = getCapabilitiesForRole('Fleet Manager');
//   // caps = ['view_fleet_dashboard', 'view_vehicles', ...]
//
// WHY THIS FUNCTION?
// ------------------
// - Encapsulation: If the data structure changes, only this function needs updating
// - Type safety: Returns Capability[] (not string[])
// - Convenience: No need to import ROLE_CAPABILITIES directly
export function getCapabilitiesForRole(role: UserRole): Capability[] {
  return ROLE_CAPABILITIES[role] ?? [];
}

// roleHasCapability: Check if a role has a specific capability
// USAGE:
//   if (roleHasCapability('Driver', 'view_assigned_trips')) { ... }
//
// WHY THIS FUNCTION?
// ------------------
// - Readable: Clearer than ROLE_CAPABILITIES[role].includes(cap)
// - Safe: Returns false for unknown roles (no crash)
// - Reusable: Use anywhere you need to check role permissions
export function roleHasCapability(role: UserRole, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role]?.includes(capability) ?? false;
}

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. RBAC: Role-Based Access Control — assign permissions to roles, not users
// 2. Capability: A specific action (e.g., "manage_vehicles")
// 3. Role: A collection of capabilities (e.g., "Fleet Manager")
// 4. Permission Check: "Does this user's role have this capability?"
// 5. Data-Driven: Permissions are data, not code
//
// WHY THIS PATTERN?
// ----------------
// - Flexible: Change permissions without changing code
// - Testable: Easy to test "what can each role do?"
// - Scalable: Add new roles by assigning existing capabilities
// - Auditable: Easy to see what each role can do
// - Maintainable: All permissions in one place
//
// =============================================================================
