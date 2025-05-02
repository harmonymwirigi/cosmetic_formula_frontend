import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Subscription page redirect component
 * Redirects from /subscription to /settings/plans while preserving URL parameters
 */
function SubscriptionRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get any query parameters from the current URL
    const params = new URLSearchParams(location.search);
    const queryString = params.toString();

    // Show a toast notification about the redirect
    // Using a simpler toast without position since TOP_CENTER is undefined
    toast.info('Redirecting to plans page...', {
      autoClose: 2000
      // Remove the position property that's causing the error
    });

    // Redirect to the plans page with the same query parameters
    navigate(`/settings/plans${queryString ? '?' + queryString : ''}`, { replace: true });
  }, [navigate, location]);

  // Show a loading indicator while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to plans page...</p>
      </div>
    </div>
  );
}

export default SubscriptionRedirect;