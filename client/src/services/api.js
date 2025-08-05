import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Items API
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (itemData) => api.post('/items', itemData),
  update: (id, itemData) => api.put(`/items/${id}`, itemData),
  delete: (id) => api.delete(`/items/${id}`),
  getUserItems: (userId, params) => api.get(`/items/user/${userId}`, { params }),
  uploadImages: (id, formData) => api.post(`/items/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteImage: (itemId, imageId) => api.delete(`/items/${itemId}/images/${imageId}`),
};

// Requests API
export const requestsAPI = {
  create: (requestData) => api.post('/requests', requestData),
  getMyRequests: (params) => api.get('/requests/my-requests', { params }),
  getReceived: (params) => api.get('/requests/received', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  updateStatus: (id, statusData) => api.put(`/requests/${id}/status`, statusData),
  sendMessage: (id, messageData) => api.post(`/requests/${id}/messages`, messageData),
  complete: (id, completionData) => api.put(`/requests/${id}/complete`, completionData),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  getById: (id) => api.get(`/users/${id}`),
  getItems: (id, params) => api.get(`/users/${id}/items`, { params }),
  getStats: (id) => api.get(`/users/${id}/stats`),
  getLeaderboard: (params) => api.get('/users/leaderboard/top-donors', { params }),
  search: (params) => api.get('/users/search', { params }),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  deleteAccount: () => api.delete('/users/account'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  blockUser: (id, isBlocked) => api.put(`/admin/users/${id}/block`, { isBlocked }),
  verifyUser: (id, isVerified) => api.put(`/admin/users/${id}/verify`, { isVerified }),
  getItems: (params) => api.get('/admin/items', { params }),
  moderateItem: (id, moderationData) => api.put(`/admin/items/${id}/moderate`, moderationData),
  deleteItem: (id) => api.delete(`/admin/items/${id}`),
  getRequests: (params) => api.get('/admin/requests', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 