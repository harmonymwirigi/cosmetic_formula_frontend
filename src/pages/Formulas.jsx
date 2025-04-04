import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { userAPI, formulaAPI } from '../services/api';
import ProtectedRoute from '../components/shared/ProtectedRoute';

function Formulas() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [filteredFormulas, setFilteredFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formulaToDelete, setFormulaToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch user data and formulas
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch all formulas
        const formulasResponse = await formulaAPI.getFormulas();
        if (Array.isArray(formulasResponse.data)) {
          setFormulas(formulasResponse.data);
          setFilteredFormulas(formulasResponse.data);
        } else {
          console.warn('Received invalid formulas data:', formulasResponse);
          setFormulas([]);
          setFilteredFormulas([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response && error.response.status === 401) {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    // Filter formulas based on search term and type filter
    let filtered = [...formulas];
    
    if (searchTerm) {
      filtered = filtered.filter(formula => 
        formula.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter) {
      filtered = filtered.filter(formula => formula.type === typeFilter);
    }
    
    // Sort formulas
    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredFormulas(filtered);
  }, [formulas, searchTerm, typeFilter, sortOption]);

  // Get unique formula types for filter dropdown
  const uniqueTypes = Array.from(new Set(formulas.map(formula => formula.type))).filter(Boolean);

  // Handle formula deletion
  const confirmDelete = (formula) => {
    setFormulaToDelete(formula);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!formulaToDelete) return;
    
    try {
      await formulaAPI.deleteFormula(formulaToDelete.id);
      
      // Remove from state
      const updatedFormulas = formulas.filter(f => f.id !== formulaToDelete.id);
      setFormulas(updatedFormulas);
      
      // Close modal
      setShowDeleteModal(false);
      setFormulaToDelete(null);
    } catch (error) {
      console.error('Failed to delete formula:', error);
    }
  };

  // Handle formula duplication
  const handleDuplicate = async (formulaId) => {
    try {
      setLoading(true);
      const response = await formulaAPI.duplicateFormula(formulaId);
      
      // Refresh formulas list or navigate to the new formula
      if (response && response.data) {
        const formulasResponse = await formulaAPI.getFormulas();
        if (Array.isArray(formulasResponse.data)) {
          setFormulas(formulasResponse.data);
        }
      }
    } catch (error) {
      console.error('Failed to duplicate formula:', error);
    } finally {
      setLoading(false);
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
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">My Formulas</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage and organize your cosmetic formulations
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <Link
                    to="/ai-formula-generator"
                    className="btn bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500 dark:text-violet-400"
                  >
                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                      <path d="M10.8 16A5.2 5.2 0 0 0 16 10.8V8h-6v8h.8Z"></path>
                      <path d="M8 0H5.2A5.2 5.2 0 0 0 0 5.2V8h8V0Z"></path>
                    </svg>
                    <span className="ml-2">AI Generator</span>
                  </Link>
                  <Link
                    to="/formulas/create"
                    className="btn bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Create Formula</span>
                  </Link>
                </div>
              </div>

              {/* Filters and search */}
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="md:flex md:justify-between md:items-center space-y-4 md:space-y-0">
                  {/* Search */}
                  <div className="relative">
                    <label htmlFor="formula-search" className="sr-only">Search formulas</label>
                    <input
                      id="formula-search"
                      type="search"
                      className="form-input pl-10 w-full md:w-auto rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      placeholder="Search formulas..."
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
                    {/* Type filter */}
                    <div className="flex items-center">
                      <label htmlFor="type-filter" className="mr-2 text-sm text-gray-600 dark:text-gray-400">Type:</label>
                      <select
                        id="type-filter"
                        className="form-select w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="">All Types</option>
                        {uniqueTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
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
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="a-z">Name (A-Z)</option>
                        <option value="z-a">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              {filteredFormulas.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No formulas found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm || typeFilter ? 'Try adjusting your filters or search term.' : 'Get started by creating your first formula.'}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/formulas/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
                    >
                      Create a Formula
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFormulas.map((formula) => (
                    <div key={formula.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                      {/* Formula card header with type badge */}
                      <div className="relative p-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="absolute top-5 right-5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            formula.type === 'Serum' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            formula.type === 'Moisturizer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            formula.type === 'Cleanser' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            formula.type === 'Toner' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            formula.type === 'Mask' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {formula.type}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 pr-24 mb-1">
                          {formula.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created {new Date(formula.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {/* Formula card content */}
                      <div className="p-5">
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingredients</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formula.ingredients ? formula.ingredients.length : 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formula.total_weight}g
                            </span>
                          </div>
                        </div>
                        
                        {/* Formula card actions */}
                        <div className="flex flex-col space-y-2">
                          <Link 
                            to={`/formulas/${formula.id}`}
                            className="w-full btn-sm bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                          >
                            View Details
                          </Link>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDuplicate(formula.id)}
                              className="flex-1 btn-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() => confirmDelete(formula)}
                              className="flex-1 btn-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                      Delete Formula
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete <span className="font-medium">{formulaToDelete?.name}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

export default Formulas;