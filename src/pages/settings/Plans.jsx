import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, paymentsAPI } from '../../services/api';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import PlansPanel from '../../partials/settings/PlansPanel';

function Plans() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Pricing plans data (same as in Subscription.jsx)
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
                View available plans and manage your current subscription
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
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userData?.subscription_type === 'professional'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                          : userData?.subscription_type === 'premium'
                            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {userData?.subscription_type ? (
                          userData.subscription_type.charAt(0).toUpperCase() + userData.subscription_type.slice(1)
                        ) : 'Free'} Plan
                      </div>
                      {userData?.subscription_expires_at && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Renews on: {new Date(userData.subscription_expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <Link 
                        to="/subscription" 
                        className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
                      >
                        Manage Subscription
                      </Link>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Available Plans</h2>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-4">
                      {Object.entries(plans).map(([key, plan]) => (
                        <div 
                          key={key}
                          className={`bg-white dark:bg-gray-750 border rounded-lg overflow-hidden ${
                            userData?.subscription_type === key 
                              ? 'border-violet-500 dark:border-violet-400' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{plan.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                            <div className="mt-4">
                              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                ${plan.monthlyPrice}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">/month</span>
                            </div>
                          </div>
                          <div className="p-5">
                            <ul className="space-y-3 mb-5">
                              {plan.features.map((feature, index) => (
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
                            {userData?.subscription_type === key ? (
                              <div className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-center py-2 px-4 rounded-md text-sm">
                                Current Plan
                              </div>
                            ) : (
                              <Link 
                                to={`/subscription?plan=${key}`}
                                className="block w-full text-center py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors"
                              >
                                Select Plan
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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

export default Plans;