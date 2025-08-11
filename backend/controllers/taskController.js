const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseUtils');

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter object
    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = new RegExp(category, 'i');

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // Get user statistics
    const stats = await Task.getUserStats(req.user.id);

    sendSuccess(res, 'Tasks retrieved successfully', {
      tasks,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalTasks: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      stats
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    sendError(res, 500, 'Error retrieving tasks');
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    sendSuccess(res, 'Task retrieved successfully', { task });
  } catch (error) {
    console.error('Get task error:', error);
    sendError(res, 500, 'Error retrieving task');
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      category,
      tags,
      user: req.user.id
    });

    const populatedTask = await Task.findById(task._id).populate('user', 'name email');

    sendSuccess(res, 'Task created successfully', { task: populatedTask }, 201);
  } catch (error) {
    console.error('Create task error:', error);
    sendError(res, 500, 'Error creating task');
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    const { title, description, status, priority, dueDate, category, tags } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        category,
        tags
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    sendSuccess(res, 'Task updated successfully', { task });
  } catch (error) {
    console.error('Update task error:', error);
    sendError(res, 500, 'Error updating task');
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    await Task.findByIdAndDelete(req.params.id);

    sendSuccess(res, 'Task deleted successfully');
  } catch (error) {
    console.error('Delete task error:', error);
    sendError(res, 500, 'Error deleting task');
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskCompletion = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    // Toggle completion status
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        status: newStatus,
        isCompleted: newStatus === 'completed',
        completedAt: newStatus === 'completed' ? new Date() : null
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    sendSuccess(res, 'Task status updated successfully', { task });
  } catch (error) {
    console.error('Toggle task error:', error);
    sendError(res, 500, 'Error updating task status');
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.getUserStats(req.user.id);

    // Get tasks by priority
    const priorityStats = await Task.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: req.user.id,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    sendSuccess(res, 'Task statistics retrieved successfully', {
      statusStats: stats,
      priorityStats,
      overdueTasks
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    sendError(res, 500, 'Error retrieving task statistics');
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats
};
