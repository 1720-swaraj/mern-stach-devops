const User = require('../models/User');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseUtils');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(res, 'Users retrieved successfully', {
      users,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    sendError(res, 500, 'Error retrieving users');
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Get user's task statistics
    const taskStats = await Task.getUserStats(user._id);

    sendSuccess(res, 'User retrieved successfully', {
      user,
      taskStats
    });
  } catch (error) {
    console.error('Get user error:', error);
    sendError(res, 500, 'Error retrieving user');
  }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 'User status updated successfully', { user });
  } catch (error) {
    console.error('Update user status error:', error);
    sendError(res, 500, 'Error updating user status');
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Delete all user's tasks
    await Task.deleteMany({ user: req.params.id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    sendSuccess(res, 'User and associated tasks deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    sendError(res, 500, 'Error deleting user');
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser
};
