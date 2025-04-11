// frontend/src/context/UserProfileContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userProfileAPI } from '../services/api';

// Initial state for the user profile context
const initialState = {
  userProfile: null,
  isLoading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const userProfileReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
        isLoading: false,
        error: null
      };
    
    case actionTypes.UPDATE_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload
        },
        isLoading: false,
        error: null
      };
    
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
};

// Create context
const UserProfileContext = createContext();

// Context provider component
export const UserProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userProfileReducer, initialState);
  
  // Load user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      try {
        const response = await userProfileAPI.getUserProfile();
        dispatch({ 
          type: actionTypes.SET_USER_PROFILE, 
          payload: response.data 
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        dispatch({ 
          type: actionTypes.SET_ERROR, 
          payload: error.message || 'Failed to fetch user profile' 
        });
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Update user profile
  const updateUserProfile = async (profileData) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    
    try {
      const response = await userAPI.updateUserProfile(profileData);
      dispatch({ 
        type: actionTypes.UPDATE_USER_PROFILE, 
        payload: response.data 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: error.message || 'Failed to update user profile' 
      });
      throw error;
    }
  };
  
  // Provide value to consumers
  const contextValue = {
    userProfile: state.userProfile,
    isLoading: state.isLoading,
    error: state.error,
    updateUserProfile
  };
  
  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook for using user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export default UserProfileContext;