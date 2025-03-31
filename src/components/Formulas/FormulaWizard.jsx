import React, { useState, useEffect } from 'react';
import { useFormula } from '../../context/FormulaContext';
import IngredientSelector from './IngredientSelector';
import FormulaRecommendation from '../AI/FormulaRecommendation';
import { useNavigate } from 'react-router-dom';

/**
 * FormulaWizard component - A multi-step wizard for formula creation
 * 
 * The wizard guides users through the formula creation process with these steps:
 * 1. Basic Details - Enter formula name, type, description
 * 2. AI Recommendation (optional) - Get AI-suggested formula based on needs
 * 3. Ingredients - Select and adjust ingredient percentages
 * 4. Manufacturing Steps - Define the manufacturing process
 * 5. Review & Save - Review the complete formula and save
 */
const FormulaWizard = () => {
  const navigate = useNavigate();
  const {
    currentFormula,
    updateFormulaField,
    addFormulaStep,
    updateFormulaStep,
    removeFormulaStep,
    resetFormula,
    saveFormula,
    wizard,
    setWizardStep,
    isLoading,
    errors
  } = useFormula();

  const [newStepDescription, setNewStepDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Step configuration
  const steps = [
    { name: 'Basic Details', description: 'Enter formula information' },
    { name: 'AI Recommendation', description: 'Get AI-suggested formula (optional)' },
    { name: 'Ingredients', description: 'Select and adjust ingredients' },
    { name: 'Manufacturing Steps', description: 'Define the manufacturing process' },
    { name: 'Review & Save', description: 'Review the complete formula' }
  ];

  // Validate form at current step
  const validateCurrentStep = () => {
    const errors = {};

    switch (wizard.currentStep) {
      case 0: // Basic Details
        if (!currentFormula.name) errors.name = 'Formula name is required';
        if (!currentFormula.type) errors.type = 'Formula type is required';
        break;
      case 2: // Ingredients
        if (currentFormula.ingredients.length === 0) {
          errors.ingredients = 'At least one ingredient is required';
        }
        
        const totalPercentage = currentFormula.ingredients.reduce(
          (sum, ingredient) => sum + parseFloat(ingredient.percentage || 0), 
          0
        );
        
        if (Math.abs(totalPercentage - 100) > 0.1) {
          errors.totalPercentage = `Total percentage is ${totalPercentage.toFixed(1)}%, but should be 100%`;
        }
        break;
      case 3: // Manufacturing Steps
        if (currentFormula.steps.length === 0) {
          errors.steps = 'At least one manufacturing step is required';
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate to next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      setWizardStep(wizard.currentStep + 1);
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    setWizardStep(wizard.currentStep - 1);
  };

  // Add a new manufacturing step
  const handleAddStep = () => {
    if (!newStepDescription.trim()) return;

    addFormulaStep({
      description: newStepDescription
    });

    setNewStepDescription('');
  };

  // Save the formula
  const handleSaveFormula = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      const savedFormula = await saveFormula();
      navigate(`/formulas/${savedFormula.id}`);
    } catch (error) {
      console.error('Error saving formula:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the formula (with confirmation)
  const handleResetFormula = () => {
    setShowConfirmReset(false);
    resetFormula();
    setWizardStep(0);
    setValidationErrors({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Progress bar */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="px-5 py-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {wizard.currentStep === 0 && !currentFormula.name 
              ? 'Create New Formula' 
              : currentFormula.name || 'Untitled Formula'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {steps[wizard.currentStep].description}
          </p>
        </div>
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-750 flex">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex-1 ${index < steps.length - 1 ? 'relative' : ''}`}
            >
              <div 
                className={`h-2 ${
                  index <= wizard.currentStep 
                    ? 'bg-violet-500 dark:bg-violet-400' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              ></div>
              
              {/* Step indicators */}
              <div className="absolute top-0 -ml-1">
                <div 
                  className={`w-4 h-4 rounded-full border-2 ${
                    index < wizard.currentStep
                      ? 'bg-violet-500 border-violet-500 dark:bg-violet-400 dark:border-violet-400'
                      : index === wizard.currentStep
                        ? 'bg-white dark:bg-gray-900 border-violet-500 dark:border-violet-400'
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-500'
                  }`}
                ></div>
              </div>
              
              {/* Step names (only show on larger screens) */}
              <div className="hidden md:block text-xs mt-2 text-center">
                <span 
                  className={
                    index === wizard.currentStep
                      ? 'font-semibold text-violet-600 dark:text-violet-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                >
                  {step.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-5">
        {/* Step 1: Basic Details */}
        {wizard.currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Formula Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  validationErrors.name ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter a name for your formula"
                value={currentFormula.name}
                onChange={(e) => updateFormulaField('name', e.target.value)}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Formula Type<span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  validationErrors.type ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                value={currentFormula.type}
                onChange={(e) => updateFormulaField('type', e.target.value)}
              >
                <option value="">Select a formula type</option>
                <option value="Serum">Serum</option>
                <option value="Moisturizer">Moisturizer</option>
                <option value="Cleanser">Cleanser</option>
                <option value="Toner">Toner</option>
                <option value="Mask">Face Mask</option>
                <option value="Essence">Essence</option>
              </select>
              {validationErrors.type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.type}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter a description for your formula"
                rows="4"
                value={currentFormula.description}
                onChange={(e) => updateFormulaField('description', e.target.value)}
              ></textarea>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  checked={currentFormula.is_public}
                  onChange={(e) => updateFormulaField('is_public', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Make this formula public (share with other users)
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Weight (g)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="100.0"
                value={currentFormula.total_weight}
                onChange={(e) => updateFormulaField('total_weight', parseFloat(e.target.value) || 100.0)}
                min="1"
                step="0.1"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Default is 100g. All ingredient percentages are relative to this total weight.
              </p>
            </div>
          </div>
        )}
        
        {/* Step 2: AI Recommendation */}
        {wizard.currentStep === 1 && (
          <div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This step is optional. You can either use AI to generate a formula based on your needs, or skip to the next step for manual creation.
                  </p>
                </div>
              </div>
            </div>
            
            <FormulaRecommendation />
            
            <div className="mt-6 text-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                onClick={handleNext}
              >
                {currentFormula.ingredients.length > 0 
                  ? 'Continue with AI Recommendation' 
                  : 'Skip AI Recommendation'}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Ingredients */}
        {wizard.currentStep === 2 && (
          <div>
            <IngredientSelector showSelected={true} showPercentages={true} />
            
            {validationErrors.ingredients && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-400">{validationErrors.ingredients}</p>
              </div>
            )}
            
            {validationErrors.totalPercentage && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">{validationErrors.totalPercentage}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Step 4: Manufacturing Steps */}
        {wizard.currentStep === 3 && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manufacturing Steps
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Define the steps required to manufacture this formula. Be specific about temperatures, mixing times, and methods.
              </p>
              
              {/* List existing steps */}
              {currentFormula.steps.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {currentFormula.steps
                    .sort((a, b) => a.order - b.order)
                    .map((step, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-750 rounded-md">
                        <div className="flex-shrink-0 mr-3">
                          <span className="flex items-center justify-center w-6 h-6 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium">
                            {step.order}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              {step.description}
                            </p>
                            <div className="flex-shrink-0 ml-2">
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => removeFormulaStep(step.order)}
                                aria-label="Remove step"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No manufacturing steps added yet
                  </p>
                </div>
              )}
              
              {validationErrors.steps && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-400">{validationErrors.steps}</p>
                </div>
              )}
              
              {/* Add new step */}
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter a new manufacturing step"
                  value={newStepDescription}
                  onChange={(e) => setNewStepDescription(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddStep();
                    }
                  }}
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                  onClick={handleAddStep}
                >
                  Add Step
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 5: Review & Save */}
        {wizard.currentStep === 4 && (
          <div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Please review your formula before saving. Once saved, you can edit it later from your formulas list.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border dark:border-gray-700 rounded-md overflow-hidden mb-6">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Formula Overview
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Basic Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{currentFormula.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{currentFormula.type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Visibility:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {currentFormula.is_public ? 'Public' : 'Private'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Weight:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {currentFormula.total_weight}g
                        </p>
                      </div>
                      {currentFormula.description && (
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Description:</span>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{currentFormula.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Ingredients</h4>
                    {currentFormula.ingredients.length > 0 ? (
                      <div className="overflow-auto max-h-40">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ingredient</th>
                              <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">%</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentFormula.ingredients.map((item, idx) => (
                              <tr key={idx}>
                                <td className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {item.ingredient?.name || `Ingredient #${item.ingredient_id}`}
                                </td>
                                <td className="text-right text-sm text-gray-500 dark:text-gray-400">
                                  {item.percentage}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No ingredients added</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Manufacturing Steps</h4>
                  {currentFormula.steps.length > 0 ? (
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                      {currentFormula.steps
                        .sort((a, b) => a.order - b.order)
                        .map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-800 dark:text-gray-200">
                            {step.description}
                          </li>
                        ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No manufacturing steps added</p>
                  )}
                </div>
              </div>
            </div>
            
            {errors.formulaSaving && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-400">{errors.formulaSaving}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wizard footer actions */}
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <div>
          {wizard.currentStep > 0 && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
              onClick={handlePrevious}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
            onClick={() => setShowConfirmReset(true)}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          {wizard.currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
              onClick={handleNext}
            >
              Next
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              onClick={handleSaveFormula}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Formula
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      Reset Formula
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to reset this formula? All changes will be lost and cannot be recovered.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleResetFormula}
                >
                  Reset
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmReset(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaWizard;