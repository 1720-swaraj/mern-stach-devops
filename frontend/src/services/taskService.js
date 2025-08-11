import API from './api';

const taskService = {
  // Get all tasks with filters and pagination
  getTasks: async (params = {}) => {
    const response = await API.get('/tasks', { params });
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  // Toggle task completion
  toggleTask: async (id) => {
    const response = await API.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const response = await API.get('/tasks/stats');
    return response.data;
  }
};

export default taskService;
