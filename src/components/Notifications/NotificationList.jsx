// src/components/Notifications/NotificationList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Notification from './Notification';
import { useNotifications } from '../../context/NotificationContext';

function NotificationList({ onClose }) {
  const { notifications, loading, error, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification) => {
    // Handle notification click - could navigate to related content
    onClose();
  };

  if (loading) {
    return (
      <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-500"></div>
        </div>
        <p className="mt-2">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 px-4 text-center text-red-500 dark:text-red-400">
        <p>Failed to load notifications. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span>Notifications</span>
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 normal-case"
          >
            Mark all as read
          </button>
        )}
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <li key={notification.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              <Notification 
                notification={notification} 
                onClick={() => handleNotificationClick(notification)} 
              />
            </li>
          ))
        ) : (
          <li className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </li>
        )}
      </ul>
      <div className="text-center border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <Link to="/notifications" className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" onClick={onClose}>
          View all notifications
        </Link>
      </div>
    </div>
  );
}

export default NotificationList;