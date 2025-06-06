import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import FormulaWizard from '../components/Formulas/FormulaWizard';
import { FormulaProvider } from '../context/FormulaContext';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { userAPI, formulaAPI } from '../services/api';

/**
 * FormulaCreation page - Clean, immediate formula creation
 * Removed overwhelming marketing content, starts directly with questionnaire
 */
const FormulaCreation = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);
  const [recentFormulas, setRecentFormulas] = useState([]);
  const [loadingRecentFormulas, setLoadingRecentFormulas] = useState(false);

  // Fetch user data and check subscription limits
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user status first
        const userResponse = await userAPI.getUserStatus();
        const user = userResponse.data;
        setUserData(user);

        // Check if free user has reached formula limit
        if (user.subscription_type === 'free') {
          try {
            const formulasResponse = await formulaAPI.getFormulas();
            const formulas = formulasResponse.data;
            
            if (formulas.length >= 3) {
              setShowSubscriptionAlert(true);
            }
            
            // Also set recent formulas for the sidebar
            setRecentFormulas(formulas.slice(0, 3));
          } catch (error) {
            console.error('Failed to fetch formulas:', error);
          }
        } else {
          // Fetch recent formulas for premium/professional users
          try {
            setLoadingRecentFormulas(true);
            const formulasResponse = await formulaAPI.getFormulas();
            if (formulasResponse && formulasResponse.data && Array.isArray(formulasResponse.data)) {
              setRecentFormulas(formulasResponse.data.slice(0, 3));
            } else {
              console.warn('Received invalid formulas data:', formulasResponse);
              setRecentFormulas([]);
            }
          } catch (error) {
            console.error('Failed to fetch recent formulas:', error);
            setRecentFormulas([]);
          } finally {
            setLoadingRecentFormulas(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  // Handle duplication of an existing formula
  const handleDuplicateFormula = async (formulaId) => {
    try {
      setLoading(true);
      const response = await formulaAPI.duplicateFormula(formulaId);
      navigate(`/formulas/${response.data.id}`);
    } catch (error) {
      console.error('Failed to duplicate formula:', error);
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
      <FormulaProvider>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

          {/* Content area */}
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Site header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

            <main className="grow">
              {/* Subscription Alert - Only show if user has reached limit */}
              {showSubscriptionAlert && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mx-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You have reached the limit of 3 formulas on the free plan. 
                        <Link to="/subscription" className="font-medium underline ml-1">
                          Upgrade your subscription
                        </Link> to create unlimited formulas with AI-powered names and advanced features.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main content grid */}
              <div className="grid grid-cols-12 gap-6 p-4">
                {/* Left column - Formula Wizard (takes most space) */}
                <div className="col-span-12 xl:col-span-8">
                  {/* Main Formula Wizard Component - Direct start */}
                  {!showSubscriptionAlert ? (
                    <FormulaWizard />
                  ) : (
                    /* Subscription CTA (shown only when alert is visible) */
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                      <div className="p-6 md:p-8 text-center">
                        <svg className="w-16 h-16 mx-auto text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Unlock AI Formula Creation</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                          Upgrade to create unlimited formulas with AI-generated names, premium ingredients, and advanced features.
                        </p>
                        <div className="mt-6">
                          <Link
                            to="/subscription"
                            className="inline-flex items-center px-6 py-3 rounded-md bg-violet-600 text-white hover:bg-violet-700 font-medium text-lg"
                          >
                            Upgrade Now
                          </Link>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 p-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">What You'll Get:</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex">
                            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Unlimited AI Formulas</span>
                          </div>
                          <div className="flex">
                            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Creative Product Names</span>
                          </div>
                          <div className="flex">
                            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Premium Ingredients</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column - Sidebar content (minimized) */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                  {/* Recent Formulas */}
                  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Formulas</h2>
                    </div>
                    <div className="p-3">
                      {loadingRecentFormulas ? (
                        <div className="flex justify-center p-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-500"></div>
                        </div>
                      ) : Array.isArray(recentFormulas) && recentFormulas.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {recentFormulas.map((formula) => (
                            <li key={formula.id || 'unknown'} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md">
                              <div className="flex justify-between items-center">
                                <div>
                                  <Link 
                                    to={`/formulas/${formula.id}`}
                                    className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                                  >
                                    {formula.name}
                                  </Link>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formula.type} · Created {new Date(formula.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex">
                                  <button
                                    onClick={() => handleDuplicateFormula(formula.id)}
                                    className="p-1 text-gray-400 hover:text-violet-500 dark:text-gray-500 dark:hover:text-violet-400"
                                    title="Duplicate formula"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          <p>No formulas created yet</p>
                          <p className="text-xs mt-1">Your AI-generated formulas will appear here</p>
                        </div>
                      )}
                      
                      <div className="mt-3 px-3">
                        <Link
                          to="/formulas"
                          className="block text-center text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                        >
                          View all formulas →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant Info - Minimized */}
                  <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
                    <div className="flex items-center mb-4">
                      <div className="text-violet-600 dark:text-violet-400 text-2xl mr-3">🧠</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Our AI analyzes your responses to create personalized formulas with creative names.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">Creative product naming</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">Intelligent ingredient selection</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">Personalized formulations</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="font-semibold text-gray-800 dark:text-gray-100">Quick Links</h2>
                    </div>
                    <div className="p-5">
                      <ul className="space-y-3">
                        <li>
                          <Link 
                            to="/ingredients"
                            className="flex items-center text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            Browse Ingredients
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/formulas"
                            className="flex items-center text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            My Formulas
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/knowledge"
                            className="flex items-center text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                            </svg>
                            Knowledge Hub
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Subscription Status */}
                  {userData && (
                    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border-t-4 ${
                      userData.subscription_type === 'free' 
                        ? 'border-gray-400' 
                        : userData.subscription_type === 'premium'
                          ? 'border-violet-500'
                          : 'border-purple-500'
                    }`}>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                            {userData.subscription_type === 'free' 
                              ? 'Free Plan' 
                              : userData.subscription_type === 'premium'
                                ? 'Premium Plan'
                                : 'Professional Plan'}
                          </h3>
                          {userData.subscription_type !== 'professional' && (
                            <Link 
                              to="/subscription"
                              className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                            >
                              Upgrade
                            </Link>
                          )}
                        </div>
                        
                        {userData.subscription_type === 'free' && (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">AI Formulas</span>
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {recentFormulas.length}/3
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-violet-600 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, (recentFormulas.length / 3) * 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Upgrade for unlimited formulas with AI naming
                            </p>
                          </div>
                        )}
                        
                        {userData.subscription_type !== 'free' && (
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span className="text-sm text-gray-600 dark:text-gray-300">Unlimited AI formulas</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span className="text-sm text-gray-600 dark:text-gray-300">Creative AI names</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </FormulaProvider>
    </ProtectedRoute>
  );
};

export default FormulaCreation;