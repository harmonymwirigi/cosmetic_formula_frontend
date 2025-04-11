// frontend/src/components/AI/EnhancedFormulaRecommendation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useFormula } from '../../context/FormulaContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { Link, useNavigate } from 'react-router-dom';
import { ingredientAPI } from '../../services/api';

/**
 * Enhanced Formula Recommendation Component
 * 
 * A streamlined component that checks if user profile is complete
 * and directs users to update their profile if needed.
 * 
 * @param {Object} props
 * @param {string} props.userType - User subscription level ('free', 'premium', 'professional')
 */
const EnhancedFormulaRecommendation = ({ userType = 'free' }) => {
  const { 
    currentFormula, 
    updateFormulaField, 
    isLoading, 
    errors, 
    generateAIFormula,
    setWizardStep 
  } = useFormula();
  
  const navigate = useNavigate();
  
  // Create a mock userProfile if useUserProfile is not available
  let userProfileContext;
  try {
    userProfileContext = useUserProfile();
  } catch (error) {
    console.warn('UserProfileContext not available. Using mock profile data instead.');
    userProfileContext = {
      userProfile: null,
      updateUserProfile: async (data) => {
        console.log('Mock updateUserProfile called with data:', data);
        return data;
      }
    };
  }
  
  const { userProfile, updateUserProfile } = userProfileContext;
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [generatedFormulaId, setGeneratedFormulaId] = useState(null);
  const previousProductTypeRef = useRef('');

  // Check if user profile has basic information needed for AI recommendations
  useEffect(() => {
    // Debug the current user profile
    console.log("User profile data:", userProfile);
    
    if (userProfile) {
      // Define required fields based on user type
      const requiredFields = ['skin_type', 'skin_concerns'];
      const professionalRequiredFields = ['brand_name', 'target_audience', 'brand_voice'];
      
      // Check if basic fields are filled
      const hasBasicInfo = requiredFields.every(field => 
        userProfile[field] && 
        (Array.isArray(userProfile[field]) ? userProfile[field].length > 0 : true)
      );
      
      // For professional users, check additional required fields
      const hasProInfo = userType !== 'professional' || professionalRequiredFields.every(field => {
        // Check if the field exists in brand_info (if brand_info exists)
        if (userProfile.brand_info) {
          return userProfile.brand_info[field];
        }
        return false;
      });
      
      // Set profile completeness status
      setIsProfileComplete(hasBasicInfo && hasProInfo);
      
      // If profile is not complete, log the reason for easier debugging
      if (!(hasBasicInfo && hasProInfo)) {
        console.warn(
          "Profile incomplete. Reason:", 
          !hasBasicInfo ? "Missing basic info" : "Missing professional info"
        );
      }
    } else {
      console.warn("No user profile data available");
      setIsProfileComplete(false);
    }
  }, [userProfile, userType]);
  
  // Product type options for selection
  const productTypeOptions = [
    { value: 'serum', label: 'Serum' },
    { value: 'moisturizer', label: 'Moisturizer' },
    { value: 'cleanser', label: 'Cleanser' },
    { value: 'toner', label: 'Toner' },
    { value: 'mask', label: 'Face Mask' },
    { value: 'essence', label: 'Essence' }
  ];

  // Update when selected product type changes - FIXED with useRef to prevent infinite updates
  useEffect(() => {
    if (selectedProductType && selectedProductType !== previousProductTypeRef.current) {
      // Set the product type in our formula
      updateFormulaField('type', selectedProductType.charAt(0).toUpperCase() + selectedProductType.slice(1));
      // Update the ref value
      previousProductTypeRef.current = selectedProductType;
    }
  }, [selectedProductType, updateFormulaField]);
  
  // Generate formula with AI
  const handleGenerateFormula = async () => {
    setError('');
    setSuccess('');
    setGeneratedFormulaId(null);
    
    if (!selectedProductType) {
      setError('Please select a product type');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Create a sanitized copy of the user profile with all JSON strings properly parsed
      const safeUserProfile = {};
      
      if (userProfile) {
        // Copy and sanitize each field
        Object.keys(userProfile).forEach(key => {
          // Skip null or undefined values
          if (userProfile[key] == null) return;
          
          // Parse JSON strings that should be arrays
          if (typeof userProfile[key] === 'string' && 
              (key === 'skin_concerns' || key === 'sensitivities' || 
               key === 'preferred_textures' || key === 'preferred_product_types' || 
               key === 'lifestyle_factors' || key === 'sales_channels' || 
               key === 'performance_goals' || key === 'desired_certifications' ||
               key === 'skin_texture')) {
            try {
              // Parse the JSON string into an actual array
              safeUserProfile[key] = JSON.parse(userProfile[key]);
            } catch (e) {
              console.warn(`Failed to parse ${key} as JSON, using empty array`, e);
              safeUserProfile[key] = [];
            }
          } 
          // Handle brand_info object specially
          else if (key === 'brand_info' && userProfile[key]) {
            const brandInfo = {...userProfile[key]};
            
            // Parse any JSON strings in brand_info
            ['target_markets', 'sales_channels', 'performance_goals', 'desired_certifications'].forEach(brandField => {
              if (typeof brandInfo[brandField] === 'string') {
                try {
                  brandInfo[brandField] = JSON.parse(brandInfo[brandField]);
                } catch (e) {
                  console.warn(`Failed to parse brand_info.${brandField} as JSON, using empty array`);
                  brandInfo[brandField] = [];
                }
              } else if (!Array.isArray(brandInfo[brandField])) {
                brandInfo[brandField] = [];
              }
            });
            
            safeUserProfile['brand_info'] = brandInfo;
          }
          // Handle arrays that are already arrays
          else if (Array.isArray(userProfile[key])) {
            safeUserProfile[key] = [...userProfile[key]];
          }
          // Copy other fields as is
          else {
            safeUserProfile[key] = userProfile[key];
          }
        });
      }
      
      // Ensure critical fields are always arrays even if not in userProfile
      const arrayFields = [
        'skin_concerns', 'sensitivities', 'preferred_textures', 
        'preferred_product_types', 'lifestyle_factors', 'sales_channels',
        'performance_goals', 'desired_certifications', 'hair_concerns'
      ];
      
      arrayFields.forEach(field => {
        if (!safeUserProfile[field] || !Array.isArray(safeUserProfile[field])) {
          safeUserProfile[field] = [];
        }
      });
      
      // Prepare data for AI generation with sanitized profile data
      const formulaData = {
        product_type: selectedProductType,
        formula_name: currentFormula.name || `AI ${selectedProductType.charAt(0).toUpperCase() + selectedProductType.slice(1)}`,
        // Include sanitized profile data
        ...safeUserProfile
      };
      
      // Log the sanitized data for debugging
      console.log('Sending sanitized formula data:', formulaData);
      
      // Generate formula
      const response = await generateAIFormula(formulaData);
      
      // Check if formula was created and has an ID
      if (response && response.id) {
        setGeneratedFormulaId(response.id);
        setSuccess(`Formula "${response.name}" generated successfully!`);
      } else {
        setSuccess('Formula generated successfully! You can proceed to the next step.');
      }
    } catch (error) {
      console.error('Error generating formula:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to generate formula. Please try again.';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.data && error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            // Handle validation error array - common in FastAPI 422 errors
            errorMessage = error.response.data.detail
              .map(err => err.msg || JSON.stringify(err))
              .join(', ');
          } else {
            errorMessage = error.response.data.detail;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle viewing formula details
  const handleViewFormulaDetails = () => {
    if (generatedFormulaId) {
      navigate(`/formulas/${generatedFormulaId}`);
    }
  };

  // Handle proceeding to next step
  const handleNextStep = () => {
    setWizardStep(1); // Move to the second step in the wizard
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">
            {typeof error === 'object' ? 
              (error.message || JSON.stringify(error)) : 
              error}
          </p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {generatedFormulaId && (
              <button
                onClick={handleViewFormulaDetails}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Formula Details
              </button>
            )}
            
            <button
              onClick={handleNextStep}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Continue to Ingredients
            </button>
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        AI Formula Generator
      </h2>
      
      {/* Free user notice */}
      {userType === 'free' && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                AI formula generation is a premium feature. <a href="/subscription" className="font-medium underline">Upgrade your account</a> to access personalized formulations.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Completion Check for non-free users */}
      {userType !== 'free' && !isProfileComplete && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Complete your profile for personalized formulations.</strong> Our AI needs information about your skin type, concerns, and preferences to create a customized formula.
              </p>
              <div className="mt-2">
                <Link 
                  to="/settings/account?tab=profile" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Complete your profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Product Type<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={selectedProductType}
          onChange={(e) => setSelectedProductType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
          disabled={userType === 'free'}
        >
          <option value="">Select Product Type</option>
          {productTypeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      {/* Profile summary for users with completed profiles */}
      {userType !== 'free' && isProfileComplete && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Your Profile Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Skin Type:</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{userProfile?.skin_type || "Not specified"}</p>
            </div>
            
            {userProfile?.skin_concerns && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Main Concerns:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {typeof userProfile.skin_concerns === 'string' ? 
                    (() => {
                      try {
                        const concerns = JSON.parse(userProfile.skin_concerns);
                        return Array.isArray(concerns) && concerns.length > 0 ? 
                          concerns.map((concern, idx) => (
                            <span key={`${concern}-${idx}`} className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                              {concern}
                            </span>
                          )) : 
                          <span className="text-gray-600 dark:text-gray-300">None specified</span>
                      } catch (e) {
                        return <span className="text-gray-600 dark:text-gray-300">None specified</span>
                      }
                    })() :
                    (Array.isArray(userProfile.skin_concerns) && userProfile.skin_concerns.length > 0) ? 
                      userProfile.skin_concerns.map((concern, idx) => (
                        <span key={`${concern}-${idx}`} className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                          {concern}
                        </span>
                      )) : 
                      <span className="text-gray-600 dark:text-gray-300">None specified</span>
                  }
                </div>
              </div>
            )}
            
            {userProfile?.sensitivities && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-500 dark:text-gray-400">Sensitivities:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {typeof userProfile.sensitivities === 'string' ? 
                    (() => {
                      try {
                        const sensitivities = JSON.parse(userProfile.sensitivities);
                        return Array.isArray(sensitivities) && sensitivities.length > 0 ? 
                          sensitivities.map((item, idx) => (
                            <span key={`${item}-${idx}`} className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              {item}
                            </span>
                          )) : 
                          <span className="text-gray-600 dark:text-gray-300">None specified</span>
                      } catch (e) {
                        return <span className="text-gray-600 dark:text-gray-300">None specified</span>
                      }
                    })() :
                    (Array.isArray(userProfile.sensitivities) && userProfile.sensitivities.length > 0) ? 
                      userProfile.sensitivities.map((item, idx) => (
                        <span key={`${item}-${idx}`} className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          {item}
                        </span>
                      )) : 
                      <span className="text-gray-600 dark:text-gray-300">None specified</span>
                  }
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-2 text-right">
            <Link 
              to="/settings/account?tab=profile" 
              className="text-xs text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Edit profile
            </Link>
          </div>
        </div>
      )}
      
      {/* Generate Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleGenerateFormula}
          disabled={isGenerating || !selectedProductType || (userType !== 'free' && !isProfileComplete)}
          className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Formula...
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Generate AI Formula
            </>
          )}
        </button>
      </div>
      
      {/* Optional explanation/tips */}
      {userType !== 'free' && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg text-sm text-gray-600 dark:text-gray-400">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">How AI Formula Generation Works</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Our AI analyzes your skin profile and preferences</li>
            <li>It selects ingredients that match your skin type and address your concerns</li>
            <li>The formula is optimized for texture, stability, and effectiveness</li>
            <li>You can further customize the generated formula in the Ingredients step</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnhancedFormulaRecommendation;