// Role-based authorization middleware
// Usage: authorize('Admin', 'Fleet Manager') — only these roles can access

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
}

module.exports = authorize;
