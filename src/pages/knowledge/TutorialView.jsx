// src/pages/knowledge/TutorialView.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../../partials/Header';
import Sidebar from '../../partials/Sidebar';
import { userAPI, knowledgeAPI } from '../../services/api';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import ReactMarkdown from 'react-markdown';

function TutorialView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tutorial, setTutorial] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // Fetch user data and tutorial
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch tutorial details
        const tutorialResponse = await knowledgeAPI.getTutorial(id);
        setTutorial(tutorialResponse.data);
        
        // Fetch user progress for this tutorial
        if (tutorialResponse.data.user_progress) {
          setUserProgress(tutorialResponse.data.user_progress);
          setCurrentStepIndex(tutorialResponse.data.user_progress.current_step - 1);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load tutorial');
        
        // Show subscribe modal if access denied due to subscription level
        if (error.response?.status === 403) {
          setShowSubscribeModal(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle moving to the next step
  const handleNextStep = async () => {
    if (!tutorial || currentStepIndex >= tutorial.steps.length - 1) return;
    
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    
    // Update progress in the backend
    try {
      const response = await knowledgeAPI.updateTutorialProgress(tutorial.id, {
        current_step: nextIndex + 1,
        is_completed: nextIndex === tutorial.steps.length - 1
      });
      setUserProgress(response.data);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  // Handle moving to the previous step
  const handlePreviousStep = () => {
    if (!tutorial || currentStepIndex <= 0) return;
    setCurrentStepIndex(currentStepIndex - 1);
  };

  // Handle completing the tutorial
  const handleCompleteTutorial = async () => {
    if (!tutorial) return;
    
    try {
      await knowledgeAPI.updateTutorialProgress(tutorial.id, {
        current_step: tutorial.steps.length,
        is_completed: true
      });
      
      // Redirect to completion page or show completion modal
      navigate(`/knowledge/tutorials/${id}/completed`);
    } catch (error) {
      console.error('Failed to mark tutorial as completed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error && !showSubscribeModal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-center text-gray-900 dark:text-gray-100 mb-2">Error Loading Tutorial</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link to="/knowledge/tutorials" className="btn bg-violet-600 hover:bg-violet-700 text-white">
              Return to Tutorials
            </Link>
          </div>
        </div>
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
            {showSubscribeModal ? (
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Premium Tutorial
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        This tutorial is available exclusively to {tutorial?.is_professional ? 'Professional' : 'Premium'} subscribers. Upgrade your subscription to unlock this and other premium tutorials.
                      </p>
                      <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                        <Link 
                          to="/subscription" 
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                        >
                          Upgrade Subscription
                        </Link>
                        <button
                          onClick={() => navigate('/knowledge/tutorials')}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                        >
                          Return to Tutorials
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : tutorial && (
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
                {/* Tutorial navigation */}
                <div className="mb-6">
                  <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/knowledge" className="hover:text-gray-900 dark:hover:text-gray-200">
                      Knowledge Hub
                    </Link>
                    <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <Link to="/knowledge/tutorials" className="hover:text-gray-900 dark:hover:text-gray-200">
                      Tutorials
                    </Link>
                    <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900 dark:text-gray-200">{tutorial.title}</span>
                  </nav>
                </div>

                {/* Tutorial content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  {/* Tutorial header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {tutorial.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-violet-600 h-2.5 rounded-full" 
                          style={{ width: `${((currentStepIndex + 1) / tutorial.steps.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Step {currentStepIndex + 1} of {tutorial.steps.length}
                      </span>
                    </div>
                  </div>

                  {/* Current step content */}
                  <div className="p-6">
                    {tutorial.steps[currentStepIndex] && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                          {tutorial.steps[currentStepIndex].title}
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown>
                            {tutorial.steps[currentStepIndex].content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <button
                      onClick={handlePreviousStep}
                      disabled={currentStepIndex === 0}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                        currentStepIndex === 0
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                    >
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    {currentStepIndex < tutorial.steps.length - 1 ? (
                      <button
                        onClick={handleNextStep}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                      >
                        Next
                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={handleCompleteTutorial}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        Complete Tutorial
                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tutorial steps sidebar */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Tutorial Steps
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tutorial.steps.map((step, index) => (
                      <li key={index}>
                        <button
                          onClick={() => setCurrentStepIndex(index)}
                          className={`w-full text-left px-4 py-3 flex items-center ${
                            currentStepIndex === index
                              ? 'bg-violet-50 dark:bg-violet-900/20'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                          }`}
                        >
                          <div className={`flex-shrink-0 mr-3 w-6 h-6 flex items-center justify-center rounded-full ${
                            index < currentStepIndex
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : currentStepIndex === index
                                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {index < currentStepIndex ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {step.title}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
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
    </ProtectedRoute>
  );
}

export default TutorialView;