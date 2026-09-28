const userService = require('../services/user.service');

// GET /api/users — list all users with optional filters
async function getAll(req, res, next) {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

// GET /api/users/:id — get a single user
async function getById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// PUT /api/users/:id — update a user
async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/users/:id — delete a user
async function remove(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, update, remove };
