import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import { userAPI, paymentsAPI } from '../services/api';
import ProtectedRoute from '../components/shared/ProtectedRoute';

function Subscription() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Pricing plans
  const plans = {
    free: {
      name: 'Free',
      description: 'Essential tools for beginners',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { text: 'Up to 3 formulas', included: true },
        { text: 'Basic ingredients only', included: true },
        { text: 'Basic formula types', included: true },
        { text: 'Limited AI recommendations', included: true },
        { text: 'Export to PDF', included: true },
        { text: 'Premium ingredients', included: false },
        { text: 'Unlimited formulas', included: false },
        { text: 'Professional ingredients', included: false },
        { text: 'Advanced formula analysis', included: false },
      ]
    },
    premium: {
      name: 'Premium',
      description: 'Perfect for enthusiasts',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        { text: 'Unlimited formulas', included: true },
        { text: 'All basic ingredients', included: true },
        { text: 'Premium ingredients', included: true },
        { text: 'All formula types', included: true },
        { text: 'Advanced AI recommendations', included: true },
        { text: 'Export to multiple formats', included: true },
        { text: 'Formula version history', included: true },
        { text: 'Professional ingredients', included: false },
        { text: 'Advanced formula analysis', included: false },
      ]
    },
    professional: {
      name: 'Professional',
      description: 'For serious formulators',
      monthlyPrice: 24.99,
      annualPrice: 249.99,
      features: [
        { text: 'Unlimited formulas', included: true },
        { text: 'All basic ingredients', included: true },
        { text: 'All premium ingredients', included: true },
        { text: 'Professional ingredients', included: true },
        { text: 'All formula types', included: true },
        { text: 'Advanced AI recommendations', included: true },
        { text: 'Export to multiple formats', included: true },
        { text: 'Formula version history', included: true },
        { text: 'Advanced formula analysis', included: true },
      ]
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Set the selected plan based on current subscription
        setSelectedPlan(userResponse.data.subscription_type || 'free');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Check if a plan was specified in the URL params
    const searchParams = new URLSearchParams(location.search);
    const planParam = searchParams.get('plan');
    if (planParam && plans[planParam]) {
      setSelectedPlan(planParam);
    }
  }, [location.search]);

  // Calculate savings for annual billing
  const calculateSavings = (plan) => {
    if (!plan || plan === 'free') return 0;
    const monthlyCost = plans[plan].monthlyPrice * 12;
    const annualCost = plans[plan].annualPrice;
    return ((monthlyCost - annualCost) / monthlyCost * 100).toFixed(0);
  };

  // Handle subscription checkout
  const handleCheckout = async () => {
    if (!selectedPlan || selectedPlan === 'free') {
      return;
    }
    
    if (selectedPlan === userData?.subscription_type) {
      setShowConfirmationModal(true);
      return;
    }
    
    setProcessingPayment(true);
    setError(null);
    
    try {
      // Call payment API to initiate checkout
      const response = await paymentsAPI.createSubscription({
        plan: selectedPlan,
        billing_cycle: billingCycle
      });
      
      // Redirect to checkout URL from payment provider
      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Failed to initiate checkout:', error);
      setError('Failed to initiate checkout. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    setProcessingPayment(true);
    setError(null);
    
    try {
      // Call API to cancel subscription
      await paymentsAPI.cancelSubscription();
      
      // Refresh user data
      const userResponse = await userAPI.getUserStatus();
      setUserData(userResponse.data);
      setSelectedPlan(userResponse.data.subscription_type || 'free');
      
      // Close modal
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setProcessingPayment(false);
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
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Subscription Plans</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Choose the plan that best fits your formulation needs
                  </p>
                </div>

                {/* Right: Current Plan */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <div className={`px-4 py-2 rounded-lg ${
                    userData?.subscription_type === 'professional'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                      : userData?.subscription_type === 'premium'
                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    <span className="text-sm font-medium">
                      Current: {userData?.subscription_type ? userData.subscription_type.charAt(0).toUpperCase() + userData.subscription_type.slice(1) : 'Free'} Plan
                    </span>
                    {userData?.subscription_expires_at && (
                      <span className="text-xs block">
                        Renews: {new Date(userData.subscription_expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing toggle */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      Monthly Billing
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        billingCycle === 'annual' ? 'bg-violet-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                          billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      ></span>
                    </button>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        Annual Billing
                      </span>
                      <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Save {calculateSavings('premium')}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plans grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow ${
                  selectedPlan === 'free' ? 'ring-2 ring-violet-500 dark:ring-violet-400' : ''
                }`}>
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Free</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Essential tools for beginners</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">$0</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-3">
                      {plans.free.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setSelectedPlan('free')}
                      className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium focus:outline-none ${
                        selectedPlan === 'free'
                          ? 'bg-violet-600 text-white hover:bg-violet-700'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
                      }`}
                    >
                      {selectedPlan === 'free' ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow ${
                  selectedPlan === 'premium' ? 'ring-2 ring-violet-500 dark:ring-violet-400' : ''
                }`}>
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700 relative">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                        Popular
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Premium</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for enthusiasts</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        ${billingCycle === 'monthly' ? plans.premium.monthlyPrice : (plans.premium.annualPrice / 12).toFixed(2)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                      {billingCycle === 'annual' && (
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          Billed ${plans.premium.annualPrice} annually
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-3">
                      {plans.premium.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setSelectedPlan('premium')}
                      className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium focus:outline-none ${
                        selectedPlan === 'premium'
                          ? 'bg-violet-600 text-white hover:bg-violet-700'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
                      }`}
                    >
                      {selectedPlan === 'premium' && userData?.subscription_type === 'premium' 
                        ? 'Current Plan' 
                        : 'Select Plan'}
                    </button>
                  </div>
                </div>

                {/* Professional Plan */}
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow ${
                  selectedPlan === 'professional' ? 'ring-2 ring-violet-500 dark:ring-violet-400' : ''
                }`}>
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Professional</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">For serious formulators</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        ${billingCycle === 'monthly' ? plans.professional.monthlyPrice : (plans.professional.annualPrice / 12).toFixed(2)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                      {billingCycle === 'annual' && (
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          Billed ${plans.professional.annualPrice} annually
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-3">
                      {plans.professional.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          {feature.included ? (
                            <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setSelectedPlan('professional')}
                      className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium focus:outline-none ${
                        selectedPlan === 'professional'
                          ? 'bg-violet-600 text-white hover:bg-violet-700'
                          : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
                      }`}
                    >
                      {selectedPlan === 'professional' && userData?.subscription_type === 'professional' 
                        ? 'Current Plan' 
                        : 'Select Plan'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkout section */}
              <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Subscription Summary</h3>
                
                <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {plans[selectedPlan]?.name || 'Free'} Plan
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {billingCycle === 'annual' ? 'Annual' : 'Monthly'} billing
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        ${billingCycle === 'annual' 
                          ? plans[selectedPlan]?.annualPrice || 0 
                          : plans[selectedPlan]?.monthlyPrice || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {billingCycle === 'annual' ? 'per year' : 'per month'}
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-end mt-6 space-y-3 md:space-y-0 md:space-x-4">
                  {/* Show cancel button if user has an active subscription */}
                  {userData?.subscription_type && userData.subscription_type !== 'free' && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none"
                      disabled={processingPayment}
                    >
                      Cancel Subscription
                    </button>
                  )}
                  
                  {/* Show checkout button if selected plan is different from current subscription or it's not free */}
                  {(selectedPlan !== userData?.subscription_type || selectedPlan !== 'free') && (
                    <button
                      onClick={handleCheckout}
                      className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium focus:outline-none disabled:opacity-50"
                      disabled={processingPayment || selectedPlan === 'free'}
                    >
                      {processingPayment ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          {selectedPlan === userData?.subscription_type
                            ? 'Update Billing Cycle'
                            : 'Proceed to Checkout'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* FAQ section */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      How does billing work?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      You'll be charged immediately upon subscription, and then on the same date each month or year, depending on your billing cycle. You can cancel anytime.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Can I upgrade or downgrade my plan?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Yes, you can switch between plans at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the next billing cycle.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      What happens when I cancel?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      You'll maintain access to your paid features until the end of your current billing period. After that, your account will revert to the Free plan.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Is there a refund policy?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      If you're not satisfied with your subscription, contact us within 14 days of purchase for a full refund. For more details, please review our refund policy.
                    </p>
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

      {/* Plan Change Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                      Change Billing Cycle
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You're already subscribed to the {plans[selectedPlan]?.name} plan. Would you like to change your billing cycle from {userData?.billing_cycle === 'annual' ? 'annual' : 'monthly'} to {billingCycle === 'annual' ? 'annual' : 'monthly'}?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCheckout}
                >
                  Confirm Change
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                      Cancel Subscription
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to cancel your subscription? You'll continue to have access to your current features until the end of your billing period on {userData?.subscription_expires_at ? new Date(userData.subscription_expires_at).toLocaleDateString() : 'your next billing date'}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelSubscription}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Cancel Subscription'
                  )}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

export default Subscription;