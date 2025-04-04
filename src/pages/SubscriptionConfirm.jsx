import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { paymentsAPI, userAPI } from '../services/api';

function SubscriptionConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Extract parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get('plan');
    const billingCycle = searchParams.get('billing_cycle');

    if (!plan) {
      setStatus('error');
      setErrorMessage('Invalid subscription plan');
      return;
    }

    const confirmSubscription = async () => {
      try {
        // Call API to confirm subscription
        const response = await paymentsAPI.confirmSubscription({
          plan,
          billing_cycle: billingCycle || 'monthly',
        });

        // Update state with subscription data
        setSubscription(response.data.subscription);
        setStatus('success');

        // Fetch updated user data
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
      } catch (error) {
        console.error('Failed to confirm subscription:', error);
        setStatus('error');
        setErrorMessage(
          error.response?.data?.detail || 
          'An error occurred while confirming your subscription. Please contact support.'
        );
      }
    };

    confirmSubscription();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="text-4xl font-bold text-violet-600 dark:text-violet-400">
            CFL
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {status === 'processing' && 'Processing Your Subscription'}
          {status === 'success' && 'Subscription Confirmed!'}
          {status === 'error' && 'Subscription Error'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'processing' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Processing your subscription, please wait...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Payment Successful</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Thank you for subscribing to our {subscription?.plan ? (
                  <span className="capitalize font-medium">{subscription.plan}</span>
                ) : ''} plan!
              </p>
              {subscription?.expires_at && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your subscription is active until {new Date(subscription.expires_at).toLocaleDateString()}
                </p>
              )}
              <div className="mt-6">
                <Link
                  to="/dashboard"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Subscription Error</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {errorMessage}
              </p>
              <div className="mt-6">
                <Link
                  to="/subscription"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                >
                  Return to Subscription Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? <a href="mailto:support@cosmeticformulalab.com" className="font-medium text-violet-600 dark:text-violet-400 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionConfirm;