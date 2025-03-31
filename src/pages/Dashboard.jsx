import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { userAPI, formulaAPI, ingredientAPI } from '../services/api';
import StatCard from '../components/Dashboard/StatCard';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [recentFormulas, setRecentFormulas] = useState([]);
  const [ingredientStats, setIngredientStats] = useState({ total: 0, premium: 0, professional: 0 });
  const [loading, setLoading] = useState(true);
  const [formulaChartData, setFormulaChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Retrieve user data from localStorage first for quick rendering
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }

        // Fetch latest user status from backend
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        localStorage.setItem('user', JSON.stringify(userResponse.data));

        // Fetch recent formulas
        const formulasResponse = await formulaAPI.getFormulas();
        const formulas = formulasResponse.data;
        setRecentFormulas(formulas.slice(0, 5)); // Get top 5 recent formulas

        // Get formula creation stats for chart data
        const monthlyStats = formulas.reduce((acc, formula) => {
          const date = new Date(formula.created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        }, {});
        
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
    premium: {
      maxFormulas: 'Unlimited',
      ingredientAccess: 'Premium ingredients included',
      aiRecommendations: 'Advanced recommendations'
    },
    professional: {
      maxFormulas: 'Unlimited',
      ingredientAccess: 'All ingredients including professional grade',
      aiRecommendations: 'Professional-level AI formulation assistance'
    }
  };

  const currentPlan = userData?.subscription_type || 'free';
  const features = subscriptionFeatures[currentPlan];

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
                  Welcome, {userData?.first_name || 'User'}
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
  {/* Formula Count */}
  <div className="col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden">
    <div className="p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">My Formulas</h3>
        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {recentFormulas.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total formulas created
          </div>
        </div>
        <div className={`text-sm font-medium ${
          currentPlan === 'free' && recentFormulas.length >= 3 
            ? 'text-amber-600 dark:text-amber-400' 
            : 'text-green-600 dark:text-green-400'
        }`}>
          {currentPlan === 'free' ? `${recentFormulas.length}/3` : 'Unlimited'}
        </div>
      </div>
    </div>
    <div 
      className="w-full h-1 bg-violet-500" 
      style={{ 
        width: currentPlan === 'free' ? `${(recentFormulas.length / 3) * 100}%` : '100%',
        minWidth: '5%' 
      }}
    ></div>
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
            : currentPlan === 'premium'
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
            {currentPlan}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {userData?.subscription_expires_at 
              ? `Renews on ${new Date(userData.subscription_expires_at).toLocaleDateString()}`
              : 'Upgrade for premium features'}
          </div>
        </div>
      </div>
    </div>
    <div className={`w-full h-1 ${
      currentPlan === 'free' 
        ? 'bg-blue-500' 
        : currentPlan === 'premium'
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
                                <div className="text-left">{formula.ingredients?.length || 0}</div>
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
                      : currentPlan === 'premium'
                        ? 'bg-violet-50 dark:bg-violet-900/20'
                        : 'bg-amber-50 dark:bg-amber-900/20'
                  }`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        currentPlan === 'free'
                          ? 'bg-gray-400 dark:bg-gray-600'
                          : currentPlan === 'premium'
                            ? 'bg-violet-500 dark:bg-violet-600'
                            : 'bg-amber-500 dark:bg-amber-600'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">{currentPlan} Plan</h3>
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

                  {currentPlan === 'free' && (
                    <Link 
                      to="/subscription" 
                      className="w-full btn bg-violet-600 hover:bg-violet-700 text-white text-center"
                    >
                      Upgrade Now
                    </Link>
                  )}

                  {(currentPlan === 'premium' || currentPlan === 'professional') && (
                    <Link 
                      to="/settings/billing" 
                      className="w-full btn bg-white border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300 text-center"
                    >
                      Manage Subscription
                    </Link>
                  )}
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">Quick Links</h2>
                </header>
                <div className="p-3">
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700/60">
                    <li className="p-2">
                      <Link to="/formulas/create" className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded">
                        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Create New Formula</span>
                      </Link>
                    </li>
                    <li className="p-2">
                      <Link to="/ingredients" className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Browse Ingredients</span>
                      </Link>
                    </li>
                    <li className="p-2">
                      <Link to="/ai-formula-generator" className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">AI Formula Generator</span>
                      </Link>
                    </li>
                    <li className="p-2">
                      <Link to="/knowledge-base" className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Knowledge Base</span>
                      </Link>
                    </li>
                    <li className="p-2">
                      <Link to="/settings/account" className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Account Settings</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Ingredient Stats Card */}
              <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">Ingredient Access</h2>
                </header>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Ingredients</div>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{ingredientStats.total}</div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Basic Ingredients Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Basic Ingredients</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {ingredientStats.total - ingredientStats.premium - ingredientStats.professional}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ 
                          width: `${((ingredientStats.total - ingredientStats.premium - ingredientStats.professional) / ingredientStats.total) * 100}%` 
                        }}></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Available on all plans
                      </div>
                    </div>

                    {/* Premium Ingredients Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium Ingredients</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {ingredientStats.premium}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className={`${currentPlan === 'free' ? 'bg-gray-400 dark:bg-gray-600' : 'bg-violet-500'} h-2.5 rounded-full`} style={{ 
                          width: `${(ingredientStats.premium / ingredientStats.total) * 100}%` 
                        }}></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {currentPlan === 'free' ? 'Locked - Requires Premium Plan' : 'Included in your plan'}
                      </div>
                    </div>

                    {/* Professional Ingredients Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Professional Ingredients</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {ingredientStats.professional}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className={`${currentPlan === 'professional' ? 'bg-amber-500' : 'bg-gray-400 dark:bg-gray-600'} h-2.5 rounded-full`} style={{ 
                          width: `${(ingredientStats.professional / ingredientStats.total) * 100}%` 
                        }}></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {currentPlan === 'professional' ? 'Included in your plan' : 'Locked - Requires Professional Plan'}
                      </div>
                    </div>
                  </div>

                  {currentPlan === 'free' && (
                    <div className="mt-6">
                      <Link 
                        to="/subscription" 
                        className="w-full btn bg-violet-600 hover:bg-violet-700 text-white text-center"
                      >
                        Upgrade for More Ingredients
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Tips Card */}
              <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">Tips & Resources</h2>
                </header>
                <div className="p-5">
                  <ul className="space-y-3">
                    <li className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">Getting Started</div>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">
                        New to formulation? Learn the basics of creating your first formula.
                      </p>
                      <Link 
                        to="/knowledge-base/getting-started" 
                        className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline"
                      >
                        Read the guide →
                      </Link>
                    </li>
                    <li className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="font-medium text-green-700 dark:text-green-400 mb-1">Ingredient Selection</div>
                      <p className="text-sm text-green-600 dark:text-green-300 mb-2">
                        How to choose the right ingredients for your specific formula type.
                      </p>
                      <Link 
                        to="/knowledge-base/ingredient-selection" 
                        className="text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
                      >
                        Learn more →
                      </Link>
                    </li>
                    <li className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="font-medium text-amber-700 dark:text-amber-400 mb-1">Formula Troubleshooting</div>
                      <p className="text-sm text-amber-600 dark:text-amber-300 mb-2">
                        Common issues and how to fix them in your formulations.
                      </p>
                      <Link 
                        to="/knowledge-base/troubleshooting" 
                        className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        View solutions →
                      </Link>
                    </li>
                  </ul>
                </div>
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
  );
}

export default Dashboard;