//frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { userAPI, formulaAPI, ingredientAPI } from '../services/api';
import StatCard from '../components/Dashboard/StatCard';
import UpgradeModal from '../components/Dashboard/UpgradeModal';
import FormulaUsageCard from '../components/Dashboard/FormulaUsageCard';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [recentFormulas, setRecentFormulas] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [ingredientStats, setIngredientStats] = useState({ total: 0, premium: 0, professional: 0 });
  const [loading, setLoading] = useState(true);
  const [formulaChartData, setFormulaChartData] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  // Formula limits by subscription type
  const formulaLimits = {
    free: 3,
    creator: 30,
    pro_lab: Infinity
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Retrieve user data from localStorage first for quick rendering
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Stored user data:", parsedUser);
          setUserData(parsedUser);
        }

        // Fetch latest user status from backend
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        localStorage.setItem('user', JSON.stringify(userResponse.data));

        // If we don't have a first name, get full user details
        if (!userResponse.data.first_name) {
          try {
            const fullUserResponse = await userAPI.getCurrentUser();
            if (fullUserResponse.data) {
              // Merge the data
              const mergedUserData = { 
                ...userResponse.data, 
                ...fullUserResponse.data 
              };
              setUserData(mergedUserData);
              localStorage.setItem('user', JSON.stringify(mergedUserData));
            }
          } catch (error) {
            console.error('Failed to fetch full user details:', error);
          }
        }

        // Fetch all formulas
        const formulasResponse = await formulaAPI.getFormulas();
        const formulas = Array.isArray(formulasResponse.data) ? formulasResponse.data : [];
                
        // Set all formulas
        setFormulas(formulas);
                
        // Set recent formulas (just the first 5)
        const recentFormulasWithDetails = formulas.slice(0, 5).map(formula => {
          // If formula has no ingredients array or it's empty, set it to an empty array
          return {
            ...formula,
            ingredients: formula.ingredients || []
          };
        });
        setRecentFormulas(recentFormulasWithDetails);
        
        // Check if user is approaching formula limit
        const currentPlan = userResponse.data?.subscription_type || 'free';
        const formulaLimit = formulaLimits[currentPlan] || 3;
        
        // If user has used 80% or more of their formula limit and they're on free/creator plan,
        // show the upgrade modal
        if ((currentPlan === 'free' || currentPlan === 'creator') && 
            formulaLimit !== Infinity && 
            formulas.length >= Math.floor(formulaLimit * 0.8)) {
          setShowUpgradeModal(true);
        }
        
        // Prepare monthly stats for chart
        const monthlyStats = formulas.length > 0 ? formulas.reduce((acc, formula) => {
          const date = new Date(formula.created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        }, {}) : {};
        
        // Convert to array format for charting
        const chartData = Object.entries(monthlyStats).map(([month, count]) => ({
          month,
          count
        }));
        setFormulaChartData(chartData);

        // Fetch ingredient stats
        const ingredientsResponse = await ingredientAPI.getIngredients();
        const ingredients = ingredientsResponse.data;
        
        setIngredientStats({
          total: ingredients.length,
          premium: ingredients.filter(i => i.is_premium).length,
          professional: ingredients.filter(i => i.is_professional).length
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // If token is invalid, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Helper function to determine color scheme based on formula usage
  const getUsageColorScheme = (count, limit) => {
    const percentage = count / limit;
    
    if (percentage >= 0.9) return 'bg-red-500 text-red-600 dark:text-red-400';
    if (percentage >= 0.7) return 'bg-amber-500 text-amber-600 dark:text-amber-400';
    return 'bg-violet-500 text-green-600 dark:text-green-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  // Determine subscription features
  const subscriptionFeatures = {
    free: {
      maxFormulas: 3,
      ingredientAccess: 'Basic ingredients only',
      aiRecommendations: 'Basic recommendations'
    },
    creator: {
      maxFormulas: 30,
      ingredientAccess: 'Premium ingredients included',
      aiRecommendations: 'Advanced recommendations'
    },
    pro_lab: {
      maxFormulas: 'Unlimited',
      ingredientAccess: 'All ingredients including professional grade',
      aiRecommendations: 'Professional-level AI formulation assistance'
    }
  };

  const currentPlan = userData?.subscription_type || 'free';
  const features = subscriptionFeatures[currentPlan] || subscriptionFeatures.free;
  const formulaLimit = formulaLimits[currentPlan] || 3;
  const formulaCount = formulas.length;
  const formulaPercentage = formulaLimit === Infinity ? 0 : (formulaCount / formulaLimit) * 100;
  const isNearLimit = formulaLimit !== Infinity && formulaCount >= Math.floor(formulaLimit * 0.7);
  
  // Helper function to format formula count display
  const getFormulaCountDisplay = () => {
    if (formulaLimit === Infinity) return `${formulaCount} / Unlimited`;
    return `${formulaCount} / ${formulaLimit}`;
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        userData={userData} 
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          userData={userData} 
        />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Welcome, {userData?.first_name || userData?.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subscription: <span className="capitalize font-medium">{userData?.subscription_type || 'Free'} Plan</span>
                </p>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <Link 
                  to="/formulas/create" 
                  className="btn bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <svg className="fill-current shrink-0 mr-2" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7h-6V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span>Create Formula</span>
                </Link>                
              </div>
            </div>

            {/* Formula Stats Section */}
            <div className="grid grid-cols-12 gap-6">
              {/* Formula Count with improved color coding and alerts */}
              <div className="col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
                <FormulaUsageCard compact={false} showButton={true} />
              </div>


              {/* Available Ingredients */}
              <div className="col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
    <div className="p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Ingredients</h3>
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {ingredientStats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {features.ingredientAccess}
          </div>
        </div>
      </div>
    </div>
    <div className="w-full h-1 bg-green-500"></div>
  </div>

              {/* Subscription Plan */}
              <div className="col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription Plan</h3>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentPlan === 'free' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                        : currentPlan === 'creator'
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 capitalize">
                        {currentPlan === 'pro_lab' ? 'Pro Lab' : currentPlan}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {userData?.subscription_expires_at 
                          ? `Renews on ${new Date(userData.subscription_expires_at).toLocaleDateString()}`
                          : 'Upgrade for premium features'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Always show upgrade/manage button */}
                  <div className="mt-4">
                    <Link 
                      to="/subscription" 
                      className={`w-full btn text-white text-center ${
                        currentPlan === 'free' || currentPlan === 'creator'
                          ? 'bg-violet-600 hover:bg-violet-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {currentPlan === 'free' || currentPlan === 'creator'
                        ? 'Upgrade Plan'
                        : 'Manage Subscription'}
                    </Link>
                  </div>
                </div>
                <div className={`w-full h-1 ${
                  currentPlan === 'free' 
                    ? 'bg-blue-500' 
                    : currentPlan === 'creator'
                      ? 'bg-violet-500'
                      : 'bg-amber-500'
                }`}></div>
              </div>

              {/* Recent Formulas List */}
              <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Formulas</h2>
                  <Link to="/formulas" className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                    View All →
                  </Link>
                </header>
                <div className="p-3">
                  {recentFormulas.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full">
                        <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-sm">
                          <tr>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Name</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Type</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Created</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">Ingredients</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-center">Actions</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                          {recentFormulas.map((formula) => (
                            <tr key={formula.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="p-2 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="font-medium text-gray-800 dark:text-gray-100">
                                    <Link to={`/formulas/${formula.id}`} className="hover:text-violet-500">
                                      {formula.name}
                                    </Link>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-left">{formula.type}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-left text-gray-500 dark:text-gray-400">
                                  {new Date(formula.created_at).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-left">
                                  {typeof formula.ingredients === 'number' 
                                    ? formula.ingredients 
                                    : (Array.isArray(formula.ingredients) 
                                      ? formula.ingredients.length 
                                      : 0)}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="flex justify-center space-x-2">
                                  <Link 
                                    to={`/formulas/${formula.id}`}
                                    className="btn-xs bg-violet-100 text-violet-600 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400"
                                  >
                                    View
                                  </Link>
                                  <button
                                    onClick={() => navigate(`/formulas/${formula.id}/edit`)}
                                    className="btn-xs bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No formulas yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Create your first cosmetic formula to get started
                      </p>
                      <Link
                        to="/formulas/create"
                        className="btn bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        Create Formula
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription Details */}
              <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">Subscription Details</h2>
                </header>
                <div className="p-5">
                  <div className={`px-4 py-3 rounded-lg mb-4 ${
                    currentPlan === 'free'
                      ? 'bg-gray-100 dark:bg-gray-700/50'
                      : currentPlan === 'creator'
                        ? 'bg-violet-50 dark:bg-violet-900/20'
                        : 'bg-amber-50 dark:bg-amber-900/20'
                  }`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        currentPlan === 'free'
                          ? 'bg-gray-400 dark:bg-gray-600'
                          : currentPlan === 'creator'
                            ? 'bg-violet-500 dark:bg-violet-600'
                            : 'bg-amber-500 dark:bg-amber-600'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                          {currentPlan === 'pro_lab' ? 'Pro Lab' : currentPlan} Plan
                        </h3>
                        {userData?.subscription_expires_at && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Renews on {new Date(userData.subscription_expires_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Plan Features</h4>
                  <ul className="space-y-2 mb-5">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Formulas: {features.maxFormulas}</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{features.ingredientAccess}</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{features.aiRecommendations}</span>
                    </li>
                  </ul>

                  {/* Show upgrade button with more emphasis when needed */}
                  {currentPlan === 'free' && (
                    <Link 
                      to="/subscription" 
                      className={`w-full btn ${
                        isNearLimit
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : 'bg-violet-600 hover:bg-violet-700'
                      } text-white text-center`}
                    >
                      {isNearLimit ? 'Upgrade Now - Almost at Limit!' : 'Upgrade Now'}
                    </Link>
                  )}
                  
                  {currentPlan === 'creator' && (
                    <>
                      <Link 
                        to="/subscription?plan=pro_lab" 
                        className="w-full btn mb-2 bg-amber-500 hover:bg-amber-600 text-white text-center"
                      >
                        Upgrade to Pro Lab
                      </Link>
                      <Link 
                        to="/settings/billing" 
                        className="w-full btn bg-white border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300 text-center"
                      >
                        Manage Subscription
                      </Link>
                    </>
                  )}

                  {currentPlan === 'pro_lab' && (
                    <Link 
                      to="/settings/billing" 
                      className="w-full btn bg-white border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300 text-center"
                    >
                      Manage Subscription
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick action buttons based on formula count */}
            
          </div>
        </main>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                        Formula Limit {formulaPercentage >= 100 ? 'Reached' : 'Approaching'}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You're currently using {formulaCount} of {formulaLimit} formulas available in your {currentPlan === 'free' ? 'Free' : 'Creator'} plan.
                          {formulaPercentage >= 100 ? 
                            " You've reached your formula limit." : 
                            " You're approaching your formula limit."}
                        </p>
                        <div className="mt-4 mb-2">
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                              <div style={{ width: `${Math.min(formulaPercentage, 100)}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                formulaPercentage >= 90 ? 'bg-red-500' : 'bg-amber-500'
                              }`}></div>
                            </div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                            {formulaCount} / {formulaLimit} formulas used
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
                          Upgrade to {currentPlan === 'free' ? 'Creator Plan' : 'Pro Lab Plan'} to get {currentPlan === 'free' ? 'more' : 'unlimited'} formulas and access to {currentPlan === 'free' ? 'premium' : 'professional'} ingredients.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Link
                    to={`/subscription${currentPlan === 'creator' ? '?plan=pro_lab' : ''}`}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Upgrade Now
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Remind Me Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
  );
}

export default Dashboard;