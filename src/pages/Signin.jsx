// Signin.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';

import AuthImage from "../images/auth-image.jpg";

function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGoogleSignIn = () => {
    // Get the base URL from environment variables
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cosmetic-formula-git-main-beautycraft.vercel.app/';
    
    // Redirect to backend Google OAuth endpoint
    // Include a redirect_uri to specify where to go after successful authentication
    const redirectUri = encodeURIComponent(window.location.origin + '/oauth/callback');
    
    window.location.href = `${API_BASE_URL.replace('/api', '')}/api/auth/google/login?redirect_uri=${redirectUri}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember_me: formData.remember_me
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store the token in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (err) {
      // Handle login error
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block" to="/">
                  <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
                    <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">Welcome back!</h1>
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email Address
                    </label>
                    <input 
                      id="email" 
                      className="form-input w-full" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      Password
                    </label>
                    <input 
                      id="password" 
                      className="form-input w-full" 
                      type="password" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="mr-1">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="remember_me" 
                          className="form-checkbox" 
                          checked={formData.remember_me}
                          onChange={handleChange}
                        />
                        <span className="text-sm ml-2">Remember me</span>
                      </label>
                    </div>
                    <Link 
                      className="text-sm underline hover:no-underline" 
                      to="/reset-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col space-y-4 mt-6">
                  <button 
                    type="submit" 
                    className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                  
                  {/* Google Sign In Button */}
                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="btn bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 w-full flex items-center justify-center"
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
                    Sign In with Google
                  </button>
                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-gray-100 dark:border-gray-700/60">
                <div className="text-sm">
                  Don't you have an account?{" "}
                  <Link 
                    className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" 
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </div>
                {/* Warning */}
                <div className="mt-5">
                  <div className="bg-yellow-500/20 text-yellow-700 px-3 py-2 rounded-sm">
                    <svg className="inline w-3 h-3 shrink-0 fill-current mr-2" viewBox="0 0 12 12">
                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                    </svg>
                    <span className="text-sm">To support you during the pandemic super pro features are free until March 31st.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={AuthImage} width="760" height="1024" alt="Authentication" />
        </div>
      </div>
    </main>
  );
}

export default Signin;