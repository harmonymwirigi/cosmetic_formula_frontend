// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import Notification from '../components/Notifications/Notification';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../components/Notifications/ToastContainer';

function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  const { 
    notifications, 
    loading, 
    error, 
    refreshNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const toast = useToast();

  // Get user data from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Refresh notifications when the page loads
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Handle marking all as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.showSuccess({ 
      title: 'Success', 
      message: 'All notifications marked as read' 
    });
  };

  // Handle notification deletion
  const handleDelete = async (id) => {
    await deleteNotification(id);
    toast.showSuccess({ 
      title: 'Success', 
      message: 'Notification deleted' 
    });
  };

  // Filter notifications based on selected type
  const filteredNotifications = notifications.filter(notification => 
    filterType === 'all' || notification.notification_type === filterType
  );

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.created_at).toLocaleDateString();
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(notification);
    return groups;
  }, {});

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Notifications</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <div className="relative inline-flex">
                  <select
                    className="form-select pl-3 pr-8 py-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-md focus:ring-violet-500 focus:border-violet-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Notifications</option>
                    <option value="system">System</option>
                    <option value="formula">Formula</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
                <button
                  className="btn bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 text-gray-600 dark:text-gray-300"
                  onClick={refreshNotifications}
                >
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm4-8c0-.6-.4-1-1-1H7c-.6 0-1 .4-1 1s.4 1 1 1h4c.6 0 1-.4 1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Refresh</span>
                </button>
                <button
                  className="btn bg-violet-500 hover:bg-violet-600 text-white"
                  onClick={handleMarkAllAsRead}
                  disabled={!filteredNotifications.some(n => !n.is_read)}
                >
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z"/>
                  </svg>
                  <span className="hidden xs:block ml-2">Mark All as Read</span>
                </button>
              </div>
            </div>

            {/* Notifications content */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500 dark:text-red-400">
                  <p>Failed to load notifications. Please try again.</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No notifications found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filterType === 'all' 
                      ? 'You don\'t have any notifications yet.'
                      : `You don't have any ${filterType} notifications.`}
                  </p>
                </div>
              ) : (
                <div>
                  {Object.entries(groupedNotifications).map(([date, notifications]) => (
                    <div key={date}>
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{date}</h3>
                      </div>
                      <ul>
                        {notifications.map(notification => (
                          <li key={notification.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                            <div className="flex items-center justify-between py-2 px-4">
                              <div className="flex-1">
                                <Notification 
                                  notification={notification} 
                                  onClick={() => {
                                    if (!notification.is_read) {
                                      markAsRead(notification.id);
                                    }
                                    // Handle navigation based on notification type
                                    if (notification.notification_type === 'formula' && notification.reference_id) {
                                      // Navigate to formula detail
                                      // history.push(`/formulas/${notification.reference_id}`);
                                    }
                                  }}
                                />
                              </div>
                              <div className="ml-4 flex">
                                <button
                                  onClick={() => handleDelete(notification.id)}
                                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                  title="Delete notification"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Notification preferences link */}
            <div className="mt-8 text-center">
              <Link 
                to="/settings/notifications" 
                className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
              >
                Manage notification preferences
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NotificationsPage;