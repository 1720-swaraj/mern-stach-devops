import API from './api';

const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await API.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await API.put('/auth/change-password', passwordData);
    return response.data;
  }
};

export default authService;
