// frontend/src/components/Dashboard/UpgradeModal.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function UpgradeModal({ isOpen, onClose, currentPlan, formulaCount, formulaLimit }) {
  if (!isOpen) return null;
  
  // Handle unlimited formula limit properly
  const isUnlimited = formulaLimit === 'Unlimited' || formulaLimit === Infinity;
  const formulaPercentage = isUnlimited ? 0 : (formulaCount / formulaLimit) * 100;
  const nextPlan = currentPlan === 'free' ? 'Creator' : 'Pro Lab';
  const planParam = currentPlan === 'creator' ? '?plan=pro_lab' : '';
  
  // Format the limit display
  const formatLimit = () => {
    if (isUnlimited) return 'Unlimited';
    return formulaLimit;
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                  Formula Limit {formulaPercentage >= 100 ? 'Reached' : 'Approaching'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You're currently using {formulaCount} of {formatLimit()} formulas available in your {currentPlan === 'free' ? 'Free' : 'Creator'} plan.
                    {formulaPercentage >= 100 ? 
                      " You've reached your formula limit." : 
                      " You're approaching your formula limit."}
                  </p>
                  {!isUnlimited && (
                    <div className="mt-4 mb-2">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                          <div style={{ width: `${Math.min(formulaPercentage, 100)}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            formulaPercentage >= 90 ? 'bg-red-500' : 'bg-amber-500'
                          }`}></div>
                        </div>
                      </div>
                      <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                        {formulaCount} / {formatLimit()} formulas used
                      </p>
                    </div>
                  )}
                  <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
                    Upgrade to {nextPlan} Plan to get {currentPlan === 'free' ? 'more' : 'unlimited'} formulas and access to {currentPlan === 'free' ? 'premium' : 'professional'} ingredients.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Link
              to={`/settings/plans${planParam}`}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Upgrade Now
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Remind Me Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;