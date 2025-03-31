import React, { useState, useEffect, useRef } from 'react';
import { useFormula } from '../../context/FormulaContext';
import PropTypes from 'prop-types';

/**
 * IngredientSelector component for searching, filtering, and selecting ingredients
 * for cosmetic formulas with drag-and-drop functionality.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showSelected - Whether to show selected ingredients
 * @param {boolean} props.showPercentages - Whether to show and allow editing of percentages
 * @param {function} props.onIngredientAdded - Callback for when an ingredient is added
 */
const IngredientSelector = ({ 
  showSelected = true, 
  showPercentages = true,
  onIngredientAdded 
}) => {
  const { 
    availableIngredients, 
    currentFormula, 
    ingredientPhases,
    ingredientFunctions,
    compatibilityIssues,
    addIngredient, 
    removeIngredient, 
    updateIngredient,
    fetchIngredients,
    isLoading,
    errors
  } = useFormula();

  // Local state for filters
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [functionFilter, setFunctionFilter] = useState('');
  const [draggedIngredient, setDraggedIngredient] = useState(null);
  const [filteredIngredients, setFilteredIngredients] = useState([]);

  // Reference for scroll container
  const scrollContainerRef = useRef(null);

  // Apply filters to ingredients
  useEffect(() => {
    const filtered = availableIngredients.filter(ingredient => {
      // Apply search filter
      const nameMatch = ingredient.name.toLowerCase().includes(search.toLowerCase());
      const inciMatch = ingredient.inci_name.toLowerCase().includes(search.toLowerCase());
      const searchMatch = search === '' || nameMatch || inciMatch;
      
      // Apply phase filter
      const phaseMatch = phaseFilter === '' || ingredient.phase === phaseFilter;
      
      // Apply function filter
      const functionMatch = functionFilter === '' || ingredient.function === functionFilter;
      
      return searchMatch && phaseMatch && functionMatch;
    });

    // Sort ingredients: first by phase, then by name
    const sorted = [...filtered].sort((a, b) => {
      if (a.phase !== b.phase) {
        return (a.phase || '').localeCompare(b.phase || '');
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredIngredients(sorted);
  }, [availableIngredients, search, phaseFilter, functionFilter]);

  // Fetch ingredients on mount
  useEffect(() => {
    if (availableIngredients.length === 0 && !isLoading.ingredients) {
      fetchIngredients();
    }
  }, [availableIngredients.length, fetchIngredients, isLoading.ingredients]);

  // Calculate total percentage of ingredients
  const totalPercentage = currentFormula.ingredients.reduce(
    (total, ing) => total + parseFloat(ing.percentage || 0), 
    0
  );

  // Check if ingredient is already in formula
  const isIngredientSelected = (id) => {
    return currentFormula.ingredients.some(ing => ing.ingredient_id === id);
  };

  // Handle adding an ingredient
  const handleAddIngredient = (ingredient) => {
    if (isIngredientSelected(ingredient.id)) return;

    // Calculate a reasonable default percentage based on remaining percentage
    const remaining = Math.max(0, 100 - totalPercentage);
    let defaultPercentage = 5.0;
    
    // Adjust default percentage based on ingredient function or phase
    if (ingredient.function) {
      if (ingredient.function.includes('Preservative')) {
        defaultPercentage = 0.5;
      } else if (ingredient.function.includes('Active')) {
        defaultPercentage = 2.0;
      } else if (ingredient.function.includes('Emulsifier')) {
        defaultPercentage = 3.0;
      }
    }
    
    // Use the recommended max percentage if available and lower than default
    if (ingredient.recommended_max_percentage && 
        ingredient.recommended_max_percentage < defaultPercentage) {
      defaultPercentage = ingredient.recommended_max_percentage;
    }
    
    // Make sure we don't exceed 100%
    if (defaultPercentage > remaining) {
      defaultPercentage = remaining;
    }
    
    // Round to one decimal place
    defaultPercentage = Math.round(defaultPercentage * 10) / 10;
    
    const newIngredient = {
      ingredient_id: ingredient.id,
      percentage: defaultPercentage,
      ingredient: ingredient // Include reference to the original ingredient for display
    };
    
    addIngredient(newIngredient);
    
    if (onIngredientAdded) {
      onIngredientAdded(newIngredient);
    }
  };

  // Handle ingredient percentage change
  const handlePercentageChange = (id, newPercentage) => {
    // Parse and validate the percentage
    let parsedPercentage = parseFloat(newPercentage);
    
    // Handle NaN case
    if (isNaN(parsedPercentage)) {
      parsedPercentage = 0;
    }
    
    // Limit to maximum 100%
    parsedPercentage = Math.min(100, parsedPercentage);
    
    // Round to one decimal place
    parsedPercentage = Math.round(parsedPercentage * 10) / 10;
    
    updateIngredient({
      ingredient_id: id,
      percentage: parsedPercentage
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e, ingredient) => {
    setDraggedIngredient(ingredient);
    e.dataTransfer.setData('text/plain', ingredient.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedIngredient) {
      handleAddIngredient(draggedIngredient);
      setDraggedIngredient(null);
    }
  };

  // Find compatibility issues for an ingredient
  const getCompatibilityIssues = (ingredientId) => {
    return compatibilityIssues.filter(issue => 
      issue.ingredient1.id === ingredientId || 
      issue.ingredient2.id === ingredientId
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Ingredient search and filter panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Available Ingredients
        </h3>
        
        {/* Search and filters */}
        <div className="space-y-3 mb-4">
          {/* Search input */}
          <div>
            <label htmlFor="ingredient-search" className="sr-only">Search ingredients</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="search"
                id="ingredient-search"
                className="w-full pl-10 p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Search ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Phase filter */}
            <div>
              <label htmlFor="phase-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phase
              </label>
              <select
                id="phase-filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={phaseFilter}
                onChange={(e) => setPhaseFilter(e.target.value)}
              >
                <option value="">All Phases</option>
                {ingredientPhases.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Function filter */}
            <div>
              <label htmlFor="function-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Function
              </label>
              <select
                id="function-filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={functionFilter}
                onChange={(e) => setFunctionFilter(e.target.value)}
              >
                <option value="">All Functions</option>
                {ingredientFunctions.map((func) => (
                  <option key={func} value={func}>
                    {func}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Ingredient list */}
        {isLoading.ingredients ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        ) : errors.ingredients ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {errors.ingredients}
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto max-h-96"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {filteredIngredients.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No ingredients match your filters
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredIngredients.map((ingredient) => {
                  const isSelected = isIngredientSelected(ingredient.id);
                  return (
                    <li 
                      key={ingredient.id}
                      className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                        isSelected ? 'bg-violet-50 dark:bg-violet-900/20' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ingredient)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {ingredient.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {ingredient.inci_name}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {ingredient.phase && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {ingredient.phase}
                              </span>
                            )}
                            {ingredient.function && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {ingredient.function}
                              </span>
                            )}
                            {ingredient.recommended_max_percentage && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                Max: {ingredient.recommended_max_percentage}%
                              </span>
                            )}
                            {ingredient.is_premium && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                                Premium
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className={`p-1.5 rounded-full ${
                            isSelected
                              ? 'bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400'
                              : 'bg-violet-100 text-violet-600 hover:bg-violet-200 dark:bg-violet-900/50 dark:text-violet-400'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              const selectedIngredient = currentFormula.ingredients.find(
                                ing => ing.ingredient_id === ingredient.id
                              );
                              if (selectedIngredient) {
                                removeIngredient(ingredient.id);
                              }
                            } else {
                              handleAddIngredient(ingredient);
                            }
                          }}
                          aria-label={isSelected ? 'Remove ingredient' : 'Add ingredient'}
                        >
                          {isSelected ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      
      {/* Selected ingredients panel */}
      {showSelected && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Selected Ingredients
            </h3>
            <div className={`text-sm font-medium ${
              Math.abs(totalPercentage - 100) < 0.1
                ? 'text-green-600 dark:text-green-400'
                : totalPercentage > 100
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              Total: {totalPercentage.toFixed(1)}%
            </div>
          </div>
          
          {currentFormula.ingredients.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No ingredients selected yet. Drag ingredients here or click the + button to add them.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentFormula.ingredients.map((item) => {
                // Find the full ingredient details
                const ingredient = item.ingredient || availableIngredients.find(i => i.id === item.ingredient_id);
                if (!ingredient) return null;
                
                // Check for compatibility issues
                const issues = getCompatibilityIssues(ingredient.id);
                const hasIssues = issues.length > 0;
                
                return (
                  <div key={item.ingredient_id} className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {ingredient.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ingredient.inci_name}
                        </p>
                        
                        {/* Ingredient metadata */}
                        <div className="mt-1 flex flex-wrap gap-1">
                          {ingredient.phase && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {ingredient.phase}
                            </span>
                          )}
                          {ingredient.function && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {ingredient.function}
                            </span>
                          )}
                        </div>
                        
                        {/* Compatibility warnings */}
                        {hasIssues && (
                          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
                            <div className="flex">
                              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <div className="ml-2">
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                  Compatibility issue with: {issues.map(issue => 
                                    issue.ingredient1.id === ingredient.id 
                                      ? issue.ingredient2.name 
                                      : issue.ingredient1.name
                                  ).join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Percentage and actions */}
                      <div className="flex items-start ml-2">
                        {showPercentages && (
                          <div className="relative mr-2">
                            <input
                              type="number"
                              value={item.percentage}
                              min="0"
                              max="100"
                              step="0.1"
                              onChange={(e) => handlePercentageChange(item.ingredient_id, e.target.value)}
                              className="w-16 p-1 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              aria-label="Ingredient percentage"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none text-gray-500 dark:text-gray-400">
                              %
                            </span>
                          </div>
                        )}
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removeIngredient(item.ingredient_id)}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                          aria-label="Remove ingredient"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Total percentage warning */}
          {currentFormula.ingredients.length > 0 && Math.abs(totalPercentage - 100) > 0.1 && (
            <div className={`mt-3 p-2 rounded-md text-sm ${
              totalPercentage > 100
                ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
            }`}>
              {totalPercentage > 100
                ? `Total percentage exceeds 100% by ${(totalPercentage - 100).toFixed(1)}%. Please adjust your formulation.`
                : `Total percentage is ${totalPercentage.toFixed(1)}%, which is ${(100 - totalPercentage).toFixed(1)}% short of 100%. Please add more ingredients or adjust percentages.`
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

IngredientSelector.propTypes = {
  showSelected: PropTypes.bool,
  showPercentages: PropTypes.bool,
  onIngredientAdded: PropTypes.func
};

export default IngredientSelector;