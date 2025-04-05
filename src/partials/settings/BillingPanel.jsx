import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function BillingPanel({ subscriptionData, onCancelSubscription }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [processingCancel, setProcessingCancel] = useState(false);

  // Mock payment method data
  const paymentMethod = {
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025
  };

  // Mock invoice data
  const invoices = [
    { id: 'INV-2023-001', date: '2023-11-01', amount: 9.99, status: 'Paid' },
    { id: 'INV-2023-002', date: '2023-12-01', amount: 9.99, status: 'Paid' },
    { id: 'INV-2024-001', date: '2024-01-01', amount: 9.99, status: 'Paid' },
    { id: 'INV-2024-002', date: '2024-02-01', amount: 9.99, status: 'Paid' },
    { id: 'INV-2024-003', date: '2024-03-01', amount: 9.99, status: 'Paid' }
  ];

  const handleCancelSubscription = async () => {
    setProcessingCancel(true);
    
    try {
      await onCancelSubscription();
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setProcessingCancel(false);
    }
  };

  const formatSubscriptionType = (type) => {
    if (!type) return 'Free';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="grow p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Subscription Details</h2>
        
        {subscriptionData ? (
          <div className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatSubscriptionType(subscriptionData.subscription_type)} Plan
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subscriptionData.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subscriptionData.subscription_type === 'professional'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                    : subscriptionData.subscription_type === 'premium'
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {subscriptionData.subscription_type !== 'free' ? (
                    <>
                      {subscriptionData.is_active 
                        ? 'Active' 
                        : 'Inactive'}
                    </>
                  ) : (
                    'Free Plan'
                  )}
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Billing Cycle</h4>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {subscriptionData.subscription_type === 'free' 
                      ? 'N/A' 
                      : subscriptionData.expiration_date && new Date(subscriptionData.expiration_date).getTime() - new Date().getTime() > 31536000000 * 0.9
                        ? 'Annual'
                        : 'Monthly'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Next Billing Date</h4>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {subscriptionData.subscription_type === 'free' 
                      ? 'N/A' 
                      : formatDate(subscriptionData.expiration_date)}
                  </p>
                </div>
              </div>
              
              {subscriptionData.subscription_type !== 'free' && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link 
                    to="/subscription" 
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium"
                  >
                    Change Plan
                  </Link>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
              
              {subscriptionData.subscription_type === 'free' && (
                <div className="mt-6">
                  <Link 
                    to="/subscription" 
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium"
                  >
                    Upgrade Plan
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg p-5 text-center">
            <p className="text-gray-600 dark:text-gray-400">No subscription data available</p>
            <Link 
              to="/subscription" 
              className="mt-4 inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>
      
      {subscriptionData && subscriptionData.subscription_type !== 'free' && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Payment Method</h2>
            
            <div className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="mr-3">
                    {paymentMethod.brand === 'Visa' && (
                      <svg className="w-10 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="6" fill="#2566AF"/>
                        <path d="M18.4 31H14.4L16.8 17H20.8L18.4 31Z" fill="white"/>
                        <path d="M34.4 17.4C33.6 17.1 32.3 16.8 30.7 16.8C26.9 16.8 24.2 18.8 24.2 21.7C24.1 23.9 26.1 25.1 27.6 25.8C29.1 26.5 29.6 27 29.6 27.6C29.6 28.5 28.5 29 27.4 29C25.9 29 25.1 28.8 23.8 28.2L23.3 28 22.9 31.5C23.8 31.9 25.5 32.3 27.3 32.3C31.4 32.3 34 30.3 34 27.2C34 25.5 32.9 24.2 30.7 23.2C29.3 22.5 28.5 22 28.5 21.3C28.5 20.7 29.2 20.1 30.5 20.1C31.6 20.1 32.4 20.3 33 20.6L33.4 20.8L33.8 17.5L34.4 17.4Z" fill="white"/>
                        <path d="M38 17H35C34.2 17 33.6 17.2 33.3 17.9L28.8 31H32.9L33.6 29H37.7L38.1 31H41.8L38 17ZM34.6 26C34.9 25.2 36.1 22.2 36.1 22.2C36.1 22.2 36.3 21.7 36.5 21.4L36.7 22.1C36.7 22.1 37.4 25.3 37.6 26H34.6Z" fill="white"/>
                        <path d="M24 17L20.2 26.5L19.8 24.6C19.1 22.5 17.1 20.3 14.8 19L18.3 31H22.4L28.2 17H24Z" fill="white"/>
                      </svg>
                    )}
                    {paymentMethod.brand === 'Mastercard' && (
                      <svg className="w-10 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="6" fill="#F9F9F9"/>
                        <path d="M17.1 24C17.1 29 21.1 33 26.1 33C28.6 33 30.8 32 32.4 30.4L32.5 30.3C33.9 28.9 34.9 27 35.3 24.9C35.4 24.6 35.5 24.3 35.5 24C35.5 23.7 35.5 23.4 35.4 23.1C35 21 34 19.1 32.6 17.7L32.5 17.6C30.9 16 28.7 15 26.2 15C21.2 15 17.2 19 17.2 24H17.1Z" fill="#EB001B"/>
                        <path d="M43 24C43 19 39 15 34 15C31.5 15 29.3 16 27.7 17.6C29.1 19 30.1 20.9 30.5 23.1C30.6 23.4 30.6 23.7 30.6 24C30.6 24.3 30.6 24.6 30.5 24.9C30.1 27 29.1 28.9 27.7 30.3C29.3 31.9 31.5 32.9 34 32.9C39 33 43 29 43 24Z" fill="#F79E1B"/>
                        <path d="M32.5 17.6C32.5 17.6 29.4 20.4 30.5 24.9C30.5 24.9 30.5 27.7 27.7 30.3C27.7 30.3 31.7 32 35.3 28.9C35.3 28.9 37.1 27.1 37.2 24C37.2 24 37.1 20.3 32.5 17.6Z" fill="#FF5F00"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {paymentMethod.brand} ending in {paymentMethod.last4}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-750">
                    Update Payment Method
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Billing History</h2>
            
            <div className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {invoice.id}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
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
                        Are you sure you want to cancel your subscription? You'll continue to have access to your current features until the end of your billing period on {formatDate(subscriptionData?.expiration_date)}.
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
                  disabled={processingCancel}
                >
                  {processingCancel ? (
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
    </div>
  );
}

export default BillingPanel;