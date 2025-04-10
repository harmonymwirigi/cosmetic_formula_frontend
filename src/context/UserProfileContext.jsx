import React, { createContext, useContext, useState, useEffect } from 'react';
import { userProfileAPI } from '../services/api';

// Create context
const UserProfileContext = createContext();

/**
 * UserProfileProvider component
 * 
 * Manages user profile data and provides methods to update it
 */
export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await userProfileAPI.getUserProfile();
        
        if (response.data) {
          // Parse JSON fields if they're stored as strings
          const processedProfile = processProfileData(response.data);
          setUserProfile(processedProfile);
        } else {
          // Create an empty profile if none exists
          setUserProfile({
            skin_type: '',
            skin_concerns: [],
            sensitivities: [],
            climate: '',
            hair_type: '',
            hair_concerns: [],
            
            // Personal Info & Environment
            age: null,
            gender: '',
            is_pregnant: false,
            fitzpatrick_type: null,
            
            // Skin Characteristics
            breakout_frequency: '',
            skin_texture: [],
            skin_redness: '',
            end_of_day_skin_feel: '',
            
            // Skin Goals & Preferences
            preferred_textures: [],
            preferred_routine_length: '',
            preferred_product_types: [],
            lifestyle_factors: [],
            ingredients_to_avoid: '',
            
            // Professional Fields
            brand_name: '',
            development_stage: '',
            product_category: '',
            target_demographic: '',
            sales_channels: [],
            target_texture: '',
            performance_goals: [],
            desired_certifications: [],
            regulatory_requirements: '',
            restricted_ingredients: '',
            preferred_actives: '',
            production_scale: '',
            price_positioning: '',
            competitor_brands: '',
            brand_voice: '',
            product_inspirations: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Process profile data (parse JSON strings)
  const processProfileData = (profileData) => {
    const processedData = { ...profileData };
    
    // Fields that might be stored as JSON strings
    const jsonFields = [
      'skin_concerns', 'sensitivities', 'hair_concerns',
      'skin_texture', 'preferred_textures', 'preferred_product_types',
      'lifestyle_factors', 'sales_channels', 'performance_goals', 
      'desired_certifications'
    ];
    
    // Parse JSON fields if they're strings
    jsonFields.forEach(field => {
      if (typeof processedData[field] === 'string') {
        try {
          processedData[field] = JSON.parse(processedData[field]);
        } catch (e) {
          processedData[field] = [];
        }
      } else if (processedData[field] === null) {
        processedData[field] = [];
      }
    });
    
    return processedData;
  };

  // Update the user profile
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for API - stringify arrays for storage
      const dataToSend = { ...profileData };
      
      // Fields that need to be sent as JSON strings
      const jsonFields = [
        'skin_concerns', 'sensitivities', 'hair_concerns',
        'skin_texture', 'preferred_textures', 'preferred_product_types',
        'lifestyle_factors', 'sales_channels', 'performance_goals', 
        'desired_certifications'
      ];
      
      // Convert arrays to JSON strings
      jsonFields.forEach(field => {
        if (Array.isArray(dataToSend[field])) {
          dataToSend[field] = JSON.stringify(dataToSend[field]);
        }
      });
      
      // Send update to API
      const response = await userProfileAPI.updateUserProfile(dataToSend);
      
      if (response.data) {
        // Update local state with processed data
        const processedData = processProfileData(response.data);
        setUserProfile(processedData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Value to provide to context consumers
  const value = {
    userProfile,
    loading,
    error,
    updateUserProfile
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook for using the user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export default UserProfileContext;