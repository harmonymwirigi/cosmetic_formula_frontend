// frontend/src/pages/settings/Plans.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { userAPI, paymentsAPI } from '../../services/api';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import FormulaUsageCard from '../../components/Dashboard/FormulaUsageCard';
import { toast } from 'react-toastify';

function Plans() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get plan from URL if available
    const params = new URLSearchParams(location.search);
    const planParam = params.get('plan');
    
    const fetchUserData = async () => {
      try {
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        // Set the selected plan based on current subscription
        setSelectedPlan(planParam || userResponse.data.subscription_type || 'free');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.search]);

  // Pricing plans data
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
    creator: {
      name: 'Creator',
      description: 'Perfect for enthusiasts',
      monthlyPrice: 12.99,
      annualPrice: 129.99,
      features: [
        { text: 'Up to 30 formulas', included: true },
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
    pro_lab: {
      name: 'Pro Lab',
      description: 'For serious formulators',
      monthlyPrice: 29.99,
      annualPrice: 299.99,
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

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Calculate savings for annual billing
  const calculateSavings = (planKey) => {
    if (!planKey || planKey === 'free') return 0;
    const plan = plans[planKey];
    if (!plan) return 0;
    
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice;
    return ((monthlyCost - annualCost) / monthlyCost * 100).toFixed(0);
  };

  // Get the user's current plan features for comparison
  const currentPlan = userData?.subscription_type || 'free';
  const currentPlanFeatures = plans[currentPlan]?.features || plans.free.features;

  // Handle subscription checkout - this is the function that was causing multiple triggers
  const handleSubscribe = async () => {
    // Prevent multiple submissions
    if (processingPayment) {
      return;
    }
    
    console.log('handleSubscribe called with plan:', selectedPlan, 'billing cycle:', billingCycle);
    
    // Map plan names to backend expected format
    const planMapping = {
      'free': 'free',
      'creator': 'premium',     // Map creator to premium
      'pro_lab': 'professional' // Map pro_lab to professional
    };
    
    if (!selectedPlan || selectedPlan === 'free') {
      // Just update the user's subscription to free
      try {
        setProcessingPayment(true);
        await userAPI.updateSubscription({ subscription_type: 'free' });
        toast.success('Subscription updated to Free plan');
        navigate('/');
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast.error('Failed to update subscription');
      } finally {
        setProcessingPayment(false);
      }
      return;
    }

    try {
      setProcessingPayment(true);
      // Store selected plan in localStorage to retrieve after checkout
      localStorage.setItem('selectedPlan', selectedPlan);
      localStorage.setItem('billingCycle', billingCycle);

      // Debug the request
      console.log('Creating checkout session with data:', {
        subscription_type: planMapping[selectedPlan] || selectedPlan,
        billing_cycle: billingCycle
      });

      // Create checkout session with mapped plan type
      const response = await paymentsAPI.createCheckoutSession({
        subscription_type: planMapping[selectedPlan] || selectedPlan,
        billing_cycle: billingCycle
      });

      // Debug the response
      console.log('Checkout session response:', response);

      // Add explicit check for checkout_url
      if (response.data && response.data.checkout_url) {
        console.log('Redirecting to:', response.data.checkout_url);
        
        // Force direct window location change instead of any router handling
        window.location.href = response.data.checkout_url;
        return; // Make sure no code runs after redirect
      } else {
        console.error('No checkout URL in response:', response);
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
      setProcessingPayment(false);
    }
  };

  // Function to handle plan selection - separating selection from subscription
  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
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
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Subscription Plans</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose the plan that best fits your formulation needs
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
                  <SettingsSidebar currentPage="plans" />
                  <div className="grow p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your Current Plan</h2>
                      
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          userData?.subscription_type === 'pro_lab'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                            : userData?.subscription_type === 'creator'
                              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {userData?.subscription_type ? (
                            userData.subscription_type === 'pro_lab' ? 'Pro Lab' : 
                            userData.subscription_type.charAt(0).toUpperCase() + userData.subscription_type.slice(1)
                          ) : 'Free'} Plan
                        </div>
                        
                        {userData?.subscription_expires_at && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Renews on: {new Date(userData.subscription_expires_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      {/* Formula Usage Card */}
                      <div className="mb-6">
                        <FormulaUsageCard compact={false} showButton={false} />
                      </div>
                    </div>
                    
                    {/* Billing cycle toggle */}
                    <div className="flex justify-center mb-8">
                      <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
                        <button
                          className={`py-2 px-4 rounded-md ${
                            billingCycle === 'monthly'
                              ? 'bg-white dark:bg-gray-600 shadow-sm text-violet-600 dark:text-violet-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                          onClick={() => setBillingCycle('monthly')}
                        >
                          Monthly
                        </button>
                        <button
                          className={`py-2 px-4 rounded-md ${
                            billingCycle === 'annual'
                              ? 'bg-white dark:bg-gray-600 shadow-sm text-violet-600 dark:text-violet-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                          onClick={() => setBillingCycle('annual')}
                        >
                          Annual <span className="text-green-500">(Save {calculateSavings(selectedPlan)}%)</span>
                        </button>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Available Plans</h2>
                    
                    {/* Plan cards with current plan highlight */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      {Object.entries(plans).map(([key, plan]) => {
                        const isCurrentPlan = currentPlan === key;
                        const isSelectedPlan = selectedPlan === key;
                        const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
                        
                        return (
                          <div
                            key={key}
                            className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                              isSelectedPlan ? 'shadow-lg border-2 border-violet-500 dark:border-violet-400' : 
                              'border border-gray-200 dark:border-gray-700'
                            } ${
                              isCurrentPlan && !isSelectedPlan ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                            }`}
                            onClick={() => handlePlanSelection(key)}
                          >
                            {/* Current plan badge */}
                            {isCurrentPlan && (
                              <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                Current Plan
                              </div>
                            )}
                            
                            {/* Popular badge for Creator plan */}
                            {key === 'creator' && !isCurrentPlan && (
                              <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                Most Popular
                              </div>
                            )}
                            
                            <div className="p-6">
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>
                              
                              <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(price)}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">
                                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                                </span>
                              </div>
                              
                              <div className="mb-6">
                                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-3">Included in this plan:</h3>
                                <ul className="space-y-3">
                                  {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                      {feature.included ? (
                                        <svg
                                          className="h-5 w-5 text-green-500 shrink-0 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          className="h-5 w-5 text-gray-400 dark:text-gray-600 shrink-0 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                      )}
                                      <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {feature.text}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* Feature comparison with current plan (if not current plan) */}
                              {!isCurrentPlan && (
                                <div className="mb-6 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-3">Compared to your current plan:</h3>
                                  
                                  {/* Additional features */}
                                  {plan.features.some((feature, idx) => feature.included && !currentPlanFeatures[idx]?.included) && (
                                    <div className="mb-3">
                                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Additional features:</p>
                                      <ul className="ml-5 mt-1 list-disc text-sm text-gray-600 dark:text-gray-400">
                                        {plan.features.map((feature, idx) => {
                                          // Only show features that are included in this plan but not in current plan
                                          if (feature.included && !currentPlanFeatures[idx]?.included) {
                                            return <li key={idx}>{feature.text}</li>;
                                          }
                                          return null;
                                        }).filter(Boolean)}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {/* Increased limits */}
                                  {key === 'creator' && currentPlan === 'free' && (
                                    <p className="text-sm text-amber-600 dark:text-amber-400">
                                      <span className="font-medium">Formula limit:</span> Increase from 3 to 30 formulas
                                    </p>
                                  )}
                                  
                                  {key === 'pro_lab' && (currentPlan === 'free' || currentPlan === 'creator') && (
                                    <p className="text-sm text-amber-600 dark:text-amber-400">
                                      <span className="font-medium">Formula limit:</span> Unlimited formulas (no restrictions)
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Add a single subscribe button controlled by selected plan */}
                    <div className="text-center mt-8">
                      <button
                        onClick={handleSubscribe}
                        disabled={processingPayment || !selectedPlan || (selectedPlan === currentPlan && selectedPlan !== 'free')}
                        className={`px-6 py-2 rounded-md font-medium ${
                          processingPayment ? 'bg-gray-400 text-white cursor-not-allowed' :
                          !selectedPlan || (selectedPlan === currentPlan && selectedPlan !== 'free') ? 
                            'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed' : 
                            'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        {processingPayment ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : selectedPlan === currentPlan ? (
                          'Current Plan'
                        ) : (
                          `Subscribe to ${plans[selectedPlan]?.name || ''} Plan${
                            selectedPlan && selectedPlan !== 'free' ? 
                            ` for ${formatPrice(billingCycle === 'monthly' ? plans[selectedPlan].monthlyPrice : plans[selectedPlan].annualPrice)}/${billingCycle === 'monthly' ? 'mo' : 'yr'}` : 
                            ''
                          }`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default Plans;