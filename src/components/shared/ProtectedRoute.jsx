import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

/**
 * ProtectedRoute component that restricts access to authenticated users only
 * Redirects to login if not authenticated
 * Can also check for specific subscription types if required
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Array} props.allowedSubscriptions - Optional array of subscription types allowed to access this route
 */
const ProtectedRoute = ({ children, allowedSubscriptions = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token validity by fetching current user
        const response = await authAPI.getCurrentUser();
        setUserData(response.data);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If specific subscription types are required, check if user has permission
  if (allowedSubscriptions.length > 0 && userData) {
    const hasPermission = allowedSubscriptions.includes(userData.subscription_type);
    
    if (!hasPermission) {
      // Redirect to subscription page or show an upgrade prompt
      return <Navigate to="/subscription" state={{ from: location }} replace />;
    }
  }

  // If authenticated and has required permissions, render the protected content
  return children;
};

export default ProtectedRoute;