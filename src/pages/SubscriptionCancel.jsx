import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';

function SubscriptionCancel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Clear any stored plan data since the checkout was cancelled
  localStorage.removeItem('selectedPlan');
  localStorage.removeItem('billingCycle');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
              <div className="text-center">
                <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Checkout Cancelled</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your subscription checkout process was cancelled. No charges have been made to your account.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link to="/subscription" className="inline-flex items-center px-4 py-2 bg-violet-600 border border-transparent rounded-md font-semibold text-white hover:bg-violet-700">
                    Return to Plans
                  </Link>
                  <Link to="/dashboard" className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SubscriptionCancel;