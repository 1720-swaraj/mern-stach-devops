const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const { sendSuccess, sendError } = require('../utils/responseUtils');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User already exists with this email');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = generateToken(user._id);

    sendSuccess(res, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }, 201);

  } catch (error) {
    console.error('Register error:', error);
    sendError(res, 500, 'Error registering user');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 400, 'Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      return sendError(res, 400, 'Account is deactivated');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 400, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Error logging in user');
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    sendSuccess(res, 'User data retrieved successfully', { user });
  } catch (error) {
    console.error('Get me error:', error);
    sendError(res, 500, 'Error retrieving user data');
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });

      if (existingUser) {
        return sendError(res, 400, 'Email is already taken');
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 500, 'Error updating profile');
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findById(userId).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 500, 'Error changing password');
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};
