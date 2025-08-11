const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');

const { auth, adminAuth } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', auth, adminAuth, getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, getUserById);

// @route   PUT /api/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private/Admin
router.put('/:id/status', auth, adminAuth, [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value')
], validateRequest, updateUserStatus);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;
