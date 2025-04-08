// frontend/src/pages/Notifications.jsx
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { notificationAPI } from '../services/notificationAPI';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'system', 'formula', 'subscription'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const PER_PAGE = 10;

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData(user);
    
    // Initial load of notifications
    fetchNotifications();
  }, [activeTab, page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Calculate skip value for pagination
      const skip = (page - 1) * PER_PAGE;
      
      // Filter by unread if on unread tab
      const unreadOnly = activeTab === 'unread';
      
      // Fetch notifications
      const notificationsData = await notificationAPI.getUserNotifications(skip, PER_PAGE, unreadOnly);
      
      // If first page, replace notifications, otherwise append
      if (page === 1) {
        setNotifications(notificationsData);
      } else {
        setNotifications(prev => [...prev, ...notificationsData]);
      }
      
      // Check if there are more notifications to load
      setHasMore(notificationsData.length === PER_PAGE);
      
      // TODO: Get total count from API when implemented
      // setTotalCount(response.headers['x-total-count']);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      // Update notification state to mark all as read
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification,
          is_read: true
        }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      // Update notification state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      // Remove notification from state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.is_read;
    return notification.notification_type === activeTab;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'system':
        return (
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <svg className="w-4 h-4 fill-current text-blue-500 dark:text-blue-400" viewBox="0 0 16 16">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"/>
            </svg>
          </div>
        );
      case 'formula':
        return (
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <svg className="w-4 h-4 fill-current text-green-500 dark:text-green-400" viewBox="0 0 16 16">
              <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z"/>
            </svg>
          </div>
        );
      case 'subscription':
        return (
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-violet-100 dark:bg-violet-900/30">
            <svg className="w-4 h-4 fill-current text-violet-500 dark:text-violet-400" viewBox="0 0 16 16">
              <path d="M4.3 4.5c1.9-1.9 5.1-1.9 7 0 .7.7 1.2 1.7 1.4 2.7l2-.3c-.2-1.5-.9-2.8-1.9-3.8C10.1.4 5.7.4 2.9 3.1L.7.9 0 7.3l6.4-.7-2.1-2.1zM15.6 8.7l-6.4.7 2.1 2.1c-1.9 1.9-5.1 1.9-7 0-.7-.7-1.2-1.7-1.4-2.7l-2 .3c.2 1.5.9 2.8 1.9 3.8 1.4 1.4 3.1 2 4.9 2 1.8 0 3.6-.7 4.9-2l2.2 2.2.8-6.4z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400" viewBox="0 0 16 16">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"/>
            </svg>
          </div>
        );
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    // If less than 1 day ago, show relative time
    if (Date.now() - date.getTime() < 86400000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    // Otherwise show formatted date
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            {/* Page header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Notifications</h1>
              </div>

              {/* Right: Actions */}
              <div className="flex gap-2">
                <Link 
                  to="/settings/notifications" 
                  className="btn-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400 mr-2" viewBox="0 0 16 16">
                    <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z"/>
                  </svg>
                  <span>Settings</span>
                </Link>
                <button 
                  onClick={handleMarkAllAsRead}
                  className="btn-sm bg-violet-500 hover:bg-violet-600 text-white"
                >
                  Mark All as Read
                </button>
              </div>
            </div>

            {/* Notification filters */}
            <div className="mb-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                  <button
                    className={`px-3 py-2 rounded-lg ${activeTab === 'all' 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleTabChange('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg ${activeTab === 'unread' 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleTabChange('unread')}
                  >
                    Unread
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg ${activeTab === 'system' 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleTabChange('system')}
                  >
                    System
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg ${activeTab === 'formula' 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleTabChange('formula')}
                  >
                    Formula
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg ${activeTab === 'subscription' 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleTabChange('subscription')}
                  >
                    Subscription
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications list */}
            <div className="space-y-4">
              {loading && page === 1 ? (
                // Loading state
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
              ) : filteredNotifications.length > 0 ? (
                // Notifications list
                <>
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 md:p-5 rounded-lg shadow-xs ${
                        notification.is_read 
                          ? 'bg-white dark:bg-gray-800' 
                          : 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500 dark:border-violet-400'
                      }`}
                    >
                      <div className="flex items-start">
                        {/* Notification icon */}
                        {getNotificationIcon(notification.notification_type)}
                        
                        {/* Notification content */}
                        <div className="grow ml-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className={`font-semibold mb-1 ${
                                notification.is_read 
                                  ? 'text-gray-800 dark:text-gray-100' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {notification.title}
                              </div>
                              <div className={`${
                                notification.is_read 
                                  ? 'text-gray-600 dark:text-gray-400' 
                                  : 'text-gray-800 dark:text-gray-200'
                              }`}>
                                {notification.message}
                              </div>
                            </div>
                            
                            {/* Timestamp and actions */}
                            <div className="flex flex-col items-end ml-2">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {formatNotificationTime(notification.created_at)}
                              </div>
                              <div className="flex gap-2 mt-1">
                                {!notification.is_read && (
                                  <button 
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="text-xs text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="text-xs text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                                >
                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                                  <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5h-1V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v2zM6 2v1h4V2H6zm7 3H3v9h10V5z"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action link based on notification type */}
                          {notification.reference_id && (
                            <div className="mt-2">
                              {notification.notification_type === 'formula' && (
                                <Link to={`/formulas/${notification.reference_id}`} className="text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 mt-2">
                                  View Formula →
                                </Link>
                              )}
                              {notification.notification_type === 'subscription' && (
                                <Link to="/settings/billing" className="text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 mt-2">
                                  View Subscription →
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Load more button */}
                  {hasMore && (
                    <div className="text-center pt-4">
                      <button
                        onClick={handleLoadMore}
                        className="btn border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin mr-2 w-4 h-4 border-t-2 border-r-2 border-violet-500 rounded-full"></div>
                            Loading...
                          </>
                        ) : (
                          'Load More'
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Empty state
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 mx-auto flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 fill-current text-violet-500 dark:text-violet-400" viewBox="0 0 16 16">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">No notifications</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeTab === 'all' 
                      ? "You don't have any notifications yet."
                      : `You don't have any ${activeTab} notifications.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Notifications;