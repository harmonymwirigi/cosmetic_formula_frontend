// src/components/Profile/UserProfileForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Add this import to your API service file
import { userProfileAPI } from '../../services/api'; // Adjust the path as necessary

const UserProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    skin_type: '',
    skin_concerns: [],
    sensitivities: [],
    climate: '',
    hair_type: '',
    hair_concerns: []
  });

  // Dropdown options
  const skinTypes = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];
  const skinConcernOptions = [
    'Dryness', 'Aging', 'Acne', 'Redness', 'Hyperpigmentation',
    'Dullness', 'Uneven Texture', 'Sensitivity', 'Large Pores'
  ];
  const sensitivityOptions = [
    'Fragrance', 'Essential Oils', 'Alcohol', 'Silicones', 'Sulfates',
    'Parabens', 'Lanolin', 'Nuts', 'Gluten', 'Specific Plant Extracts'
  ];
  const climateOptions = ['Tropical', 'Dry', 'Temperate', 'Continental', 'Polar'];
  const hairTypes = ['Straight', 'Wavy', 'Curly', 'Coily', 'Fine', 'Medium', 'Thick'];
  const hairConcernOptions = [
    'Dryness', 'Damage', 'Frizz', 'Hair Loss', 'Dandruff',
    'Oily Scalp', 'Split Ends', 'Lack of Volume', 'Color Protection'
  ];

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userProfileAPI.getUserProfile();
        if (response && response.data) {
          setProfile({
            skin_type: response.data.skin_type || '',
            skin_concerns: response.data.skin_concerns || [],
            sensitivities: response.data.sensitivities || [],
            climate: response.data.climate || '',
            hair_type: response.data.hair_type || '',
            hair_concerns: response.data.hair_concerns || []
          });
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  // Handle multiple select changes
  const handleMultipleSelect = (name, value) => {
    const current = [...profile[name]];
    
    if (current.includes(value)) {
      // Remove if already selected
      setProfile({
        ...profile,
        [name]: current.filter(item => item !== value)
      });
    } else {
      // Add if not selected
      setProfile({
        ...profile,
        [name]: [...current, value]
      });
    }
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await userProfileAPI.updateUserProfile(profile);
      
      if (response && response.data) {
        toast.success('Profile saved successfully');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save your profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Formulation Profile</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update your skin and hair details to get personalized formula recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skin Profile Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Skin Profile</h3>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>
          </div>
          
          {/* Skin Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skin Type
            </label>
            <select
              name="skin_type"
              value={profile.skin_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Skin Type</option>
              {skinTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Climate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Climate
            </label>
            <select
              name="climate"
              value={profile.climate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Climate</option>
              {climateOptions.map(climate => (
                <option key={climate} value={climate}>{climate}</option>
              ))}
            </select>
          </div>
          
          {/* Skin Concerns */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skin Concerns
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skinConcernOptions.map(concern => (
                <div key={concern} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`skin-concern-${concern}`}
                    checked={profile.skin_concerns.includes(concern)}
                    onChange={() => handleMultipleSelect('skin_concerns', concern)}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label 
                    htmlFor={`skin-concern-${concern}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {concern}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sensitivities */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sensitivities/Allergies
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sensitivityOptions.map(sensitivity => (
                <div key={sensitivity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`sensitivity-${sensitivity}`}
                    checked={profile.sensitivities.includes(sensitivity)}
                    onChange={() => handleMultipleSelect('sensitivities', sensitivity)}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label 
                    htmlFor={`sensitivity-${sensitivity}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {sensitivity}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hair Profile Section */}
          <div className="col-span-1 md:col-span-2 mt-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Hair Profile</h3>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>
          </div>
          
          {/* Hair Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hair Type
            </label>
            <select
              name="hair_type"
              value={profile.hair_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Hair Type</option>
              {hairTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Hair Concerns */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hair Concerns
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hairConcernOptions.map(concern => (
                <div key={concern} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`hair-concern-${concern}`}
                    checked={profile.hair_concerns.includes(concern)}
                    onChange={() => handleMultipleSelect('hair_concerns', concern)}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label 
                    htmlFor={`hair-concern-${concern}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {concern}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;