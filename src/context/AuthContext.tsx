// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  subscription_type?: string;
  needs_subscription?: boolean;
  subscription_ends_at?: string;
  is_active: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: any, token: string) => void;
  register: (userData: UserCreate) => Promise<any>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authCheckInProgress = useRef(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckInProgress.current) {
        console.log("Auth check already in progress, skipping");
        return;
      }
      
      authCheckInProgress.current = true;
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        const savedUserString = localStorage.getItem('user');
        
        if (!token) {
          // No token = not authenticated
          console.log("No token found, user is not authenticated");
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          authCheckInProgress.current = false;
          return;
        }
        
        // Set initial state from localStorage if available
        if (savedUserString) {
          try {
            const savedUser = JSON.parse(savedUserString);
            setUser(savedUser);
            setIsAuthenticated(true);
            console.log("Restored user from localStorage:", savedUser);
          } catch (parseError) {
            console.error('Error parsing saved user data:', parseError);
            localStorage.removeItem('user'); // Remove corrupted data
          }
        }
        
        // Then validate token with server
        console.log("Validating token with server...");
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          console.log("Token validation successful, user data:", response.data);
          setUser(response.data);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(response.data));
        } else {
          console.warn("Token validation returned no data");
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error('Auth check error:', error?.response?.status, error?.message);
        
        // Clear auth state on 401 Unauthorized or other critical errors
        if (error?.response?.status === 401) {
          console.log("Token invalid, clearing auth state");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
        authCheckInProgress.current = false;
      }
    };
    
    checkAuth();
  }, [API_BASE_URL]); // Only re-run when API_BASE_URL changes
  
  // Login function
   const login = (userData: any, token: string) => {
    console.log("Login called with user:", userData?.id || userData?.email || "unknown");
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  // Register function
  const register = async (userData: UserCreate) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      // Handle case where we might not have a user yet
      setUser(userData as User);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;