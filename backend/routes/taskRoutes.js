const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats
} = require('../controllers/taskController');

const { auth } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Private
router.get('/stats', auth, getTaskStats);

// @route   GET /api/tasks
// @desc    Get all tasks for user
// @access  Private
router.get('/', auth, [
  query('status').optional().isIn(['pending', 'in-progress', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'title', 'dueDate', 'priority']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], getTasks);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must be less than 30 characters')
], validateRequest, createTask);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', auth, getTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], validateRequest, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, deleteTask);

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completion
// @access  Private
router.patch('/:id/toggle', auth, toggleTaskCompletion);

module.exports = router;
