// =============================================================================
// NAVIGATION — Role-Based Menu Configuration
// =============================================================================
//
// WHAT IS THIS FILE?
// ------------------
// This file defines what menu items each role sees in the sidebar.
// It's the configuration that makes navigation role-specific.
//
// WHY A SEPARATE NAVIGATION FILE?
// ------------------------------
// Without this, navigation would be hardcoded in the component:
//   // In fleet-shell.tsx
//   if (user.role === 'Driver') {
//     return <DriverNav />;
//   } else if (user.role === 'Staff') {
//     return <StaffNav />;
//   }
//
// Problems:
// - Navigation logic is mixed with UI logic
// - Hard to see all navigation at a glance
// - Changing navigation requires changing components
// - Can't easily test navigation structure
//
// With a separate config file:
//   // In navigation.ts
//   export const ROLE_NAVIGATION = {
//     Driver: { sections: [...] },
//     Staff: { sections: [...] },
//   };
//
// Benefits:
// - Centralized: All navigation in one place
// - Data-driven: Navigation is data, not code
// - Easy to update: Change navigation without touching components
// - Testable: Easy to verify "what does a Driver see?"
//
// HOW IT WORKS:
// ------------
// 1. Define navigation structure for each role
// 2. Each nav item has a capability requirement
// 3. The sidebar renders items based on the user's role
// 4. RouteGuard checks the capability when navigating
//
// =============================================================================

import type { LucideIcon } from 'lucide-react';
import {
  Gauge,
  Truck,
  ClipboardList,
  CarFront,
  UsersRound,
  Activity,
  Wrench,
  Fuel,
  BarChart3,
  UserRound,
  Settings,
  FileText,
  AlertTriangle,
  UserCog,
  Building2,
  ScrollText,
  Bell,
} from 'lucide-react';
import type { UserRole } from './types';
import { CAPABILITIES, type Capability } from './capabilities';

// =============================================================================
// TYPES
// =============================================================================

// NavItem: A single navigation menu item
// WHY THESE FIELDS?
// ----------------
// - label: Display text (e.g., "Vehicles")
// - href: URL path (e.g., "/vehicles")
// - icon: Lucide icon component
// - capability: Required permission to see this item
//
// WHY A CAPABILITY ON EACH ITEM?
// ------------------------------
// - Defense in depth: Even if someone modifies the frontend, the backend
//   still checks capabilities
// - Flexibility: Can show/hide items based on permissions
// - Consistency: Same capability check as route protection
export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  capability: Capability;
};

// NavSection: A group of related navigation items
// WHY SECTIONS?
// ------------
// - Organization: Group related items together (e.g., "Workspace", "Operations")
// - Scannability: Users can find what they need faster
// - Visual hierarchy: Sections create visual separation in the sidebar
export type NavSection = {
  title: string;
  items: NavItem[];
};

// RoleNavigation: The complete navigation structure for a role
export type RoleNavigation = {
  role: UserRole;
  sections: NavSection[];
};

// =============================================================================
// ROLE NAVIGATION CONFIGURATIONS
// =============================================================================
// Each role gets a completely different navigation structure.
// This is NOT just filtering a single list — each role has its own
// sections, items, and organization.
//
// WHY DIFFERENT SECTIONS PER ROLE?
// -------------------------------
// - Driver: "My Work", "Actions", "General" — focused on their tasks
// - Staff: "Transportation", "General" — focused on requesting vehicles
// - Fleet Manager: "Workspace", "Operations", "Administration" — full operations
// - Admin: "Platform", "System" — focused on platform management
//
// This makes each role feel like they have their OWN application,
// not just a filtered version of the same app.
// =============================================================================

export const ROLE_NAVIGATION: Record<UserRole, RoleNavigation> = {
  // ─── FLEET MANAGER ─────────────────────────────────────────────────────────
  // The Fleet Manager needs access to ALL operational features.
  // Their navigation is organized into three sections:
  //   1. Workspace: Daily operations (vehicles, drivers, requests, trips)
  //   2. Operations: Maintenance, fuel, and reports
  //   3. Administration: Department management and profile
  'Fleet Manager': {
    role: 'Fleet Manager',
    sections: [
      {
        title: 'Workspace',
        items: [
          { label: 'Dashboard', href: '/dashboard', icon: Gauge, capability: CAPABILITIES.VIEW_FLEET_DASHBOARD },
          { label: 'Vehicles', href: '/vehicles', icon: Truck, capability: CAPABILITIES.VIEW_VEHICLES },
          { label: 'Drivers', href: '/drivers', icon: UsersRound, capability: CAPABILITIES.VIEW_DRIVERS },
          { label: 'Requests', href: '/requests', icon: ClipboardList, capability: CAPABILITIES.VIEW_REQUESTS },
          { label: 'Assignments', href: '/assignments', icon: CarFront, capability: CAPABILITIES.VIEW_ASSIGNMENTS },
          { label: 'Trips', href: '/trips', icon: Activity, capability: CAPABILITIES.VIEW_TRIPS },
        ],
      },
      {
        title: 'Operations',
        items: [
          { label: 'Maintenance', href: '/maintenance', icon: Wrench, capability: CAPABILITIES.VIEW_MAINTENANCE },
          { label: 'Fuel', href: '/fuel', icon: Fuel, capability: CAPABILITIES.VIEW_FUEL },
          { label: 'Reports', href: '/reports', icon: BarChart3, capability: CAPABILITIES.VIEW_REPORTS },
        ],
      },
      {
        title: 'Administration',
        items: [
          { label: 'Departments', href: '/departments', icon: Building2, capability: CAPABILITIES.MANAGE_DEPARTMENTS },
          { label: 'Profile', href: '/profile', icon: UserRound, capability: CAPABILITIES.VIEW_OWN_NOTIFICATIONS },
        ],
      },
    ],
  },

  // ─── DRIVER ───────────────────────────────────────────────────────────────
  // The Driver needs a SIMPLE, focused interface.
  // They only care about:
  //   1. Their assigned vehicle
  //   2. Their trips
  //   3. Submitting inspections, fuel, and issues
  //   4. Notifications
  //
  // They should NOT see:
  //   - Fleet-wide vehicle management
  //   - Driver management
  //   - Request approvals
  //   - Reports
  //   - User management
  Driver: {
    role: 'Driver',
    sections: [
      {
        title: 'My Work',
        items: [
          { label: 'Dashboard', href: '/dashboard', icon: Gauge, capability: CAPABILITIES.VIEW_DRIVER_DASHBOARD },
          { label: 'My Vehicle', href: '/my-vehicle', icon: Truck, capability: CAPABILITIES.VIEW_ASSIGNED_VEHICLE },
          { label: 'My Trips', href: '/my-trips', icon: Activity, capability: CAPABILITIES.VIEW_ASSIGNED_TRIPS },
        ],
      },
      {
        title: 'Actions',
        items: [
          { label: 'Inspections', href: '/inspections', icon: FileText, capability: CAPABILITIES.SUBMIT_INSPECTION },
          { label: 'Fuel', href: '/my-fuel', icon: Fuel, capability: CAPABILITIES.SUBMIT_FUEL },
          { label: 'Report an Issue', href: '/report-issue', icon: AlertTriangle, capability: CAPABILITIES.REPORT_VEHICLE_ISSUE },
        ],
      },
      {
        title: 'General',
        items: [
          { label: 'Notifications', href: '/notifications', icon: Bell, capability: CAPABILITIES.VIEW_OWN_NOTIFICATIONS },
          { label: 'Profile', href: '/profile', icon: UserRound, capability: CAPABILITIES.VIEW_OWN_NOTIFICATIONS },
        ],
      },
    ],
  },

  // ─── STAFF ────────────────────────────────────────────────────────────────
  // The Staff member needs a REQUEST-FOCUSED interface.
  // Their primary workflow is:
  //   1. Request a vehicle
  //   2. Track the request status
  //   3. View assigned trips
  //
  // They should NOT see:
  //   - Fleet management
  //   - Driver management
  //   - Maintenance
  //   - Fuel management
  //   - Reports
  Staff: {
    role: 'Staff',
    sections: [
      {
        title: 'Transportation',
        items: [
          { label: 'Dashboard', href: '/dashboard', icon: Gauge, capability: CAPABILITIES.VIEW_STAFF_DASHBOARD },
          { label: 'Request a Vehicle', href: '/request-vehicle', icon: ClipboardList, capability: CAPABILITIES.CREATE_VEHICLE_REQUEST },
          { label: 'My Requests', href: '/my-requests', icon: FileText, capability: CAPABILITIES.VIEW_OWN_REQUESTS },
          { label: 'My Trips', href: '/my-trips', icon: Activity, capability: CAPABILITIES.VIEW_OWN_TRIPS },
        ],
      },
      {
        title: 'General',
        items: [
          { label: 'Notifications', href: '/notifications', icon: Bell, capability: CAPABILITIES.VIEW_OWN_NOTIFICATIONS },
          { label: 'Profile', href: '/profile', icon: UserRound, capability: CAPABILITIES.VIEW_OWN_NOTIFICATIONS },
        ],
      },
    ],
  },

  // ─── ADMIN ────────────────────────────────────────────────────────────────
  // The Admin needs a PLATFORM-FOCUSED interface.
  // They manage the system, not daily operations.
  // Their navigation is organized into two sections:
  //   1. Platform: Users, roles, departments
  //   2. System: Audit logs, settings, profile
  //
  // They should NOT see:
  //   - Fleet operations (vehicles, drivers, trips)
  //   - Maintenance
  //   - Fuel management
  //   - Reports
  Admin: {
    role: 'Admin',
    sections: [
      {
        title: 'Platform',
        items: [
          { label: 'Dashboard', href: '/dashboard', icon: Gauge, capability: CAPABILITIES.VIEW_ADMIN_DASHBOARD },
          { label: 'Users', href: '/users', icon: UserRound, capability: CAPABILITIES.MANAGE_USERS },
          { label: 'Roles', href: '/roles', icon: UserCog, capability: CAPABILITIES.MANAGE_ROLES },
          { label: 'Departments', href: '/departments', icon: Building2, capability: CAPABILITIES.MANAGE_DEPARTMENTS },
        ],
      },
      {
        title: 'System',
        items: [
          { label: 'Audit Logs', href: '/audit-logs', icon: ScrollText, capability: CAPABILITIES.VIEW_AUDIT_LOGS },
          { label: 'Settings', href: '/settings', icon: Settings, capability: CAPABILITIES.MANAGE_SYSTEM_SETTINGS },
          { label: 'Profile', href: '/profile', icon: UserRound, capability: CAPABILITIES.VIEW_OWN_NOTIFICATIONS },
        ],
      },
    ],
  },

  // ─── SUPERVISOR ───────────────────────────────────────────────────────────
  // The Supervisor has a similar navigation to Fleet Manager but with
  // fewer permissions. They can view and manage operations but cannot
  // manage users, roles, or fuel records.
  Supervisor: {
    role: 'Supervisor',
    sections: [
      {
        title: 'Workspace',
        items: [
          { label: 'Dashboard', href: '/dashboard', icon: Gauge, capability: CAPABILITIES.VIEW_FLEET_DASHBOARD },
          { label: 'Vehicles', href: '/vehicles', icon: Truck, capability: CAPABILITIES.VIEW_VEHICLES },
          { label: 'Drivers', href: '/drivers', icon: UsersRound, capability: CAPABILITIES.VIEW_DRIVERS },
          { label: 'Requests', href: '/requests', icon: ClipboardList, capability: CAPABILITIES.VIEW_REQUESTS },
          { label: 'Assignments', href: '/assignments', icon: CarFront, capability: CAPABILITIES.VIEW_ASSIGNMENTS },
          { label: 'Trips', href: '/trips', icon: Activity, capability: CAPABILITIES.VIEW_TRIPS },
        ],
      },
      {
        title: 'Operations',
        items: [
          { label: 'Maintenance', href: '/maintenance', icon: Wrench, capability: CAPABILITIES.VIEW_MAINTENANCE },
          { label: 'Fuel', href: '/fuel', icon: Fuel, capability: CAPABILITIES.VIEW_FUEL },
          { label: 'Reports', href: '/reports', icon: BarChart3, capability: CAPABILITIES.VIEW_REPORTS },
        ],
      },
    ],
  },
};

// =============================================================================
// HELPER FUNCTION
// =============================================================================

// getNavigationForRole: Get the navigation structure for a given role
// USAGE:
//   const sections = getNavigationForRole(user.role);
//   // sections = [{ title: 'Workspace', items: [...] }, ...]
//
// WHY THIS FUNCTION?
// ------------------
// - Encapsulation: If the data structure changes, only this function needs updating
// - Type safety: Returns NavSection[] (not any)
// - Convenience: No need to import ROLE_NAVIGATION directly
// - Default handling: Returns empty array for unknown roles
export function getNavigationForRole(role: UserRole): NavSection[] {
  return ROLE_NAVIGATION[role]?.sections ?? [];
}

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. Role-Based Navigation: Each role sees different menu items
// 2. Capability-Gated: Each item requires a specific permission
// 3. Section-Based: Items are grouped into logical sections
// 4. Data-Driven: Navigation is configuration, not code
// 5. Purpose-Built: Each role feels like they have their own app
//
// WHY THIS PATTERN?
// ----------------
// - UX: Users only see what they need
// - Security: Items are hidden based on permissions
// - Maintainable: All navigation in one place
// - Testable: Easy to verify "what does each role see?"
// - Scalable: Easy to add new roles or menu items
//
// =============================================================================
