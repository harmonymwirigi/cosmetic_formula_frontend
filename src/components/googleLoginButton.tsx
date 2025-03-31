import React from 'react';

const GoogleLoginButton: React.FC = () => {
  const handleGoogleSignIn = () => {
    // Get the base URL from environment variables
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    
    // Redirect to backend Google OAuth endpoint
    // Include a redirect_uri to specify where to go after successful authentication
    const redirectUri = encodeURIComponent(window.location.origin + '/oauth/callback');
    
    window.location.href = `${API_BASE_URL.replace('/api', '')}/api/auth/google/login?redirect_uri=${redirectUri}`;
  };

  return (
    <button 
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      <svg 
        className="w-5 h-5 mr-2" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.36-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
          fill="#4285F4"
        />
        <path 
          d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.2 7.74 23 12 23z" 
          fill="#34A853"
        />
        <path 
          d="M5.84 14.11c-.25-.69-.38-1.43-.38-2.19s.14-1.5.38-2.19V6.89H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 5.11l2.66-2z" 
          fill="#FBBC05"
        />
        <path 
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.74 1 4 3.8 2.18 6.89l2.66 2z" 
          fill="#EA4335"
        />
      </svg>
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;