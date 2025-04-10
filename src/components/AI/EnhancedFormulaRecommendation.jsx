// src/components/AI/EnhancedFormulaRequest.jsx
import React, { useState, useEffect } from 'react';
import { useFormula } from '../../context/FormulaContext';
import { userProfileAPI, userAPI } from '../../services/api';
import { toast } from 'react-toastify';

/**
 * EnhancedFormulaRequest component provides subscription-tiered
 * AI-powered recommendations for cosmetic formulations using stored user profiles.
 */
const EnhancedFormulaRequest = () => {
  const {
    availableIngredients,
    generateAIFormula,
    isLoading,
    errors,
    setWizardStep
  } = useFormula();

  // User data and subscription
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  // Component state
  const [productType, setProductType] = useState('');
  const [formulaName, setFormulaName] = useState('');
  const [preferredIngredients, setPreferredIngredients] = useState([]);
  const [avoidedIngredients, setAvoidedIngredients] = useState([]);
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [selectorMode, setSelectorMode] = useState('preferred');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Product types
  const productTypes = [
    { id: 'serum', name: 'Serum' },
    { id: 'moisturizer', name: 'Moisturizer' },
    { id: 'cleanser', name: 'Cleanser' },
    { id: 'toner', name: 'Toner' },
    { id: 'mask', name: 'Face Mask' },
    { id: 'essence', name: 'Essence' }
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUserData(true);
        
        // Fetch user status (subscription)
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch user profile
        const profileResponse = await userProfileAPI.getUserProfile();
        if (profileResponse && profileResponse.data) {
          setUserProfile(profileResponse.data);
          
          // Check if profile is complete enough to generate formulas
          const profile = profileResponse.data;
          const hasMinimumProfileData = profile.skin_type && profile.skin_concerns && profile.skin_concerns.length > 0;
          setProfileComplete(hasMinimumProfileData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoadingUserData(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Open ingredient selector modal
  const openIngredientSelector = (mode) => {
    setSelectorMode(mode);
    setShowIngredientSelector(true);
    setIngredientSearch('');
  };

  // Handle ingredient selection
  const handleIngredientSelection = (ingredientId) => {
    if (selectorMode === 'preferred') {
      if (preferredIngredients.includes(ingredientId)) {
        setPreferredIngredients(preferredIngredients.filter(id => id !== ingredientId));
      } else {
        // Remove from avoided if it's there
        if (avoidedIngredients.includes(ingredientId)) {
          setAvoidedIngredients(avoidedIngredients.filter(id => id !== ingredientId));
        }
        setPreferredIngredients([...preferredIngredients, ingredientId]);
      }
    } else {
      if (avoidedIngredients.includes(ingredientId)) {
        setAvoidedIngredients(avoidedIngredients.filter(id => id !== ingredientId));
      } else {
        // Remove from preferred if it's there
        if (preferredIngredients.includes(ingredientId)) {
          setPreferredIngredients(preferredIngredients.filter(id => id !== ingredientId));
        }
        setAvoidedIngredients([...avoidedIngredients, ingredientId]);
      }
    }
  };

  // Filter ingredients for the selector
  const filteredIngredients = availableIngredients.filter(ingredient => {
    return (
      ingredient.name.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
      ingredient.inci_name.toLowerCase().includes(ingredientSearch.toLowerCase())
    );
  });

  // Handle AI formula generation
  const handleGenerateFormula = async () => {
    if (!productType) {
      toast.error('Please select a product type');
      return;
    }

    if (!profileComplete) {
      toast.error('Please complete your skin/hair profile in account settings first');
      return;
    }

    // Build request - FIXED: Send data in the format expected by the backend
    const formulaRequest = {
      product_type: productType,
      formula_name: formulaName || `AI ${productType.charAt(0).toUpperCase() + productType.slice(1)}`,
      preferred_ingredients: preferredIngredients,
      avoided_ingredients: avoidedIngredients,
      // We don't need to send skin concerns specifically - they'll be retrieved from the user profile on the server
    };

    try {
      await generateAIFormula(formulaRequest);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to generate formula:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate formula');
    }
  };

  // Reset form and start over
  const handleReset = () => {
    setProductType('');
    setFormulaName('');
    setPreferredIngredients([]);
    setAvoidedIngredients([]);
    setShowResults(false);
  };

  // Show subscription upgrade prompt for free users
  if (userData && userData.subscription_type === 'free') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center">
          <svg 
            className="mx-auto h-16 w-16 text-violet-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
            Premium Feature
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI formula generation is available for Premium and Professional subscribers.
            Upgrade your subscription to access this feature.
          </p>
          <div className="mt-6">
            <a
              href="/subscription"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700"
            >
              Upgrade Subscription
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show profile completion prompt if profile is not complete
  if (!loadingUserData && !profileComplete) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center">
          <svg 
            className="mx-auto h-16 w-16 text-amber-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            To generate personalized formulas, please complete your skin/hair profile in your account settings first.
          </p>
          <div className="mt-6">
            <a
              href="/settings/account"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700"
            >
              Complete Profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loadingUserData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {userData && userData.subscription_type === 'professional'
            ? 'Professional AI Formula Development'
            : 'Premium AI Formula Recommendation'}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {userData && userData.subscription_type === 'professional'
            ? 'Create commercially-viable formulations with detailed manufacturing instructions'
            : 'Generate customized formulas based on your skin profile and preferences'}
        </p>
      </div>

      <div className="p-5">
        {userProfile && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-medium">Using your skin profile:</span> {userProfile.skin_type || 'Not specified'} skin type
                  {userProfile.skin_concerns && userProfile.skin_concerns.length > 0 && (
                    <span>, concerns: {userProfile.skin_concerns.join(', ')}</span>
                  )}
                  {userProfile.climate && (
                    <span>, {userProfile.climate} climate</span>
                  )}
                  <a 
                    href="/settings/account"
                    className="ml-2 font-medium underline hover:text-blue-600 dark:hover:text-blue-200"
                  >
                    Edit Profile
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {!showResults ? (
          <div className="space-y-6">
            {/* Formula Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Formula Name (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter a name for your formula"
                value={formulaName}
                onChange={(e) => setFormulaName(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                If left blank, a name will be generated automatically
              </p>
            </div>
            
            {/* Product Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Type<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {productTypes.map((type) => (
                  <div 
                    key={type.id}
                    className={`
                      border rounded-lg p-3 text-center cursor-pointer transition-colors
                      ${productType === type.id 
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800'
                      }
                    `}
                    onClick={() => setProductType(type.id)}
                  >
                    <span className="text-sm font-medium">{type.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Ingredients
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {preferredIngredients.length > 0 ? (
                  preferredIngredients.map((id) => {
                    const ingredient = availableIngredients.find(ing => ing.id === id);
                    return ingredient ? (
                      <span 
                        key={id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {ingredient.name}
                        <button
                          type="button"
                          className="ml-1 inline-flex text-green-500 dark:text-green-400 focus:outline-none"
                          onClick={() => handleIngredientSelection(id)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No preferred ingredients selected</span>
                )}
              </div>
              <button
                type="button"
                className="mt-1 inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
                onClick={() => openIngredientSelector('preferred')}
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Preferred Ingredients
              </button>
            </div>

            {/* Avoided Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avoided Ingredients
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {avoidedIngredients.length > 0 ? (
                  avoidedIngredients.map((id) => {
                    const ingredient = availableIngredients.find(ing => ing.id === id);
                    return ingredient ? (
                      <span 
                        key={id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      >
                        {ingredient.name}
                        <button
                          type="button"
                          className="ml-1 inline-flex text-red-500 dark:text-red-400 focus:outline-none"
                          onClick={() => handleIngredientSelection(id)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No avoided ingredients selected</span>
                )}
              </div>
              <button
                type="button"
                className="mt-1 inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
                onClick={() => openIngredientSelector('avoided')}
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
                Add Avoided Ingredients
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="button"
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  userData && userData.subscription_type === 'professional'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-violet-600 hover:bg-violet-700'
                } focus:outline-none ${
                  !productType ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleGenerateFormula}
                disabled={!productType || isLoading.aiRecommendation}
              >
                {isLoading.aiRecommendation ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Generate Formula
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className={`${
              userData && userData.subscription_type === 'professional'
                ? 'bg-amber-50 dark:bg-amber-900/20'
                : 'bg-green-50 dark:bg-green-900/20'
            } p-4 rounded-lg mb-4`}>
              <svg className={`mx-auto h-12 w-12 ${
                userData && userData.subscription_type === 'professional'
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-green-500 dark:text-green-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className={`mt-2 text-lg font-medium ${
                userData && userData.subscription_type === 'professional'
                  ? 'text-amber-800 dark:text-amber-200'
                  : 'text-green-800 dark:text-green-200'
              }`}>Formula Generated Successfully!</h3>
              <p className={`mt-1 text-sm ${
                userData && userData.subscription_type === 'professional'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {userData && userData.subscription_type === 'professional'
                  ? 'Your professional-grade formula has been created with detailed manufacturing instructions.'
                  : 'Your personalized formula has been created based on your preferences.'}
              </p>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You can now proceed to the next step to review and customize your formula.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650"
                onClick={handleReset}
              >
                Start Over
              </button>
              <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                userData && userData.subscription_type === 'professional'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-violet-600 hover:bg-violet-700'
              } focus:outline-none`}
              onClick={() => {
                // This will move to the next step in the wizard (ingredients)
                setWizardStep(2);
                // Scroll to the top
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Continue to Formula Details
            </button>
            </div>
          </div>
        )}

        {errors.aiRecommendation && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Generating Formula</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{errors.aiRecommendation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ingredient Selector Modal */}
      {showIngredientSelector && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      {selectorMode === 'preferred' ? 'Select Preferred Ingredients' : 'Select Ingredients to Avoid'}
                    </h3>
                    <div className="mt-4">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Search ingredients..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                      />
                    </div>
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredIngredients.map((ingredient) => {
                          const isSelected = selectorMode === 'preferred' 
                            ? preferredIngredients.includes(ingredient.id)
                            : avoidedIngredients.includes(ingredient.id);
                          
                          // Skip if ingredient is in the opposite list
                          const isInOppositeList = selectorMode === 'preferred'
                            ? avoidedIngredients.includes(ingredient.id)
                            : preferredIngredients.includes(ingredient.id);
                            
                          return (
                            <li 
                              key={ingredient.id} 
                              className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                                isSelected ? 
                                  (selectorMode === 'preferred' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20') : 
                                  ''
                              } ${
                                isInOppositeList ? 'opacity-50' : ''
                              }`}
                              onClick={() => handleIngredientSelection(ingredient.id)}
                              >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {ingredient.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {ingredient.inci_name}
                                  </p>
                                </div>
                                <div>
                                  {isSelected ? (
                                    <svg className={`h-5 w-5 ${
                                      selectorMode === 'preferred' ? 'text-green-500' : 'text-red-500'
                                    }`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                  ) : (
                                    isInOppositeList && (
                                      <span className="text-xs italic text-gray-500">
                                        {selectorMode === 'preferred' ? 'Avoided' : 'Preferred'}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                        {filteredIngredients.length === 0 && (
                          <li className="py-4 px-3 text-center text-gray-500 dark:text-gray-400">
                            No ingredients match your search
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowIngredientSelector(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFormulaRequest;