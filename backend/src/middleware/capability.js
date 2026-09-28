const { hasCapability } = require('../config/capabilities');

// Capability-based authorization middleware
// Usage: requireCapability('approve_requests') — only users with this capability can access
function requireCapability(capability) {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!hasCapability(req.userRole, capability)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
}

module.exports = requireCapability;
