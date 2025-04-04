import React from 'react';
import { Link } from 'react-router-dom';

function SubscriptionCancel() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="text-4xl font-bold text-violet-600 dark:text-violet-400">
            CFL
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Subscription Cancelled
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700">
              <svg className="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              Your subscription has been cancelled
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The subscription process was cancelled. No charges have been made to your account.
            </p>
            <div className="mt-6 flex flex-col space-y-3">
              <Link
                to="/subscription"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
              >
                Return to Plans
              </Link>
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
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

export default SubscriptionCancel;