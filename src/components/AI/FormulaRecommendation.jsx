import React, { useState } from 'react';
import { useFormula } from '../../context/FormulaContext';

/**
 * FormulaRecommendation component provides AI-powered recommendations
 * for cosmetic formulations based on product type and skin concerns.
 * 
 * Features:
 * - Product type selection
 * - Skin concern multi-selection
 * - Preferred ingredient selection
 * - Avoided ingredient selection
 * - AI-powered formula generation
 */
const FormulaRecommendation = () => {
  const {
    availableIngredients,
    generateAIFormula,
    isLoading,
    errors
  } = useFormula();

  // Component state
  const [productType, setProductType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState([]);
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
  
  // Skin concerns
  const skinConcernOptions = [
    { id: 'dryness', name: 'Dryness' },
    { id: 'aging', name: 'Aging' },
    { id: 'acne', name: 'Acne-Prone' },
    { id: 'sensitivity', name: 'Sensitivity' },
    { id: 'hyperpigmentation', name: 'Hyperpigmentation' },
    { id: 'oiliness', name: 'Oiliness' },
    { id: 'redness', name: 'Redness' },
    { id: 'uneven texture', name: 'Uneven Texture' }
  ];

  // Handle skin concern selection/deselection
  const toggleSkinConcern = (concernId) => {
    if (skinConcerns.includes(concernId)) {
      setSkinConcerns(skinConcerns.filter(id => id !== concernId));
    } else {
      setSkinConcerns([...skinConcerns, concernId]);
    }
  };

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
    if (!productType || skinConcerns.length === 0) {
      return;
    }

    try {
      await generateAIFormula(
        productType,
        skinConcerns,
        preferredIngredients,
        avoidedIngredients
      );
      
      setShowResults(true);
    } catch (error) {
      console.error('Failed to generate formula:', error);
    }
  };

  // Reset form and start over
  const handleReset = () => {
    setProductType('');
    setSkinConcerns([]);
    setPreferredIngredients([]);
    setAvoidedIngredients([]);
    setShowResults(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          AI Formula Recommendation
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Our AI will create a personalized formula based on your needs and preferences
        </p>
      </div>

      <div className="p-5">
        {!showResults ? (
          <div className="space-y-6">
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

            {/* Skin Concerns Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skin Concerns<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {skinConcernOptions.map((concern) => (
                  <div 
                    key={concern.id}
                    className={`
                      border rounded-lg p-2 text-center cursor-pointer transition-colors
                      ${skinConcerns.includes(concern.id) 
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800'
                      }
                    `}
                    onClick={() => toggleSkinConcern(concern.id)}
                  >
                    <span className="text-sm">{concern.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Select one or more skin concerns that you'd like to address
              </p>
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
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none ${
                  (!productType || skinConcerns.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleGenerateFormula}
                disabled={!productType || skinConcerns.length === 0 || isLoading.aiRecommendation}
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
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-green-800 dark:text-green-200">Formula Generated Successfully!</h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Your personalized formula has been created based on your preferences.
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
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

export default FormulaRecommendation;