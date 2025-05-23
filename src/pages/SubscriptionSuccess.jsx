// frontend/src/pages/SubscriptionSuccess.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { paymentsAPI } from '../services/api';
import { toast } from 'react-toastify';

function SubscriptionSuccess() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        setLoading(true);
        // Get session_id from URL params
        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get('session_id');
        const subscriptionType = searchParams.get('subscription_type') || localStorage.getItem('selectedPlan');
        
        if (!sessionId) {
          setError('No session ID found in URL parameters');
          setLoading(false);
          return;
        }
        
        // Verify the session with the backend
        const response = await paymentsAPI.verifySession(sessionId, subscriptionType);
        
        if (response.data.success) {
          // Important: store updated user data in localStorage
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Trigger storage event to refresh components
          window.dispatchEvent(new Event('storage'));
          
          setUserData(response.data.user);
          
          // Map subscription types from backend to frontend display names
          const planDisplayMap = {
            'premium': 'Premium',
            'professional': 'Professional',
            'creator': 'Creator',
            'pro_lab': 'Pro Lab',
            'free': 'Free'
          };
          
          // Get the plan display name
          const planDisplay = planDisplayMap[response.data.user.subscription_type] || 
                             response.data.user.subscription_type.charAt(0).toUpperCase() + 
                             response.data.user.subscription_type.slice(1);
          
          // Properly handle the date parsing
          let expiresAt = null;
          let formattedDate = 'N/A';
          let billingCycle = 'monthly';
          
          try {
            if (response.data.user.subscription_expires_at) {
              expiresAt = new Date(response.data.user.subscription_expires_at);
              
              // Make sure the date is valid before using it
              if (!isNaN(expiresAt.getTime())) {
                formattedDate = expiresAt.toLocaleDateString();
                
                // Determine billing cycle based on expiration date
                // If it's more than ~11 months away, assume annual billing
                const monthsDiff = (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30);
                billingCycle = monthsDiff > 11 ? 'annual' : 'monthly';
              } else {
                console.error('Invalid date format received:', response.data.user.subscription_expires_at);
              }
            }
          } catch (error) {
            console.error('Error parsing date:', error);
          }
          
          setSubscriptionDetails({
            plan: planDisplay,
            planType: response.data.user.subscription_type,
            billingCycle,
            expiresAt: formattedDate
          });
          
          // Show successful toast notification
          toast.success(`Subscription updated to ${planDisplay} plan!`);
          
          // Clear any stored plan info
          localStorage.removeItem('selectedPlan');
          localStorage.removeItem('billingCycle');
        } else {
          setError('Failed to verify subscription. Please contact support.');
        }
      } catch (err) {
        console.error('Error verifying subscription:', err);
        setError('An error occurred while verifying your subscription. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [location.search]);

  // Get plan features based on subscription type
  const getPlanFeatures = () => {
    if (!subscriptionDetails) return [];
    
    const planFeatures = {
      free: [
        '3 formulas',
        'Basic ingredients only',
        'Limited AI recommendations',
        'PDF export'
      ],
      premium: [
        '30 formulas',
        'All basic ingredients',
        'Premium ingredients',
        'Advanced AI recommendations',
        'Multiple export formats',
        'Formula version history'
      ],
      creator: [
        '30 formulas',
        'All basic ingredients',
        'Premium ingredients',
        'Advanced AI recommendations',
        'Multiple export formats',
        'Formula version history'
      ],
      professional: [
        'Unlimited formulas',
        'All basic ingredients',
        'All premium ingredients',
        'Professional ingredients',
        'Advanced AI recommendations',
        'Multiple export formats',
        'Formula version history',
        'Advanced formula analysis'
      ],
      pro_lab: [
        'Unlimited formulas',
        'All basic ingredients',
        'All premium ingredients',
        'Professional ingredients',
        'Advanced AI recommendations',
        'Multiple export formats',
        'Formula version history',
        'Advanced formula analysis'
      ]
    };
    
    return planFeatures[subscriptionDetails.planType.toLowerCase()] || [];
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Subscription Error</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                  <Link to="/settings/plans" className="inline-flex items-center px-4 py-2 bg-violet-600 border border-transparent rounded-md font-semibold text-white hover:bg-violet-700">
                    Return to Subscription Page
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Subscription Confirmed!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Thank you for subscribing to Cosmetic Formula Lab. Your subscription has been successfully activated.
                  </p>

                  {subscriptionDetails && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mb-6 max-w-md mx-auto">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Subscription Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-left text-gray-500 dark:text-gray-400">Plan:</div>
                        <div className="text-right font-medium text-gray-900 dark:text-gray-100">
                          {subscriptionDetails.plan}
                        </div>
                        <div className="text-left text-gray-500 dark:text-gray-400">Billing Cycle:</div>
                        <div className="text-right font-medium text-gray-900 dark:text-gray-100">
                          {subscriptionDetails.billingCycle === 'annual' ? 'Annual' : 'Monthly'}
                        </div>
                        <div className="text-left text-gray-500 dark:text-gray-400">Next Billing Date:</div>
                        <div className="text-right font-medium text-gray-900 dark:text-gray-100">
                          {subscriptionDetails.expiresAt}
                        </div>
                      </div>
                      
                      {/* Show plan features */}
                      <div className="mt-4 text-left">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Plan Features:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {getPlanFeatures().map((feature, index) => (
                            <li key={index} className="text-gray-600 dark:text-gray-400 text-sm">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link to="/" className="inline-flex items-center px-4 py-2 bg-violet-600 border border-transparent rounded-md font-semibold text-white hover:bg-violet-700">
                      Go to Dashboard
                    </Link>
                    <Link to="/formulas/create" className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Create New Formula
                    </Link>
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

export default SubscriptionSuccess;