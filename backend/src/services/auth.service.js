const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
}

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
