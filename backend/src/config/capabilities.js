// Capabilities — defines what each role is allowed to do
// This mirrors the frontend capability system

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

// Check if a role has a specific capability
function hasCapability(role, capability) {
  const caps = CAPABILITIES[role];
  if (!caps) return false;
  return caps.includes(capability) || caps.includes('view_all');
}

// Get all capabilities for a role
function getCapabilities(role) {
  return CAPABILITIES[role] || [];
}

module.exports = {
  CAPABILITIES,
  hasCapability,
  getCapabilities,
};
