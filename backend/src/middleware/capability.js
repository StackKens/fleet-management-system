const { hasCapability } = require('../config/capabilities');

function requireCapability(capability) {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (!hasCapability(req.userRole, capability)) {
      return res.status(403).json({ success: false, message: 'You do not have permission' });
    }

    next();
  };
}

module.exports = requireCapability;
