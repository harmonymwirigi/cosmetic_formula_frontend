// src/components/Notifications/ToastNotification.jsx
import React, { useState, useEffect } from 'react';

function ToastNotification({ type = 'info', title, message, duration = 5000, onClose }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  // Set up auto-dismissal
  useEffect(() => {
    if (!duration) return;
    
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Allow time for animation
    }, duration);
    
    // Progress bar animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsedTime / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 16);
    
    return () => {
      clearTimeout(dismissTimer);
      clearInterval(interval);
    };
  }, [duration, onClose]);
  
  // Get icon and colors based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          iconColor: 'text-green-500',
          progressColor: 'bg-green-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'warning':
        return {
          bgColor: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
          iconColor: 'text-amber-500',
          progressColor: 'bg-amber-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          iconColor: 'text-red-500',
          progressColor: 'bg-red-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      default: // info
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-500',
          progressColor: 'bg-blue-500',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };
  
  const { bgColor, iconColor, progressColor, icon } = getTypeStyles();
  
  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };
  
  return (
    <div 
      className={`transform transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className={`max-w-md w-full border rounded-lg shadow-sm ${bgColor}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className={`shrink-0 ${iconColor}`}>
              {icon}
            </div>
            <div className="ml-3 w-0 flex-1">
              {title && <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">{title}</h3>}
              {message && <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</div>}
            </div>
            <div className="ml-4 shrink-0 flex">
              <button
                className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                onClick={handleDismiss}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
            <div 
              className={`h-full ${progressColor} transition-all duration-200 ease-linear`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToastNotification;