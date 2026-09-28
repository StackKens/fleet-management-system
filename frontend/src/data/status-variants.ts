// ─── Shared Status Variant Maps ─────────────────────────────────────────────
// Centralized status-to-variant mappings to ensure consistency across all pages.

export const vehicleStatusVariant: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  Available: 'success',
  Assigned: 'info',
  'In service': 'warning',
  Maintenance: 'danger',
};

export const driverStatusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  Active: 'success',
  'On leave': 'warning',
  Suspended: 'danger',
  Inactive: 'default',
};

export const requestStatusVariant: Record<string, 'warning' | 'success' | 'danger' | 'default'> = {
  Pending: 'warning',
  Approved: 'success',
  Declined: 'danger',
  Completed: 'default',
};

export const tripStatusVariant: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
  Scheduled: 'warning',
  'On route': 'info',
  Returned: 'success',
  Cancelled: 'danger',
};

export const maintenanceStatusVariant: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
  Scheduled: 'warning',
  'In progress': 'info',
  Completed: 'success',
  Cancelled: 'danger',
};

export const maintenanceTypeVariant: Record<string, 'default' | 'warning' | 'info' | 'danger'> = {
  'Routine service': 'default',
  Repair: 'warning',
  Inspection: 'info',
  Emergency: 'danger',
};

export const assignmentStatusVariant: Record<string, 'success' | 'default' | 'danger'> = {
  Active: 'success',
  Completed: 'default',
  Cancelled: 'danger',
};

export const issueStatusVariant: Record<string, 'warning' | 'info' | 'success'> = {
  Open: 'warning',
  'In progress': 'info',
  Resolved: 'success',
};

export const inspectionResultVariant: Record<string, 'success' | 'danger' | 'warning'> = {
  Passed: 'success',
  Failed: 'danger',
  Pending: 'warning',
};

export const severityVariant: Record<string, 'default' | 'warning' | 'danger'> = {
  Low: 'default',
  Medium: 'warning',
  High: 'danger',
  Critical: 'danger',
};

export const roleVariant: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  Admin: 'danger',
  'Fleet Manager': 'primary',
  Driver: 'success',
  Staff: 'default',
  Supervisor: 'warning',
};

export const activityTypeVariant: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  assignment: 'info',
  request: 'warning',
  maintenance: 'success',
  system: 'default',
  fuel: 'info',
  trip: 'success',
};

export const notificationTypeVariant: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  maintenance: 'success',
  request: 'warning',
  assignment: 'info',
  document: 'default',
  system: 'default',
};
