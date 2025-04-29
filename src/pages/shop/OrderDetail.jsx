// src/pages/shop/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { shopAPI, userAPI } from '../../services/api';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

function OrderDetail() {
  const { orderId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch order details
        const orderResponse = await shopAPI.getOrder(orderId);
        setOrder(orderResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'paid':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
              <div className="mb-8 flex flex-wrap justify-between items-center">
                <div>
                  <Link 
                    to="/shop/orders" 
                    className="text-sm text-violet-600 dark:text-violet-400 hover:underline mb-2 inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Orders
                  </Link>
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Order #{orderId}</h1>
                  <div className="flex items-center mt-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order?.status)}`}>
                      {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      Placed on {formatDate(order?.created_at)}
                    </span>
                  </div>
                </div>
                {order?.status === 'shipped' && order?.tracking_number && (
                  <div className="mt-4 sm:mt-0">
                    <div className="bg-white dark:bg-gray-700 shadow-sm rounded-md p-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{order.tracking_number}</p>
                      <a 
                        href="#" 
                        className="text-sm text-violet-600 dark:text-violet-400 hover:underline mt-1 inline-block"
                      >
                        Track Shipment
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {error ? (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-5 text-center">
                  <p className="text-red-600 dark:text-red-300">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-violet-600 text-white rounded-md shadow-sm hover:bg-violet-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : order ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Order Details */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Order Items</h2>
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
                    </div>
                    
                    {/* Shipping Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Shipping Information</h2>
                      </div>
                      
                      <div className="p-6">
                        {order.shipping_address ? (
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                              {order.shipping_address.first_name} {order.shipping_address.last_name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.shipping_address.address_line1}<br />
                              {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                              {order.shipping_address.country}
                            </p>
                            {order.shipping_address.phone_number && (
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Phone:</span> {order.shipping_address.phone_number}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">Shipping address not available</p>
                        )}
                        
                        {/* Order notes */}
                        {order.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Notes</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Payment Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Payment Information</h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</h3>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
                              {order.payment_method.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Status</h3>
                            <p className={`text-base font-medium ${
                              order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
                                ? 'Paid'
                                : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-20">
                      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Order Summary</h2>
                      </div>
                      
                      <div className="p-6">
                        <dl className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
                            <dd className="text-gray-900 dark:text-gray-100">${order.subtotal.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between text-sm">
                            <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
                            <dd className="text-gray-900 dark:text-gray-100">${order.shipping_fee.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between text-sm">
                            <dt className="text-gray-600 dark:text-gray-400">Tax</dt>
                            <dd className="text-gray-900 dark:text-gray-100">${order.tax.toFixed(2)}</dd>
                          </div>
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-base font-medium">
                              <dt className="text-gray-900 dark:text-gray-100">Total</dt>
                              <dd className="text-gray-900 dark:text-gray-100">${order.total_amount.toFixed(2)}</dd>
                            </div>
                          </div>
                        </dl>
                        
                        {/* Order timeline/history */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Order Timeline</h3>
                          <div className="flow-root">
                            <ul className="-mb-8">
                              <li>
                                <div className="relative pb-8">
                                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                                  <div className="relative flex items-start space-x-3">
                                    <div>
                                      <div className="relative px-1">
                                        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1 py-0">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                                          <span className="font-medium text-gray-900 dark:text-gray-100">Order Placed</span>
                                          <span className="whitespace-nowrap ml-2">{formatDate(order.created_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              
                              {(order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered') && (
                                <li>
                                  <div className="relative pb-8">
                                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                                    <div className="relative flex items-start space-x-3">
                                      <div>
                                        <div className="relative px-1">
                                          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1 py-0">
                                          <div className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">Payment Received</span>
                                            <span className="whitespace-nowrap ml-2">{formatDate(order.updated_at)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )}
                              
                              {(order.status === 'shipped' || order.status === 'delivered') && (
                                <li>
                                  <div className="relative pb-8">
                                    {order.status === 'delivered' && (
                                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                                    )}
                                    <div className="relative flex items-start space-x-3">
                                      <div>
                                        <div className="relative px-1">
                                          <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1 py-0">
                                          <div className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">Order Shipped</span>
                                            <span className="whitespace-nowrap ml-2">{formatDate(order.updated_at)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )}
                              
                              {order.status === 'delivered' && (
                                <li>
                                  <div className="relative">
                                    <div className="relative flex items-start space-x-3">
                                      <div>
                                        <div className="relative px-1">
                                          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1 py-0">
                                          <div className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">Order Delivered</span>
                                            <span className="whitespace-nowrap ml-2">{formatDate(order.updated_at)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="mt-6 space-y-3">
                          <Link
                            to="/shop"
                            className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                          >
                            Continue Shopping
                          </Link>
                          {order.status !== 'cancelled' && (order.status === 'pending' || order.status === 'processing') && (
                            <button
                              type="button"
                              className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Order not found</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    The order you're looking for doesn't exist or you don't have permission to view it.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/shop/orders"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                    >
                      Back to Orders
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

export default OrderDetail;