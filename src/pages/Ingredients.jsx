import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { userAPI, ingredientAPI } from '../services/api';
import ProtectedRoute from '../components/shared/ProtectedRoute';

function Ingredients() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [functionFilter, setFunctionFilter] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [phases, setPhases] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  // Fetch user data and ingredients
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        setSubscriptionInfo({
          type: userResponse.data.subscription_type,
          expiresAt: userResponse.data.subscription_expires_at
        });
        
        // Fetch ingredient phases
        const phasesResponse = await ingredientAPI.getIngredientPhases();
        if (Array.isArray(phasesResponse.data)) {
          setPhases(phasesResponse.data);
        }
        
        // Fetch ingredient functions
        const functionsResponse = await ingredientAPI.getIngredientFunctions();
        if (Array.isArray(functionsResponse.data)) {
          setFunctions(functionsResponse.data);
        }
        
        // Fetch all ingredients
        const ingredientsResponse = await ingredientAPI.getIngredients();
        if (Array.isArray(ingredientsResponse.data)) {
          setIngredients(ingredientsResponse.data);
          setFilteredIngredients(ingredientsResponse.data);
        } else {
          console.warn('Received invalid ingredients data:', ingredientsResponse);
          setIngredients([]);
          setFilteredIngredients([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    // Filter ingredients based on search term, phase, and function filters
    let filtered = [...ingredients];
    
    if (searchTerm) {
      filtered = filtered.filter(ingredient => 
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.inci_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (phaseFilter) {
      filtered = filtered.filter(ingredient => ingredient.phase === phaseFilter);
    }
    
    if (functionFilter) {
      filtered = filtered.filter(ingredient => 
        ingredient.function && ingredient.function.includes(functionFilter)
      );
    }
    
    // Sort ingredients
    switch (sortOption) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'inci-asc':
        filtered.sort((a, b) => a.inci_name.localeCompare(b.inci_name));
        break;
      case 'inci-desc':
        filtered.sort((a, b) => b.inci_name.localeCompare(a.inci_name));
        break;
      default:
        break;
    }
    
    setFilteredIngredients(filtered);
  }, [ingredients, searchTerm, phaseFilter, functionFilter, sortOption]);

  // Handle showing ingredient details
  const handleShowDetails = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowDetailModal(true);
  };

  // Get subscription label based on subscription type
  const getSubscriptionLabel = (subscriptionType) => {
    switch (subscriptionType) {
      case 'premium':
        return 'Premium';
      case 'professional':
        return 'Professional';
      default:
        return 'Free';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
              {/* Page header */}
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Ingredients Database</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Browse and search through our comprehensive collection of cosmetic ingredients
                  </p>
                </div>

                {/* Right: Subscription Badge */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <div className={`px-4 py-2 rounded-lg ${
                    subscriptionInfo?.type === 'professional'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                      : subscriptionInfo?.type === 'premium'
                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    <span className="text-sm font-medium">
                      {getSubscriptionLabel(subscriptionInfo?.type)} Subscription
                    </span>
                    {subscriptionInfo?.type === 'free' && (
                      <Link
                        to="/subscription"
                        className="ml-2 text-xs text-violet-600 dark:text-violet-400 hover:underline"
                      >
                        Upgrade
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Filters and search */}
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="md:flex md:justify-between md:items-center space-y-4 md:space-y-0">
                  {/* Search */}
                  <div className="relative">
                    <label htmlFor="ingredient-search" className="sr-only">Search ingredients</label>
                    <input
                      id="ingredient-search"
                      type="search"
                      className="form-input pl-10 w-full md:w-auto rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      placeholder="Search ingredients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center space-x-2 space-y-2 sm:space-y-0">
                    {/* Phase filter */}
                    <div className="flex items-center">
                      <label htmlFor="phase-filter" className="mr-2 text-sm text-gray-600 dark:text-gray-400">Phase:</label>
                      <select
                        id="phase-filter"
                        className="form-select w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        value={phaseFilter}
                        onChange={(e) => setPhaseFilter(e.target.value)}
                      >
                        <option value="">All Phases</option>
                        {phases.map((phase) => (
                          <option key={phase} value={phase}>{phase}</option>
                        ))}
                      </select>
                    </div>

                    {/* Function filter */}
                    <div className="flex items-center">
                      <label htmlFor="function-filter" className="mr-2 text-sm text-gray-600 dark:text-gray-400">Function:</label>
                      <select
                        id="function-filter"
                        className="form-select w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        value={functionFilter}
                        onChange={(e) => setFunctionFilter(e.target.value)}
                      >
                        <option value="">All Functions</option>
                        {functions.map((func) => (
                          <option key={func} value={func}>{func}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sort options */}
                    <div className="flex items-center">
                      <label htmlFor="sort-option" className="mr-2 text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                      <select
                        id="sort-option"
                        className="form-select w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="inci-asc">INCI Name (A-Z)</option>
                        <option value="inci-desc">INCI Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Ingredients</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{ingredients.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {filteredIngredients.length} shown with current filters
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available in Your Plan</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {ingredients.filter(ing => {
                      if (subscriptionInfo?.type === 'free') {
                        return !ing.is_premium && !ing.is_professional;
                      } else if (subscriptionInfo?.type === 'premium') {
                        return !ing.is_professional;
                      } else {
                        return true;
                      }
                    }).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {subscriptionInfo?.type === 'free' 
                      ? 'Upgrade to access premium ingredients' 
                      : subscriptionInfo?.type === 'premium'
                        ? 'Upgrade to access professional ingredients'
                        : 'You have access to all ingredients'}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available Phases</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{phases.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {phaseFilter ? `Currently filtering by: ${phaseFilter}` : 'Not currently filtering by phase'}
                  </p>
                </div>
              </div>

              {/* Content */}
              {filteredIngredients.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No ingredients found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-750">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            INCI Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Phase
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Function
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Max %
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tier
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredIngredients.map((ingredient) => {
                          // Check if ingredient is available to current user
                          const isLocked = 
                            (ingredient.is_professional && subscriptionInfo?.type !== 'professional') ||
                            (ingredient.is_premium && subscriptionInfo?.type === 'free');
                          
                          return (
                            <tr key={ingredient.id} className={isLocked ? 'opacity-60' : ''}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {isLocked && (
                                    <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                  )}
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {ingredient.name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">{ingredient.inci_name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {ingredient.phase ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    {ingredient.phase}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {ingredient.function || '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {ingredient.recommended_max_percentage ? `${ingredient.recommended_max_percentage}%` : '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {ingredient.is_professional ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                    Professional
                                  </span>
                                ) : ingredient.is_premium ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                                    Premium
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    Basic
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {isLocked ? (
                                  <Link
                                    to="/subscription"
                                    className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 font-medium"
                                  >
                                    Upgrade to Access
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => handleShowDetails(ingredient)}
                                    className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 font-medium"
                                  >
                                    View Details
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Cosmetic Formula Lab. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Ingredient Detail Modal */}
      {showDetailModal && selectedIngredient && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                        {selectedIngredient.name}
                      </h3>
                      <button 
                        onClick={() => setShowDetailModal(false)}
                        className="bg-white dark:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-2 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">INCI Name</h4>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{selectedIngredient.inci_name}</p>
                      </div>
                      
                      {selectedIngredient.description && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                          <p className="text-sm text-gray-900 dark:text-gray-100">{selectedIngredient.description}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        {selectedIngredient.phase && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phase</h4>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{selectedIngredient.phase}</p>
                          </div>
                        )}
                        
                        {selectedIngredient.function && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Function</h4>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{selectedIngredient.function}</p>
                          </div>
                        )}
                        
                        {selectedIngredient.recommended_max_percentage && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommended Max %</h4>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{selectedIngredient.recommended_max_percentage}%</p>
                          </div>
                        )}
                        
                        {selectedIngredient.solubility && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Solubility</h4>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{selectedIngredient.solubility}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription Tier</h4>
                        <div className="mt-1">
                          {selectedIngredient.is_professional ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                              Professional Plan
                            </span>
                          ) : selectedIngredient.is_premium ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                              Premium Plan
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Free Plan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

export default Ingredients;