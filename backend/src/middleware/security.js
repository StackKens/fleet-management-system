const rateLimit = require('express-rate-limit');

// Rate limiting — prevents brute force attacks
// Limits each IP to 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});

// Stricter limit for auth endpoints — prevents brute force on login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

module.exports = { apiLimiter, authLimiter };
