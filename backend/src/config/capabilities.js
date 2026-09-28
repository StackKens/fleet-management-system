const CAPABILITIES = {
  Admin: [
    'manage_users', 'manage_vehicles', 'manage_drivers',
    'manage_requests', 'approve_requests', 'manage_assignments',
    'manage_trips', 'manage_maintenance', 'manage_fuel',
    'manage_expenses', 'manage_inspections', 'manage_issues',
    'view_reports', 'manage_settings', 'view_all',
  ],
  'Fleet Manager': [
    'manage_vehicles', 'manage_drivers', 'manage_requests',
    'approve_requests', 'manage_assignments', 'manage_trips',
    'manage_maintenance', 'manage_fuel', 'manage_expenses',
    'manage_inspections', 'manage_issues', 'view_reports', 'view_all',
  ],
  Supervisor: [
    'view_vehicles', 'view_drivers', 'view_requests',
    'manage_assignments', 'view_trips', 'view_reports', 'view_all',
  ],
  Driver: [
    'view_own_trips', 'update_own_trips', 'submit_inspections',
    'submit_fuel_records', 'report_issues', 'view_own_profile',
  ],
  Staff: [
    'create_requests', 'view_own_requests', 'view_own_trips',
    'view_own_profile',
  ],
};

function hasCapability(role, capability) {
  const caps = CAPABILITIES[role];
  if (!caps) return false;
  return caps.includes(capability) || caps.includes('view_all');
}

function getCapabilities(role) {
  return CAPABILITIES[role] || [];
}

module.exports = {
  CAPABILITIES,
  hasCapability,
  getCapabilities,
};
