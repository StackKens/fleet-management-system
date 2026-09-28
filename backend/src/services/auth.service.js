const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Hash a plain-text password using bcrypt
// bcrypt automatically generates a salt and combines it with the hash
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

// Compare a plain-text password against a stored hash
async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Generate a JWT token for an authenticated user
// The token contains the user's id, name, email, and role
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
}

// Verify a JWT token and return the decoded payload
// Returns null if the token is invalid or expired
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
};
