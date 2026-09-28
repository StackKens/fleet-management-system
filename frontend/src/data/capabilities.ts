import type { UserRole } from './types';

// ─── Capability Definitions ─────────────────────────────────────────────────

export const CAPABILITIES = {
  // Fleet Manager
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

  // Driver
  VIEW_DRIVER_DASHBOARD: 'view_driver_dashboard',
  VIEW_ASSIGNED_VEHICLE: 'view_assigned_vehicle',
  VIEW_ASSIGNED_TRIPS: 'view_assigned_trips',
  UPDATE_TRIP_STATUS: 'update_trip_status',
  SUBMIT_INSPECTION: 'submit_inspection',
  SUBMIT_FUEL: 'submit_fuel',
  REPORT_VEHICLE_ISSUE: 'report_vehicle_issue',
  REPORT_INCIDENT: 'report_incident',
  VIEW_OWN_NOTIFICATIONS: 'view_own_notifications',

  // Staff
  VIEW_STAFF_DASHBOARD: 'view_staff_dashboard',
  CREATE_VEHICLE_REQUEST: 'create_vehicle_request',
  VIEW_OWN_REQUESTS: 'view_own_requests',
  CANCEL_ELIGIBLE_REQUEST: 'cancel_eligible_request',
  VIEW_OWN_TRIPS: 'view_own_trips',

  // Admin
  VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_DEPARTMENTS: 'manage_departments',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',
} as const;

export type Capability = (typeof CAPABILITIES)[keyof typeof CAPABILITIES];

// ─── Role → Capability Mapping ──────────────────────────────────────────────

export const ROLE_CAPABILITIES: Record<UserRole, Capability[]> = {
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
  ],
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
  Staff: [
    CAPABILITIES.VIEW_STAFF_DASHBOARD,
    CAPABILITIES.CREATE_VEHICLE_REQUEST,
    CAPABILITIES.VIEW_OWN_REQUESTS,
    CAPABILITIES.CANCEL_ELIGIBLE_REQUEST,
    CAPABILITIES.VIEW_OWN_TRIPS,
  ],
  Admin: [
    CAPABILITIES.VIEW_ADMIN_DASHBOARD,
    CAPABILITIES.MANAGE_USERS,
    CAPABILITIES.MANAGE_ROLES,
    CAPABILITIES.MANAGE_DEPARTMENTS,
    CAPABILITIES.VIEW_AUDIT_LOGS,
    CAPABILITIES.MANAGE_SYSTEM_SETTINGS,
  ],
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

// ─── Helper ─────────────────────────────────────────────────────────────────

export function getCapabilitiesForRole(role: UserRole): Capability[] {
  return ROLE_CAPABILITIES[role] ?? [];
}

export function roleHasCapability(role: UserRole, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role]?.includes(capability) ?? false;
}
