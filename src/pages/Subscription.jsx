import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentsAPI, userAPI } from '../services/api';
import HeaderLogo from '../partials/HeaderLogo';
import { toast } from 'react-toastify';

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState('creator');
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get plan from URL if available
    const params = new URLSearchParams(location.search);
    const planParam = params.get('plan');
    if (planParam && ['free', 'creator', 'pro_lab'].includes(planParam)) {
      setSelectedPlan(planParam);
    }

    // Get current user data
    const fetchUserData = async () => {
      try {
        const response = await userAPI.getUserStatus();
        setUserData(response.data);
        setCurrentPlan(response.data.subscription_type || 'free');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [location.search]);

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

  const handleSubscribe = async () => {
    if (selectedPlan === 'free') {
      // Just update the user's subscription to free
      try {
        setLoading(true);
        await userAPI.updateSubscription({ subscription_type: 'free' });
        toast.success('Subscription updated to Free plan');
        navigate('/');
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast.error('Failed to update subscription');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      // Store selected plan in localStorage to retrieve after checkout
      localStorage.setItem('selectedPlan', selectedPlan);
      localStorage.setItem('billingCycle', billingCycle);

      // Create checkout session
      const response = await paymentsAPI.createCheckoutSession({
        subscription_type: selectedPlan,
        billing_cycle: billingCycle
      });

      // Redirect to Stripe checkout
      if (response.data && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
      setLoading(false);
    }
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get the user's current plan features for comparison
  const currentPlanFeatures = plans[currentPlan]?.features || plans.free.features;

  return (
    <div>
      <div className="fixed top-0 w-full p-6 bg-white dark:bg-gray-900 z-10">
        <HeaderLogo />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Select the perfect plan for your formulation needs
            </p>
          </div>

          {/* Billing cycle toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
              <button
                className={`py-2 px-4 rounded-md ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600 dark:text-violet-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`py-2 px-4 rounded-md ${
                  billingCycle === 'annual'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-violet-600 dark:text-violet-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual <span className="text-green-500">(Save 16%)</span>
              </button>
            </div>
          </div>

          {/* Plan cards with current plan highlight */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Object.entries(plans).map(([key, plan]) => {
              const isCurrentPlan = currentPlan === key;
              const isSelectedPlan = selectedPlan === key;
              const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
              
              return (
                <div
                  key={key}
                  className={`relative rounded-xl overflow-hidden transition-all duration-300 transform ${
                    isSelectedPlan ? 'scale-105 shadow-lg border-2 border-violet-500 dark:border-violet-400' : 
                    'border border-gray-200 dark:border-gray-700'
                  } ${
                    isCurrentPlan && !isSelectedPlan ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => setSelectedPlan(key)}
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
                    
                    <button
                      onClick={handleSubscribe}
                      disabled={loading || (isCurrentPlan && key !== 'free')}
                      className={`w-full py-2 px-4 rounded-md font-medium ${
                        isSelectedPlan
                          ? 'bg-violet-600 hover:bg-violet-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${
                        (isCurrentPlan && key !== 'free') || loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : (
                        `Subscribe${price > 0 ? ` for ${formatPrice(price)}/${billingCycle === 'monthly' ? 'mo' : 'yr'}` : ''}`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature comparison table */}
          <div className="mt-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Plan Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-l-lg">Features</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-center">Free</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/20">Creator</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-center rounded-r-lg">Pro Lab</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border-t border-b border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg font-medium">Formula limit</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">3</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/10 font-medium text-violet-600 dark:text-violet-400">30</td>
                    <td className="px-4 py-3 border-t border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center rounded-r-lg">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-t border-b border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg font-medium">Basic ingredients</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/10">
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </td>
                    <td className="px-4 py-3 border-t border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center rounded-r-lg">
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-t border-b border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg font-medium">Premium ingredients</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
                      <svg className="h-5 w-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/10">
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </td>
                    <td className="px-4 py-3 border-t border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center rounded-r-lg">
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-t border-b border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg font-medium">Professional ingredients</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
                      <svg className="h-5 w-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/10">
                      <svg className="h-5 w-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </td>
                    <td className="px-4 py-3 border-t border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center rounded-r-lg">
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-t border-b border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg font-medium">AI formula generation</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">Basic</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/10">Advanced</td>
                    <td className="px-4 py-3 border-t border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center rounded-r-lg">Professional</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-t border-b border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg font-medium">Export formats</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">PDF</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/10">PDF, Excel, CSV</td>
                    <td className="px-4 py-3 border-t border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center rounded-r-lg">All formats</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-t border-b border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-l-lg font-medium">Formula analysis</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">Basic</td>
                    <td className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center bg-violet-50 dark:bg-violet-900/10">Intermediate</td>
                    <td className="px-4 py-3 border-t border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center rounded-r-lg">Advanced</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600 dark:text-gray-400">Yes, you can upgrade your plan at any time. When downgrading, your current subscription will remain active until the end of your billing period.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How do formula limits work?</h3>
                <p className="text-gray-600 dark:text-gray-400">Each plan has a maximum number of formulas you can create. Once you reach this limit, you'll need to upgrade your plan or delete existing formulas to create new ones.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-600 dark:text-gray-400">You can cancel your subscription at any time. After cancellation, your plan will remain active until the end of your current billing period.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What happens to my formulas if I downgrade?</h3>
                <p className="text-gray-600 dark:text-gray-400">If you downgrade to a plan with a lower formula limit and you have more formulas than allowed, you'll still have access to all existing formulas, but won't be able to create new ones until you're under the limit.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Cosmetic Formula Lab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Subscription;