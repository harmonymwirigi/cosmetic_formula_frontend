// src/components/Notifications/ToastContainer.jsx
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ToastNotification from './ToastNotification';

// Create context for toast notifications
const ToastContext = createContext();

// Generate unique IDs for toasts
let toastCounter = 0;
const generateId = () => `toast-${toastCounter++}`;

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast notification
  const addToast = useCallback(({ type, title, message, duration = 5000 }) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  // Remove a toast notification
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods for different toast types
  const showSuccess = useCallback((props) => 
    addToast({ type: 'success', ...props }), [addToast]);
  
  const showError = useCallback((props) => 
    addToast({ type: 'error', ...props }), [addToast]);
  
  const showWarning = useCallback((props) => 
    addToast({ type: 'warning', ...props }), [addToast]);
  
  const showInfo = useCallback((props) => 
    addToast({ type: 'info', ...props }), [addToast]);

  // Context value
  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed bottom-0 right-0 p-4 space-y-3 z-50 max-w-md w-full">
          {toasts.map(toast => (
            <ToastNotification
              key={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

// Hook to use toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;