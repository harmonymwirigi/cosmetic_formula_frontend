import React, { useState, useEffect } from 'react';
import { userAPI, paymentsAPI } from '../../services/api';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import BillingPanel from '../../partials/settings/BillingPanel';

function Billing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await paymentsAPI.getSubscriptionStatus();
        setSubscriptionData(response.data);
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
        setError('Unable to load subscription information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await paymentsAPI.cancelSubscription();
      // Refresh subscription data
      const response = await paymentsAPI.getSubscriptionStatus();
      setSubscriptionData(response.data);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Billing & Subscription</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your subscription, payment methods, and billing history
              </p>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <SettingsSidebar currentPage="billing" />
                  <BillingPanel 
                    subscriptionData={subscriptionData} 
                    onCancelSubscription={handleCancelSubscription}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Billing;