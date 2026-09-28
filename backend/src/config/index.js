// Config — loads environment variables and exports them
// This keeps all configuration in one place

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
