import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';

function Feedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackType, setFeedbackType] = useState('feature');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userAPI.getUserStatus();
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      setError('Please enter your feedback');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation, you would send this feedback to your API
      // await api.post('/feedback', { type: feedbackType, message: feedbackText });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFeedbackText('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFeedbackType('feature');
    setFeedbackText('');
    setError(null);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Feedback</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Help us improve Cosmetic Formula Lab with your feedback
              </p>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <SettingsSidebar currentPage="feedback" />
                  <div className="grow p-6">
                    {submitted ? (
                      <div className="text-center py-8">
                        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Thank You for Your Feedback!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Your feedback has been received and will help us improve Cosmetic Formula Lab.
                        </p>
                        <button
                          onClick={handleReset}
                          className="btn bg-violet-500 hover:bg-violet-600 text-white"
                        >
                          Submit Another Feedback
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Send Us Your Feedback</h2>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            We're constantly working to improve Cosmetic Formula Lab and your feedback is invaluable to us. 
                            Please let us know about your experience, feature requests, or any issues you've encountered.
                          </p>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Feedback Type
                            </label>
                            <select
                              value={feedbackType}
                              onChange={e => setFeedbackType(e.target.value)}
                              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2"
                            >
                              <option value="feature">Feature Request</option>
                              <option value="bug">Bug Report</option>
                              <option value="improvement">Improvement Suggestion</option>
                              <option value="experience">User Experience</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Your Feedback
                            </label>
                            <textarea
                              value={feedbackText}
                              onChange={e => setFeedbackText(e.target.value)}
                              rows={6}
                              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2"
                              placeholder="Please describe your feedback in detail..."
                            ></textarea>
                          </div>
                          
                          {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                          )}
                          
                          <button
                            type="submit"
                            className="btn bg-violet-500 hover:bg-violet-600 text-white"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                              </span>
                            ) : (
                              'Submit Feedback'
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Feedback;