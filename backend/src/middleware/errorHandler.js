// Error Handler Middleware
// Catches all errors and returns a consistent JSON response
// This prevents sensitive server details from leaking to clients

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  if (err.code === 'P2002') {
    // Prisma unique constraint violation
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    message = 'Record not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
