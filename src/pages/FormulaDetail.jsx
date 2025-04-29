import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { userAPI, formulaAPI, exportAPI } from '../services/api';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { toast } from 'react-toastify';
function FormulaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formula, setFormula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedFormula, setEditedFormula] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Fetch user data and formula
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch formula details
        const formulaResponse = await formulaAPI.getFormula(id);
        setFormula(formulaResponse.data);
        setEditedFormula(formulaResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load formula');
        if (error.response && error.response.status === 401) {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Calculate total percentage of ingredients
  const calculateTotalPercentage = (ingredientsList) => {
    if (!ingredientsList) return 0;
    return ingredientsList.reduce((total, ing) => {
      return total + parseFloat(ing.percentage || 0);
    }, 0);
  };

  // Group ingredients by phase
  const groupIngredientsByPhase = (ingredients) => {
    if (!ingredients) return {};
    
    return ingredients.reduce((groups, item) => {
      const phase = item.ingredient?.phase || 'Uncategorized';
      if (!groups[phase]) {
        groups[phase] = [];
      }
      groups[phase].push(item);
      return groups;
    }, {});
  };

  // Handle editing formula details
  const handleInputChange = (field, value) => {
    setEditedFormula(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle ingredient percentage change
  const handleIngredientChange = (ingredientId, newPercentage) => {
    const updatedIngredients = editedFormula.ingredients.map(item => {
      if (item.ingredient_id === ingredientId) {
        return { ...item, percentage: parseFloat(newPercentage) || 0 };
      }
      return item;
    });
    
    setEditedFormula(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  // Handle step description change
  const handleStepChange = (stepId, newDescription) => {
    const updatedSteps = editedFormula.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, description: newDescription };
      }
      return step;
    });
    
    setEditedFormula(prev => ({
      ...prev,
      steps: updatedSteps
    }));
  };

  // Save edited formula
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Update basic formula details
      await formulaAPI.updateFormula(id, {
        name: editedFormula.name,
        description: editedFormula.description,
        type: editedFormula.type,
        is_public: editedFormula.is_public,
        total_weight: editedFormula.total_weight
      });
      
      // Update ingredients
      const ingredientsUpdate = {
        ingredients: editedFormula.ingredients.map(item => ({
          ingredient_id: item.ingredient_id,
          percentage: item.percentage,
          order: item.order || 0
        }))
      };
      await formulaAPI.updateFormulaIngredients(id, ingredientsUpdate);
      
      // Update steps
      const stepsUpdate = {
        steps: editedFormula.steps.map(step => ({
          description: step.description,
          order: step.order
        }))
      };
      await formulaAPI.updateFormulaSteps(id, stepsUpdate);
      
      // Refresh the formula data
      const formulaResponse = await formulaAPI.getFormula(id);
      setFormula(formulaResponse.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save formula:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle formula duplication
  const handleDuplicate = async () => {
    try {
      setLoading(true);
      const response = await formulaAPI.duplicateFormula(id);
      if (response && response.data && response.data.id) {
        navigate(`/formulas/${response.data.id}`);
      }
    } catch (error) {
      console.error('Failed to duplicate formula:', error);
      alert('Failed to duplicate formula. Please try again.');
      setLoading(false);
    }
  };

  // Export formula to PDF or other formats
  const handleExport = () => {
    try {
      // Call the API to export the formula in the selected format
      exportAPI.exportFormula(id, exportFormat);
      
      // Close the modal after triggering the export
      setShowExportModal(false);
      
      // Show a success message
      toast.success(`Exporting formula as ${exportFormat.toUpperCase()}...`);
    } catch (error) {
      console.error('Failed to export formula:', error);
      toast.error('Failed to export formula. Please try again.');
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-center text-gray-900 dark:text-gray-100 mb-2">Error Loading Formula</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link to="/formulas" className="btn bg-violet-600 hover:bg-violet-700 text-white">
              Return to Formulas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPercentage = calculateTotalPercentage(formula.ingredients);
  const ingredientsByPhase = groupIngredientsByPhase(formula.ingredients);

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
                {/* Left: Title and info */}
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center">
                    <Link 
                      to="/formulas" 
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 mr-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </Link>
                    <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                      {isEditing ? "Edit Formula" : formula.name}
                    </h1>
                  </div>
                  {!isEditing && (
                    <div className="mt-1 flex flex-wrap items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 mr-2 mb-1">
                        {formula.type}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 mb-1">
                        Created {new Date(formula.created_at).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${
                        formula.is_public
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {formula.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="btn bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                      >
                        <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400 shrink-0 mr-2" viewBox="0 0 16 16">
                          <path d="M15 2H1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 10H2V4h12v8z" />
                          <path d="M6 5.75h4a.75.75 0 0 0 0-1.5H6a.75.75 0 0 0 0 1.5zM8 8h2a.75.75 0 0 0 0-1.5H8a.75.75 0 0 0 0 1.5zM5.818 8a.75.75 0 0 0 0-1.5H4.5a.75.75 0 0 0 0 1.5h1.318z" />
                        </svg>
                        <span>Export</span>
                      </button>
                      <button
                        onClick={handleDuplicate}
                        className="btn bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                      >
                        <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400 shrink-0 mr-2" viewBox="0 0 16 16">
                          <path d="M13 7h-4V3a1 1 0 0 0-2 0v4H3a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0V9h4a1 1 0 0 0 0-2z" />
                        </svg>
                        <span>Duplicate</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        <svg className="w-4 h-4 fill-current opacity-50 shrink-0 mr-2" viewBox="0 0 16 16">
                          <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                      >
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="btn bg-violet-600 hover:bg-violet-700 text-white"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 fill-current opacity-50 shrink-0 mr-2" viewBox="0 0 16 16">
                              <path d="M14.3 2.3L5 11.6 1.7 8.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.2.2.4.3.7.3.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
                            </svg>
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex -mb-px px-4">
                    <button
                      className={`text-sm font-medium py-4 px-1 border-b-2 whitespace-nowrap ${
                        activeTab === 'overview'
                          ? 'border-violet-500 dark:border-violet-400 text-violet-600 dark:text-violet-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                    <button
                      className={`text-sm font-medium py-4 px-1 border-b-2 ml-6 whitespace-nowrap ${
                        activeTab === 'ingredients'
                          ? 'border-violet-500 dark:border-violet-400 text-violet-600 dark:text-violet-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('ingredients')}
                    >
                      Ingredients
                    </button>
                    <button
                      className={`text-sm font-medium py-4 px-1 border-b-2 ml-6 whitespace-nowrap ${
                        activeTab === 'steps'
                          ? 'border-violet-500 dark:border-violet-400 text-violet-600 dark:text-violet-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('steps')}
                    >
                      Manufacturing Steps
                    </button>
                    <button
                      className={`text-sm font-medium py-4 px-1 border-b-2 ml-6 whitespace-nowrap ${
                        activeTab === 'calculator'
                          ? 'border-violet-500 dark:border-violet-400 text-violet-600 dark:text-violet-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('calculator')}
                    >
                      Batch Calculator
                    </button>
                  </nav>
                </div>

                {/* Tab content */}
                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Formula Name
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={editedFormula.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Formula Type
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={editedFormula.type}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                              >
                                <option value="Serum">Serum</option>
                                <option value="Moisturizer">Moisturizer</option>
                                <option value="Cleanser">Cleanser</option>
                                <option value="Toner">Toner</option>
                                <option value="Mask">Face Mask</option>
                                <option value="Essence">Essence</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Total Weight (g)
                              </label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={editedFormula.total_weight}
                                onChange={(e) => handleInputChange('total_weight', parseFloat(e.target.value) || 100)}
                                min="1"
                                step="0.1"
                              />
                            </div>
                            <div className="flex items-center h-full pt-6">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                                  checked={editedFormula.is_public}
                                  onChange={(e) => handleInputChange('is_public', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  Make this formula public
                                </span>
                              </label>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows="4"
                                value={editedFormula.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                              ></textarea>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                              <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Formula Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formula.name}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Formula Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formula.type}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Weight</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formula.total_weight}g</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Visibility</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                  {formula.is_public ? 'Public' : 'Private'}
                                </dd>
                              </div>
                              <div className="md:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                  {formula.description || 'No description provided.'}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        )}
                      </div>

                      {/* Formula Statistics */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Formula Statistics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Ingredients</h4>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formula.ingredients ? formula.ingredients.length : 0}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Percentage</h4>
                            <p className={`text-2xl font-bold ${
                              Math.abs(totalPercentage - 100) < 0.1
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {totalPercentage.toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Manufacturing Steps</h4>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formula.steps ? formula.steps.length : 0}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Modified</h4>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{new Date(formula.updated_at || formula.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Overview */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Ingredients Summary */}
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Ingredients by Phase</h4>
                            {Object.keys(ingredientsByPhase).length > 0 ? (
                              <div className="space-y-3">
                                {Object.entries(ingredientsByPhase).map(([phase, ingredients]) => (
                                  <div key={phase}>
                                    <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{phase}</h5>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 pl-4">
                                      {ingredients.map((item) => (
                                        <li key={item.ingredient_id} className="flex justify-between">
                                          <span>{item.ingredient?.name}</span>
                                          <span className="text-gray-500 dark:text-gray-400">{item.percentage}%</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">No ingredients added yet.</p>
                            )}
                          </div>

                          {/* Manufacturing Steps Summary */}
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Manufacturing Steps</h4>
                            {formula.steps && formula.steps.length > 0 ? (
                              <ol className="text-sm text-gray-600 dark:text-gray-300 pl-6 list-decimal space-y-2">
                                {formula.steps
                                  .sort((a, b) => a.order - b.order)
                                  .slice(0, 5)
                                  .map((step) => (
                                    <li key={step.id}>{step.description}</li>
                                  ))}
                                {formula.steps.length > 5 && (
                                  <li className="text-violet-600 dark:text-violet-400 font-medium">
                                    <button onClick={() => setActiveTab('steps')}>
                                      + {formula.steps.length - 5} more steps
                                    </button>
                                  </li>
                                )}
                              </ol>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">No manufacturing steps added yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ingredients Tab */}
                  {activeTab === 'ingredients' && (
                    <div>
                      {/* Formula Percentage Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ingredients</h3>
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
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              Math.abs(totalPercentage - 100) < 0.1
                                ? 'bg-green-500'
                                : totalPercentage > 100
                                  ? 'bg-red-500'
                                  : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                          ></div>
                        </div>
                        {Math.abs(totalPercentage - 100) >= 0.1 && (
                          <p className={`mt-2 text-sm ${
                            totalPercentage > 100
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {totalPercentage > 100
                              ? `Total percentage exceeds 100% by ${(totalPercentage - 100).toFixed(1)}%. Please adjust ingredient percentages.`
                              : `Total percentage is ${(100 - totalPercentage).toFixed(1)}% short of 100%. Please adjust ingredient percentages.`
                            }
                          </p>
                        )}
                      </div>

                      {/* Ingredients List */}
                      {Object.keys(ingredientsByPhase).length > 0 ? (
                        <div className="space-y-6">
                          {Object.entries(ingredientsByPhase).map(([phase, ingredients]) => (
                            <div key={phase} className="bg-gray-50 dark:bg-gray-750 rounded-lg overflow-hidden">
                              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-650">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300">{phase}</h4>
                              </div>
                              <div className="divide-y divide-gray-200 dark:divide-gray-650">
                                {ingredients.map((item) => (
                                  <div key={item.ingredient_id} className="p-4">
                                    <div className="flex flex-wrap justify-between">
                                      <div className="mb-2 md:mb-0">
                                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {item.ingredient?.name}
                                        </h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {item.ingredient?.inci_name}
                                        </p>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                          {item.ingredient?.function && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                              {item.ingredient.function}
                                            </span>
                                          )}
                                          {item.ingredient?.recommended_max_percentage && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                              Max: {item.ingredient.recommended_max_percentage}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center">
                                        {isEditing ? (
                                          <div className="relative w-24">
                                            <input
                                              type="number"
                                              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                              value={editedFormula.ingredients.find(i => i.ingredient_id === item.ingredient_id)?.percentage || 0}
                                              onChange={(e) => handleIngredientChange(item.ingredient_id, e.target.value)}
                                              min="0"
                                              max="100"
                                              step="0.1"
                                            />
                                            <span className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400">
                                              %
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {item.percentage}%
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {item.ingredient?.description && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                          {item.ingredient.description}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-lg">
                          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No ingredients</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            This formula doesn't have any ingredients yet.
                          </p>
                          {isEditing && (
                            <div className="mt-6">
                              <Link
                                to={`/formulas/create`}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
                              >
                                Add Ingredients
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manufacturing Steps Tab */}
                  {activeTab === 'steps' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Manufacturing Steps</h3>
                      </div>

                      {formula.steps && formula.steps.length > 0 ? (
                        <div className="space-y-4">
                          {formula.steps
                            .sort((a, b) => a.order - b.order)
                            .map((step, index) => (
                              <div key={step.id} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                <div className="flex">
                                  <div className="flex-shrink-0 mr-4">
                                    <span className="flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-lg font-medium">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div className="flex-grow">
                                    {isEditing ? (
                                      <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={editedFormula.steps.find(s => s.id === step.id)?.description || ''}
                                        onChange={(e) => handleStepChange(step.id, e.target.value)}
                                        rows="2"
                                      ></textarea>
                                    ) : (
                                      <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-lg">
                          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No manufacturing steps</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            This formula doesn't have any manufacturing steps yet.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Batch Calculator Tab */}
                  {activeTab === 'calculator' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Batch Calculator</h3>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Desired Batch Size (grams)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            defaultValue={formula.total_weight}
                            min="1"
                            step="1"
                            id="batch-size"
                          />
                          <button
                            className="ml-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md"
                            onClick={() => {
                              const batchSize = parseFloat(document.getElementById('batch-size').value);
                              if (batchSize > 0) {
                                const scaleFactor = batchSize / formula.total_weight;
                                const calculatorTable = document.getElementById('calculator-table');
                                
                                // Update all calculated amounts in the table
                                const rows = calculatorTable.querySelectorAll('tr');
                                rows.forEach(row => {
                                  const percentageCell = row.querySelector('[data-percentage]');
                                  if (percentageCell) {
                                    const percentage = parseFloat(percentageCell.getAttribute('data-percentage'));
                                    const amountCell = row.querySelector('[data-amount]');
                                    const scaledAmount = (percentage / 100 * formula.total_weight * scaleFactor).toFixed(2);
                                    amountCell.textContent = `${scaledAmount}g`;
                                    amountCell.setAttribute('data-amount', scaledAmount);
                                  }
                                });
                              }
                            }}
                          >
                            Calculate
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Enter your desired batch size to calculate the exact amount of each ingredient.
                        </p>
                      </div>
                      
                      {formula.ingredients && formula.ingredients.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" id="calculator-table">
                            <thead className="bg-gray-50 dark:bg-gray-750">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ingredient</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {formula.ingredients.map((item) => {
                                const baseAmount = (item.percentage / 100 * formula.total_weight).toFixed(2);
                                return (
                                  <tr key={item.ingredient_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {item.ingredient?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400" data-percentage={item.percentage}>
                                      {item.percentage}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100" data-amount={baseAmount}>
                                      {baseAmount}g
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr className="bg-gray-50 dark:bg-gray-750">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">Total</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                                  {totalPercentage.toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                                  {formula.total_weight}g
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add ingredients to your formula to use the batch calculator.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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

      {/* Export Formula Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                      Export Formula
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose a format to export your formula.
                      </p>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Export Format
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={exportFormat}
                          onChange={(e) => setExportFormat(e.target.value)}
                        >
                          <option value="pdf">PDF Document</option>
                          <option value="csv">CSV Spreadsheet</option>
                          <option value="json">JSON Format</option>
                          <option value="print">Printer-friendly Version</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleExport}
                >
                  Export
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowExportModal(false)}
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

};

export default FormulaDetail;