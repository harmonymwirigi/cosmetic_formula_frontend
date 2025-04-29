// src/pages/shop/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { shopAPI } from '../../services/api';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if payment was successful
  const isSuccess = new URLSearchParams(location.search).get('success') === 'true';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order details
        const orderResponse = await shopAPI.getOrder(orderId);
        setOrder(orderResponse.data);
      } catch (error) {
        console.error('Failed to load order details:', error);
        setError(error.response?.data?.detail || 'Error loading order details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

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
              <div className="max-w-3xl mx-auto text-center pb-12">
                {error ? (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-5">
                    <h1 className="text-2xl text-red-700 dark:text-red-400 font-bold mb-2">Error</h1>
                    <p className="text-red-600 dark:text-red-300">{error}</p>
                    <div className="mt-4">
                      <Link 
                        to="/shop" 
                        className="px-4 py-2 bg-violet-600 text-white rounded-md shadow-sm hover:bg-violet-700"
                      >
                        Return to Shop
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isSuccess ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                      {isSuccess ? (
                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {isSuccess ? 'Order Confirmed!' : 'Order Placed'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {isSuccess 
                        ? 'Thank you for your purchase. Your order has been confirmed and is now being processed.'
                        : 'Your order has been placed and is pending payment confirmation.'}
                    </p>
                    <div className="mt-2">
                      <p className="text-gray-500 dark:text-gray-500">
                        Order #{order?.id}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {order && (
                <div className="max-w-3xl mx-auto">
                  {/* Order details */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Order Details</h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Status</h3>
                          <p className="text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {order.status}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Date</h3>
                          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</h3>
                          <p className="text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {order.payment_method.replace('_', ' ')}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Amount</h3>
                          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                            ${order.total_amount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Shipping Address</h3>
                        {order.shipping_address ? (
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                            <p>{order.shipping_address.address_line1}</p>
                            {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                            <p>{order.shipping_address.country}</p>
                            {order.shipping_address.phone_number && <p>{order.shipping_address.phone_number}</p>}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No shipping address available</p>
                        )}
                      </div>

                      {/* Order Notes */}
                      {order.notes && (
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Notes</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Items</h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {order.items.map((item) => (
                        <div key={item.id} className="p-6 flex items-center">
                          {/* Product image */}
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                            {item.product_image ? (
                              <img 
                                src={item.product_image} 
                                alt={item.product_name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Product details */}
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {item.product_name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Total price */}
                          <div className="ml-4">
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              ${item.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                      <div className="flex justify-between text-sm mb-2">
                        <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                        <p className="text-gray-900 dark:text-gray-100">${order.subtotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <p className="text-gray-600 dark:text-gray-400">Shipping</p>
                        <p className="text-gray-900 dark:text-gray-100">${order.shipping_fee.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <p className="text-gray-600 dark:text-gray-400">Tax</p>
                        <p className="text-gray-900 dark:text-gray-100">${order.tax.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-gray-100">Total</p>
                        <p className="text-gray-900 dark:text-gray-100">${order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                    <Link
                      to="/shop/orders"
                      className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-650"
                    >
                      View All Orders
                    </Link>
                    <Link
                      to="/shop"
                      className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default OrderConfirmation;