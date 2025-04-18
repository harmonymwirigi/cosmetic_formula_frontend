import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function SettingsSidebar({ currentPage }) {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (page) => {
    return currentPage === page || pathname.includes(`/settings/${page}`);
  };

  return (
    <div className="md:w-64 md:shrink-0 md:border-r border-gray-200 dark:border-gray-700 min-h-[80vh]">
      <div className="sticky top-16">
        <div className="py-6">
          <div className="px-6 pb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Settings</h2>
          </div>
          <div className="px-6 space-y-0.5">
            <Link
              to="/settings/account"
              className={`flex items-center px-3 py-2 rounded mb-1 ${
                isActive('account')
                  ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">Account</span>
            </Link>
            <Link
              to="/settings/notifications"
              className={`flex items-center px-3 py-2 rounded mb-1 ${
                isActive('notifications')
                  ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm font-medium">Notifications</span>
            </Link>
            <Link
              to="/settings/plans"
              className={`flex items-center px-3 py-2 rounded mb-1 ${
                isActive('plans')
                  ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-sm font-medium">Subscription Plans</span>
            </Link>
            <Link
              to="/settings/billing"
              className={`flex items-center px-3 py-2 rounded mb-1 ${
                isActive('billing')
                  ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm font-medium">Billing</span>
            </Link>
            <Link
              to="/settings/apps"
              className={`flex items-center px-3 py-2 rounded mb-1 ${
                isActive('apps')
                  ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="text-sm font-medium">Integrations</span>
            </Link>
            <Link
              to="/settings/feedback"
              className={`flex items-center px-3 py-2 rounded mb-1 ${
                isActive('feedback')
                  ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="text-sm font-medium">Feedback</span>
            </Link>
            <Link
                to="/settings/addresses"
                className={`flex items-center p-2 rounded-lg w-full ${
                  currentPage === 'addresses'
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Shipping Addresses</span>
              </Link>
              <Link
          to="/shop/orders"
          className={`flex items-center p-2 rounded-lg w-full ${
            currentPage === 'orders'
              ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-sm font-medium">Orders</span>
        </Link>
        <Link
          to="/settings/preferences"
          className={`flex items-center p-2 rounded-lg w-full ${
            currentPage === 'preferences'
              ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">Preferences</span>
        </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSidebar;