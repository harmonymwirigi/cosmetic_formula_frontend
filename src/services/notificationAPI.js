// frontend/src/services/notificationAPI.js
import axios from 'axios';
import { handleApiError } from './errorHandler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create an axios instance with auth header
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
authAxios.interceptors.request.use(
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

export const notificationAPI = {
  // Get user notifications with optional filters
 // Check your frontend API service
getUserNotifications: async (skip = 0, limit = 100, unreadOnly = false) => {
  try {
    // Make sure the URL matches exactly - note the trailing slash!
    const response = await api.get('/api/notifications/', {
      params: {
        skip,
        limit,
        unread_only: unreadOnly
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty array to prevent UI errors
    return [];
  }
},

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await authAxios.post(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await authAxios.post(`/api/notifications/read-all`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await authAxios.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    try {
      const response = await authAxios.get(`/api/notifications/preferences`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (notificationType, preferences) => {
    try {
      const response = await authAxios.put(`/api/notifications/preferences/${notificationType}`, preferences);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default notificationAPI;