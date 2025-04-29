// src/components/Notifications/Notification.jsx
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../context/NotificationContext';

function Notification({ notification, onClick }) {
  const { markAsRead } = useNotifications();

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

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'system':
        return (
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        );
      case 'formula':
        return (
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        );
      case 'subscription':
        return (
          <div className="w-2 h-2 rounded-full bg-violet-500"></div>
        );
      default:
        return (
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
        );
    }
  };

  return (
    <div 
      className={`block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer ${notification.is_read ? '' : 'bg-violet-50 dark:bg-violet-900/20'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {/* Colored dot for notification type */}
        <div className="relative mr-2">
          {getNotificationIcon(notification.notification_type)}
        </div>

        {/* Notification content */}
        <div className="grow">
          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{notification.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{notification.message}</div>
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {formatNotificationTime(notification.created_at)}
          </div>
        </div>
        
        {/* Mark as read button */}
        {!notification.is_read && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            className="ml-2 text-xs text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Notification;