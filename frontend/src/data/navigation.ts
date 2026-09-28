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

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  capability: Capability;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type RoleNavigation = {
  role: UserRole;
  sections: NavSection[];
};

// ─── Navigation Configurations ──────────────────────────────────────────────

export const ROLE_NAVIGATION: Record<UserRole, RoleNavigation> = {
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
    ],
  },

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
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },

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
        ],
      },
    ],
  },

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

// ─── Helper ─────────────────────────────────────────────────────────────────

export function getNavigationForRole(role: UserRole): NavSection[] {
  return ROLE_NAVIGATION[role]?.sections ?? [];
}
