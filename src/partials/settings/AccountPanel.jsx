// frontend/src/partials/settings/AccountPanel.jsx
import React, { useState, useEffect } from 'react';
import { userProfileAPI } from '../../services/api';
import { toast } from 'react-toastify';

function AccountPanel({ userData }) {
  const [formData, setFormData] = useState({
    firstName: userData?.first_name || '',
    lastName: userData?.last_name || '',
    email: userData?.email || '',
    companyName: '',
    jobTitle: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // User profile data
  const [profileData, setProfileData] = useState({
    skin_type: '',
    skin_concerns: [],
    sensitivities: [],
    climate: '',
    hair_type: '',
    hair_concerns: []
  });
  
  // Brand owner specific fields (only shown to premium/professional users)
  const [brandData, setBrandData] = useState({
    brand_name: '',
    target_audience: '',
    target_markets: [],
    brand_positioning: '',
    price_point: '',
    competitors: '',
    brand_voice: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Options for dropdown/checkboxes
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
  const marketOptions = [
    'United States', 'European Union', 'United Kingdom', 'Japan', 
    'South Korea', 'Canada', 'Australia', 'Global'
  ];
  const brandVoiceOptions = [
    'Clinical/Scientific', 'Luxury/Premium', 'Natural/Earthy', 
    'Playful/Fun', 'Minimalist', 'Trendy/Gen Z'
  ];
  const pricePointOptions = [
    'Budget', 'Mid-range', 'Premium', 'Luxury', 'Ultra-luxury'
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userProfileAPI.getUserProfile();
        if (response && response.data) {
          setProfileData({
            skin_type: response.data.skin_type || '',
            skin_concerns: response.data.skin_concerns || [],
            sensitivities: response.data.sensitivities || [],
            climate: response.data.climate || '',
            hair_type: response.data.hair_type || '',
            hair_concerns: response.data.hair_concerns || []
          });
          
          // Set brand data if available
          if (response.data.brand_info) {
            setBrandData({
              brand_name: response.data.brand_info.brand_name || '',
              target_audience: response.data.brand_info.target_audience || '',
              target_markets: response.data.brand_info.target_markets || [],
              brand_positioning: response.data.brand_info.brand_positioning || '',
              price_point: response.data.brand_info.price_point || '',
              competitors: response.data.brand_info.competitors || '',
              brand_voice: response.data.brand_info.brand_voice || ''
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBrandInputChange = (e) => {
    const { name, value } = e.target;
    setBrandData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle multiple select changes for checkboxes
  const handleMultipleSelect = (name, value) => {
    const current = [...profileData[name]];
    
    if (current.includes(value)) {
      // Remove if already selected
      setProfileData({
        ...profileData,
        [name]: current.filter(item => item !== value)
      });
    } else {
      // Add if not selected
      setProfileData({
        ...profileData,
        [name]: [...current, value]
      });
    }
  };
  
  // Handle multiple select for brand data
  const handleBrandMultipleSelect = (name, value) => {
    const current = [...brandData[name]];
    
    if (current.includes(value)) {
      // Remove if already selected
      setBrandData({
        ...brandData,
        [name]: current.filter(item => item !== value)
      });
    } else {
      // Add if not selected
      setBrandData({
        ...brandData,
        [name]: [...current, value]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real implementation, you would call an API to update the user data
      // await userAPI.updateProfile(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    setSavingProfile(true);
    setError(null);
    
    try {
      // Get brand data if user is premium/professional
      const dataToSubmit = { ...profileData };
      
      if (userData?.subscription_type === 'premium' || userData?.subscription_type === 'professional') {
        dataToSubmit.brand_info = brandData;
      }
      
      const response = await userProfileAPI.updateUserProfile(dataToSubmit);
      
      if (response && response.data) {
        toast.success('Profile saved successfully');
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save your profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Helper function to render tab buttons
  const renderTab = (id, label, icon) => (
    <button
      className={`px-4 py-2 flex items-center text-sm font-medium ${
        activeTab === id 
          ? 'text-violet-600 border-b-2 border-violet-600 dark:text-violet-400 dark:border-violet-400' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="grow p-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex overflow-x-auto">
          {renderTab('personal', 'Personal Information', 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          )}
          {renderTab('profile', 'Formulation Profile', 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          )}
          {(userData?.subscription_type === 'premium' || userData?.subscription_type === 'professional') && 
            renderTab('brand', 'Brand Information', 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            )
          }
          {renderTab('account', 'Account Security', 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}
      
      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Personal Information</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Update your personal information and contact details
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="first-name">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="last-name">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="company-name">
                    Company Name (Optional)
                  </label>
                  <input
                    id="company-name"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="job-title">
                    Job Title (Optional)
                  </label>
                  <input
                    id="job-title"
                    name="jobTitle"
                    type="text"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      
      {/* Formulation Profile Tab */}
      {activeTab === 'profile' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Formulation Profile</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Your skin and hair profile for personalized formulations
              </p>
            </div>
            <div>
              {isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-5 bg-gray-50 dark:bg-gray-750 rounded-lg">
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
                {isEditingProfile ? (
                  <select
                    name="skin_type"
                    value={profileData.skin_type}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Skin Type</option>
                    {skinTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {profileData.skin_type || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Climate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Climate
                </label>
                {isEditingProfile ? (
                  <select
                    name="climate"
                    value={profileData.climate}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Climate</option>
                    {climateOptions.map(climate => (
                      <option key={climate} value={climate}>{climate}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {profileData.climate || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Skin Concerns */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skin Concerns
                </label>
                {isEditingProfile ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {skinConcernOptions.map(concern => (
                      <div key={concern} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`skin-concern-${concern}`}
                          checked={profileData.skin_concerns.includes(concern)}
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
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skin_concerns && profileData.skin_concerns.length > 0 ? (
                      profileData.skin_concerns.map(concern => (
                        <span 
                          key={concern}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                        >
                          {concern}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">None specified</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sensitivities */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sensitivities/Allergies
                </label>
                {isEditingProfile ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {sensitivityOptions.map(sensitivity => (
                      <div key={sensitivity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`sensitivity-${sensitivity}`}
                          checked={profileData.sensitivities.includes(sensitivity)}
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
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.sensitivities && profileData.sensitivities.length > 0 ? (
                      profileData.sensitivities.map(sensitivity => (
                        <span 
                          key={sensitivity}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        >
                          {sensitivity}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">None specified</p>
                    )}
                  </div>
                )}
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
                {isEditingProfile ? (
                  <select
                    name="hair_type"
                    value={profileData.hair_type}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Hair Type</option>
                    {hairTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {profileData.hair_type || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Hair Concerns */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hair Concerns
                </label>
                {isEditingProfile ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {hairConcernOptions.map(concern => (
                      <div key={concern} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`hair-concern-${concern}`}
                          checked={profileData.hair_concerns.includes(concern)}
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
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.hair_concerns && profileData.hair_concerns.length > 0 ? (
                      profileData.hair_concerns.map(concern => (
                        <span 
                          key={concern}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {concern}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">None specified</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Save Button */}
            {isEditingProfile && (
              <div className="col-span-1 md:col-span-2 mt-6">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Profile...
                    </>
                  ) : (
                    'Save Formulation Profile'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
      
      {/* Brand Information Tab - Only shown for Premium/Professional users */}
      {activeTab === 'brand' && (userData?.subscription_type === 'premium' || userData?.subscription_type === 'professional') && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Brand Information</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Your brand details for professional-grade formulations
              </p>
            </div>
            <div>
              {isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium"
                >
                  Edit Brand Info
                </button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand Name
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="brand_name"
                    value={brandData.brand_name}
                    onChange={handleBrandInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your brand name"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {brandData.brand_name || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Audience
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="target_audience"
                    value={brandData.target_audience}
                    onChange={handleBrandInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="E.g., Women 25-40, sensitive skin"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {brandData.target_audience || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Price Point */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Point
                </label>
                {isEditingProfile ? (
                  <select
                    name="price_point"
                    value={brandData.price_point}
                    onChange={handleBrandInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Price Point</option>
                    {pricePointOptions.map(point => (
                      <option key={point} value={point}>{point}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {brandData.price_point || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Brand Voice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand Voice/Tone
                </label>
                {isEditingProfile ? (
                  <select
                    name="brand_voice"
                    value={brandData.brand_voice}
                    onChange={handleBrandInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Brand Voice</option>
                    {brandVoiceOptions.map(voice => (
                      <option key={voice} value={voice}>{voice}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {brandData.brand_voice || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Competitors */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Competitor Brands
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="competitors"
                    value={brandData.competitors}
                    onChange={handleBrandInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="E.g., Brand A, Brand B, Brand C"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {brandData.competitors || "Not specified"}
                  </p>
                )}
              </div>
              
              {/* Target Markets */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Markets
                </label>
                {isEditingProfile ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {marketOptions.map(market => (
                      <div key={market} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`market-${market}`}
                          checked={brandData.target_markets.includes(market)}
                          onChange={() => handleBrandMultipleSelect('target_markets', market)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label 
                          htmlFor={`market-${market}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {market}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {brandData.target_markets && brandData.target_markets.length > 0 ? (
                      brandData.target_markets.map(market => (
                        <span 
                          key={market}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {market}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">None specified</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Brand Positioning */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand Positioning / Vision
                </label>
                {isEditingProfile ? (
                  <textarea
                    name="brand_positioning"
                    value={brandData.brand_positioning}
                    onChange={handleBrandInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Describe your brand positioning, vision, or formulation approach"
                  ></textarea>
                ) : (
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {brandData.brand_positioning || "Not specified"}
                  </p>
                )}
              </div>
            </div>
            
            {/* Save Button */}
            {isEditingProfile && (
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Brand Info...
                    </>
                  ) : (
                    'Save Brand Information'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
      
      {/* Account Security Tab */}
      {activeTab === 'account' && (
        <div>
          {isEditing && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="current-password">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="new-password">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirm-password">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Account</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Delete Account</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete your account and all your data
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                    Delete Account
                  </button>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Export Your Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Download a copy of all your formulations and account data
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-750">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPanel;