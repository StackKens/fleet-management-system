const { PrismaClient } = require('@prisma/client');
const authService = require('../services/auth.service');

const prisma = new PrismaClient();

// POST /api/auth/register
// Creates a new user account with hashed password
async function register(req, res, next) {
  try {
    const { name, email, password, role, phone, departmentId } = req.body;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Hash the password before storing
    const passwordHash = await authService.hashPassword(password);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'Staff',
        phone,
        departmentId,
      },
    });

    // Generate JWT token
    const token = authService.generateToken(user);

    // Return user data (excluding password hash) and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        departmentId: user.departmentId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
// Verifies credentials and returns a JWT token
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isValid = await authService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = authService.generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        departmentId: user.departmentId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
// Returns the currently authenticated user's profile
async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        department: {
          select: { id: true, name: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};
