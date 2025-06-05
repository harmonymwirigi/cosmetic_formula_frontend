import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import FormulaWizard from '../components/Formulas/FormulaWizard';
import { FormulaProvider } from '../context/FormulaContext';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { userAPI, formulaAPI } from '../services/api';

/**
 * FormulaCreation page - Redesigned for questionnaire-based formula creation
 * Now focuses on AI-powered formula generation through comprehensive questionnaire
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
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
                {/* Subscription Alert */}
                {showSubscriptionAlert && (
                  <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
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

                {/* Enhanced Page Header */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h1 className="text-3xl md:text-4xl text-gray-800 dark:text-gray-100 font-bold">
                        Create Your Perfect Formula ✨
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                        Answer our smart questionnaire and let AI craft a personalized formula with the perfect name and ingredients for your needs.
                      </p>
                    </div>
                    
                    {/* User subscription badge */}
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        userData?.subscription_type === 'professional' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : userData?.subscription_type === 'premium'
                            ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {userData?.subscription_type?.toUpperCase() || 'FREE'} PLAN
                      </span>
                      
                      <div className="flex space-x-2">
                        <Link 
                          to="/formulas"
                          className="btn bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
                        >
                          <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                            <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z"></path>
                          </svg>
                          <span className="ml-2">All Formulas</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="text-green-600 dark:text-green-400 text-3xl mb-3">🤖</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">AI-Powered Names</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our advanced AI analyzes your needs and creates a perfect formula with a creative, market-ready name
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="text-blue-600 dark:text-blue-400 text-3xl mb-3">⚡</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">Lightning Fast</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get a complete formula in minutes, not hours of research and formulation work
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="text-purple-600 dark:text-purple-400 text-3xl mb-3">🎯</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">Fully Personalized</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tailored to your specific skin type, concerns, goals, and brand vision
                    </p>
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    How It Works
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-violet-600 dark:text-violet-400 font-bold text-lg">1</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Answer Questions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tell us about your skin, goals, preferences, and brand vision</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-violet-600 dark:text-violet-400 font-bold text-lg">2</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Our AI processes your responses and creates a custom formula</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-violet-600 dark:text-violet-400 font-bold text-lg">3</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Get Complete Formula</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive a formula with AI-generated name and detailed instructions</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-violet-600 dark:text-violet-400 font-bold text-lg">4</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Create & Refine</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Make your formula and adjust ingredients as needed</p>
                    </div>
                  </div>
                </div>

                {/* Subscription-specific features */}
                {userData?.subscription_type !== 'free' && (
                  <div className="mb-8 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
                    <div className="flex items-center mb-4">
                      <div className="text-violet-600 dark:text-violet-400 text-2xl mr-3">🔥</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {userData?.subscription_type?.toUpperCase()} Features Unlocked
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">AI-generated creative product names</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Advanced ingredient database</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Detailed manufacturing steps & documentation</span>
                      </div>
                      {userData?.subscription_type === 'professional' && (
                        <>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Marketing claims & brand positioning</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Regulatory compliance guidance</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Complete MSDS & SOP documentation</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Main content grid */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Left column - Formula Wizard */}
                  <div className="col-span-12 xl:col-span-8">
                    {/* Main Formula Wizard Component - Now using questionnaire */}
                    {!showSubscriptionAlert && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <FormulaWizard />
                      </div>
                    )}

                    {/* Subscription CTA (shown only when alert is visible) */}
                    {showSubscriptionAlert && (
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

                    {/* Enhanced Tips and Help */}
                    <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">AI Formula Creation Tips</h2>
                      </div>
                      <div className="p-5">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Getting Better Results</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <li>Be specific about your skin concerns and goals</li>
                              <li>Mention any favorite ingredients you want included</li>
                              <li>Specify ingredients to avoid (allergies, preferences)</li>
                              <li>Describe your ideal texture and experience</li>
                              <li>Share your brand vision for commercial products</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">After Generation</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <li>Review the AI-generated formula carefully</li>
                              <li>Test small batches before scaling up</li>
                              <li>You can edit ingredients and percentages later</li>
                              <li>Use the INCI list for proper labeling</li>
                              <li>Follow manufacturing steps for best results</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Recent formulas and resources */}
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

                    {/* AI Assistant Info */}
                    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
                      <div className="flex items-center mb-4">
                        <div className="text-violet-600 dark:text-violet-400 text-2xl mr-3">🧠</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Our AI analyzes your questionnaire responses to create personalized formulas with creative names that match your vision.
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

                    {/* Formulation Resources */}
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Formulation Resources</h2>
                      </div>
                      <div className="p-5">
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-violet-500">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Ingredient Database</h3>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Browse our comprehensive collection of ingredients with detailed information and compatibility data.
                              </p>
                              <Link 
                                to="/ingredients"
                                className="mt-1 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                              >
                                Explore ingredients →
                              </Link>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-violet-500">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Knowledge Base</h3>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Learn about cosmetic formulation principles, AI-assisted creation, and best practices.
                              </p>
                              <Link 
                                to="/knowledge-base"
                                className="mt-1 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                              >
                                Read articles →
                              </Link>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-violet-500">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Video Tutorials</h3>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Watch step-by-step tutorials on AI formula creation and cosmetic manufacturing.
                              </p>
                              <Link 
                                to="/tutorials"
                                className="mt-1 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                              >
                                Watch tutorials →
                              </Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Enhanced Subscription Status Card */}
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
                          
                          <div className="space-y-3">
                            {userData.subscription_type === 'free' && (
                              <>
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
                                  Free plan limited to 3 AI formulas. Upgrade for unlimited formulas with advanced naming and features.
                                </p>
                              </>
                            )}
                            
                            {userData.subscription_type !== 'free' && (
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Unlimited AI formulas</span>
                                </div>
                                <div className="flex items-center">
                                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Creative AI-generated names
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {userData.subscription_type === 'premium' ? 'Premium ingredients' : 'All ingredients & advanced features'}
                                  </span>
                                </div>
                                {userData.subscription_expires_at && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Renews on {new Date(userData.subscription_expires_at).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
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
                  &copy; {new Date().getFullYear()} BeautyCraft Formula Lab. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </FormulaProvider>
    </ProtectedRoute>
  );
};

export default FormulaCreation;