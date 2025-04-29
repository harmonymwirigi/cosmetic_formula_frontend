// src/context/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { notificationAPI } from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (unreadOnly = false) => {
    try {
      setLoading(true);
      setError(null);

      const fetchedNotifications = await notificationAPI.getUserNotifications(0, 100, unreadOnly);
      
      if (Array.isArray(fetchedNotifications)) {
        setNotifications(fetchedNotifications);
        
        // Calculate unread count
        const unreadNotifications = fetchedNotifications.filter(
          notification => !notification.is_read
        );
        setUnreadCount(unreadNotifications.length);
      } else {
        console.error('Expected array of notifications but got:', fetchedNotifications);
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh notifications (can be called from components)
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Initialize notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Optional: Set up polling for new notifications
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000); // Check for new notifications every minute
    
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Recalculate unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification,
          is_read: true
        }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  // Add a new notification (can be used for local notifications)
  const addNotification = useCallback((notification) => {
    setNotifications(prevNotifications => [notification, ...prevNotifications]);
    
    if (!notification.is_read) {
      setUnreadCount(prevCount => prevCount + 1);
    }
  }, []);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      
      // Update local state
      const notificationToRemove = notifications.find(n => n.id === notificationId);
      const wasUnread = notificationToRemove && !notificationToRemove.is_read;
      
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      // Update unread count if needed
      if (wasUnread) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  // Context value
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    fetchUnreadNotifications: () => fetchNotifications(true)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;