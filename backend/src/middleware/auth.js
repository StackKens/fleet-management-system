const authService = require('../services/auth.service');

// Middleware that protects routes by requiring a valid JWT token
// The token is sent in the Authorization header as: Bearer <token>
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }

  // Attach user info to the request so controllers can use it
  req.userId = decoded.id;
  req.userRole = decoded.role;
  req.userName = decoded.name;

  next();
}

module.exports = authenticate;
