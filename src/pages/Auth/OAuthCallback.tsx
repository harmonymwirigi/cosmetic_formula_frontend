// frontend/src/pages/Auth/OAuthCallback.tsx
import React, { useEffect, useState, ReactElement } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const OAuthCallback: React.FC = (): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login instead of updateUser
  const [searchParams] = useSearchParams();
  
  // Get the API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString().substr(11, 8)}: ${message}`]);
  };
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        addLog("OAuth callback triggered");
        
        // Check for error parameter
        const errorParam = searchParams.get('error');
        if (errorParam) {
          addLog(`OAuth error from URL: ${errorParam}`);
          setError(decodeURIComponent(errorParam));
          setIsLoading(false);
          return;
        }
        
        // Get token and user ID from URL params
        const token = searchParams.get('token');
        const userId = searchParams.get('user_id');
        
        addLog(`Token present: ${!!token}`);
        addLog(`User ID present: ${!!userId}`);
        
        if (!token || !userId) {
          addLog("Missing token or user ID");
          setError('Authentication failed. Missing token or user ID.');
          setIsLoading(false);
          return;
        }
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        addLog("Token stored in localStorage");
        
        // Fetch user data with the token - only once
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const userData = response.data;
          addLog(`User data fetched successfully: ${JSON.stringify(userData)}`);
          const needsPhoneVerification = searchParams.get('needs_phone_verification') === 'True';
          // Use login instead of updateUser
          login(userData, token);
          
          if (needsPhoneVerification) {
            addLog('User needs phone verification, redirecting');
            navigate('/verify-phone');
            return;
          }
          // Check if a plan was selected before authentication
          const selectedPlan = localStorage.getItem('selectedPlan');
          
          // Decide where to navigate
          setTimeout(() => {
            if (selectedPlan && selectedPlan !== 'free') {
              addLog(`Found selected plan: ${selectedPlan}, redirecting to subscription`);
              navigate(`/subscribe?plan=${selectedPlan}`);
            } else if (userData.needs_subscription) {
              addLog('User needs subscription, navigating to plan selection');
              navigate('/');
            } else {
              addLog('User has subscription, navigating to dashboard');
              navigate('/');
            }
          }, 300);
        } catch (apiError: any) {
          // ...error handling...
        }
      } catch (err: any) {
        addLog(`Unexpected error in OAuth callback: ${err.message}`);
        setError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    };
    
    handleCallback();
  }, [location, navigate, login, searchParams, API_BASE_URL]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Completing authentication...</p>
          <p className="mt-2 text-sm text-gray-500">You'll be redirected automatically in a moment.</p>
        </div>
        
        <div className="mt-8 max-w-lg w-full bg-gray-50 p-4 rounded-md text-xs font-mono overflow-auto max-h-96">
          <h3 className="font-semibold mb-2">Debug logs:</h3>
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap break-all">
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
          <div className="text-center">
            <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Authentication Error</h2>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 max-w-lg w-full bg-gray-50 p-4 rounded-md text-xs font-mono overflow-auto max-h-96">
          <h3 className="font-semibold mb-2">Debug logs:</h3>
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap break-all">
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Authentication successful!</p>
        <p className="mt-2 text-sm text-gray-500">Redirecting you now...</p>
      </div>
      
      <div className="mt-8 max-w-lg w-full bg-gray-50 p-4 rounded-md text-xs font-mono overflow-auto max-h-96">
        <h3 className="font-semibold mb-2">Debug logs:</h3>
        {logs.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OAuthCallback;