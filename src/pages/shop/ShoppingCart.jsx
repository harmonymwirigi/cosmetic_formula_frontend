//src/pages/shop/ShoppingCart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../partials/Header';
import Sidebar from '../../partials/Sidebar';
import { userAPI, shopAPI } from '../../services/api';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import AddressModal from '../../components/shop/AddressModal';
import { toast } from 'react-toastify';

function ShoppingCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [orderNotes, setOrderNotes] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Check for canceled payment
  useEffect(() => {
    // Check if the URL has a canceled query parameter
    const params = new URLSearchParams(location.search);
    if (params.get('canceled')) {
      toast.error('Payment was canceled. Your order has not been processed.');
    }
  }, [location]);

  // Fetch cart and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch cart
        const cartResponse = await shopAPI.getCart();
        setCart(cartResponse.data);
        
        // Fetch shipping addresses
        const addressesResponse = await shopAPI.getShippingAddresses();
        setShippingAddresses(addressesResponse.data);
        
        // Set default shipping address if available
        const defaultAddress = addressesResponse.data.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (addressesResponse.data.length > 0) {
          setSelectedAddressId(addressesResponse.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.response?.data?.detail || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update cart item quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      // Ensure quantity is at least 1
      const quantity = Math.max(1, newQuantity);
      
      await shopAPI.updateCartItem(itemId, {
        product_id: cart.items.find(item => item.id === itemId).product_id,
        quantity
      });
      
      // Refresh cart
      const cartResponse = await shopAPI.getCart();
      setCart(cartResponse.data);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error(error.response?.data?.detail || 'Failed to update quantity');
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      await shopAPI.removeFromCart(itemId);
      
      // Refresh cart
      const cartResponse = await shopAPI.getCart();
      setCart(cartResponse.data);
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error(error.response?.data?.detail || 'Failed to remove item from cart');
    }
  };

  // Proceed to checkout
  const handleProceedToCheckout = () => {
    // Validate cart has items
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Move to shipping step
    setCheckoutStep(2);
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    // Validate shipping address is selected
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    
    // Move to payment step
    setCheckoutStep(3);
  };

  // Handle new address added
  const handleAddressAdded = (newAddress) => {
    setShippingAddresses([...shippingAddresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    
    // If it's a default address, update other addresses
    if (newAddress.is_default) {
      setShippingAddresses(prev => 
        prev.map(addr => 
          addr.id !== newAddress.id ? { ...addr, is_default: false } : addr
        )
      );
    }
  };

  // Place order and process payment
  const handlePlaceOrder = async () => {
    // Validate payment method is selected
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    // Validate shipping address is selected
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    
    setIsProcessingOrder(true);
    
    try {
      // Create order first
      const orderResponse = await shopAPI.createOrder(
        selectedAddressId,
        paymentMethod,
        orderNotes
      );
      
      // Now create a Stripe checkout session for the order
      try {
        // Call the API to create a checkout session
        const checkoutResponse = await shopAPI.createStripeCheckoutSession(orderResponse.data.id);
        
        // Redirect to the Stripe checkout page
        window.location.href = checkoutResponse.data.checkout_url;
      } catch (error) {
        console.error('Failed to create checkout session:', error);
        // Redirect to order confirmation page even if Stripe checkout fails (for demo purposes)
        navigate(`/shop/orders/${orderResponse.data.id}/confirmation`);
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error(error.response?.data?.detail || 'Failed to place order');
      setIsProcessingOrder(false);
    }
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
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Shopping Cart</h1>
                
                {/* Checkout steps */}
                <div className="mt-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-between">
                      <span 
                        className={`px-2 bg-white dark:bg-gray-800 text-sm font-medium rounded-full ${
                          checkoutStep >= 1 
                            ? 'text-violet-600 border-2 border-violet-600 dark:border-violet-400'
                            : 'text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        1. Cart
                      </span>
                      <span 
                        className={`px-2 bg-white dark:bg-gray-800 text-sm font-medium rounded-full ${
                          checkoutStep >= 2
                            ? 'text-violet-600 border-2 border-violet-600 dark:border-violet-400'
                            : 'text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        2. Shipping
                      </span>
                      <span 
                        className={`px-2 bg-white dark:bg-gray-800 text-sm font-medium rounded-full ${
                          checkoutStep >= 3
                            ? 'text-violet-600 border-2 border-violet-600 dark:border-violet-400'
                            : 'text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        3. Payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart step */}
              {checkoutStep === 1 && (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                  {/* Cart items */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      {cart && cart.items.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {cart.items.map((item) => (
                            <div key={item.id} className="p-4 flex items-center">
                              {/* Product image */}
                              <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                                {item.product.image_url ? (
                                  <img 
                                    src={item.product.image_url} 
                                    alt={item.product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              {/* Product details */}
                              <div className="ml-4 flex-1">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                  {item.product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  ${(item.product.sale_price || item.product.price).toFixed(2)} each
                                </p>
                              </div>
                              
                              {/* Quantity */}
                              <div className="flex items-center ml-4">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="mx-2 text-gray-700 dark:text-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Price */}
                              <div className="ml-4 text-right">
                                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                  ${((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                              
                              {/* Remove button */}
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Your cart is empty</h3>
                          <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Add some products to your cart to continue shopping.
                          </p>
                          <div className="mt-6">
                            <Link
                              to="/shop"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                            >
                              Continue Shopping
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Order summary */}
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                          <p className="text-gray-900 dark:text-gray-100">${cart?.subtotal.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <p className="text-gray-600 dark:text-gray-400">Shipping</p>
                          <p className="text-gray-900 dark:text-gray-100">$5.99</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <p className="text-gray-600 dark:text-gray-400">Tax (7%)</p>
                          <p className="text-gray-900 dark:text-gray-100">${(cart?.subtotal * 0.07).toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                          <div className="flex justify-between">
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">Total</p>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                              ${(parseFloat(cart?.subtotal || 0) + 5.99 + parseFloat(cart?.subtotal * 0.07 || 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          onClick={handleProceedToCheckout}
                          disabled={!cart || cart.items.length === 0}
                          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                            !cart || cart.items.length === 0
                              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                              : 'bg-violet-600 hover:bg-violet-700'
                          }`}
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Link
                          to="/shop"
                          className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping step */}
              {checkoutStep === 2 && (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                  {/* Shipping address form */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Shipping Address</h2>
                      
                      {/* Address selection */}
                      {shippingAddresses.length > 0 ? (
                        <div className="space-y-4">
                          {shippingAddresses.map((address) => (
                            <div key={address.id} className="relative border rounded-md p-4">
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id={`address-${address.id}`}
                                    name="shipping-address"
                                    type="radio"
                                    checked={selectedAddressId === address.id}
                                    onChange={() => setSelectedAddressId(address.id)}
                                    className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                 <label htmlFor={`address-${address.id}`} className="font-medium text-gray-700 dark:text-gray-300">
                                   {address.first_name} {address.last_name}
                                   {address.is_default && (
                                     <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                       Default
                                     </span>
                                   )}
                                 </label>
                                 <p className="text-gray-500 dark:text-gray-400 mt-1">
                                   {address.address_line1}<br />
                                   {address.address_line2 && <>{address.address_line2}<br /></>}
                                   {address.city}, {address.state} {address.postal_code}<br />
                                   {address.country}
                                 </p>
                                 {address.phone_number && (
                                   <p className="text-gray-500 dark:text-gray-400 mt-1">
                                     {address.phone_number}
                                   </p>
                                 )}
                               </div>
                             </div>
                           </div>
                         ))}
                         
                         <div className="mt-4 flex justify-between">
                           <button
                             onClick={() => setShowAddressModal(true)}
                             className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                           >
                             Add new address
                           </button>
                           <Link 
                             to="/settings/addresses" 
                             className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                           >
                             Manage addresses
                           </Link>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center py-6">
                         <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                         <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No addresses found</h3>
                         <p className="mt-1 text-gray-500 dark:text-gray-400">
                           Add a shipping address to continue checkout.
                         </p>
                         <div className="mt-6">
                           <button
                             onClick={() => setShowAddressModal(true)}
                             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
                           >
                             Add New Address
                           </button>
                         </div>
                       </div>
                     )}

                     {/* Order notes */}
                     <div className="mt-6">
                       <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                         Order Notes (Optional)
                       </label>
                       <textarea
                         id="order-notes"
                         rows="3"
                         className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                         placeholder="Special instructions for delivery"
                         value={orderNotes}
                         onChange={(e) => setOrderNotes(e.target.value)}
                       ></textarea>
                     </div>

                     {/* Navigation buttons */}
                     <div className="mt-6 flex justify-between">
                       <button
                         onClick={() => setCheckoutStep(1)}
                         className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                       >
                         Back to Cart
                       </button>
                       <button
                         onClick={handleProceedToPayment}
                         disabled={!selectedAddressId}
                         className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                           !selectedAddressId
                             ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                             : 'bg-violet-600 hover:bg-violet-700'
                         }`}
                       >
                         Continue to Payment
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* Order summary */}
                 <div>
                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                     <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
                     
                     <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                         <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                         <p className="text-gray-900 dark:text-gray-100">${cart?.subtotal.toFixed(2) || '0.00'}</p>
                       </div>
                       <div className="flex justify-between text-sm">
                         <p className="text-gray-600 dark:text-gray-400">Shipping</p>
                         <p className="text-gray-900 dark:text-gray-100">$5.99</p>
                       </div>
                       <div className="flex justify-between text-sm">
                         <p className="text-gray-600 dark:text-gray-400">Tax (7%)</p>
                         <p className="text-gray-900 dark:text-gray-100">${(cart?.subtotal * 0.07).toFixed(2) || '0.00'}</p>
                       </div>
                       <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                         <div className="flex justify-between">
                           <p className="text-base font-medium text-gray-900 dark:text-gray-100">Total</p>
                           <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                             ${(parseFloat(cart?.subtotal || 0) + 5.99 + parseFloat(cart?.subtotal * 0.07 || 0)).toFixed(2)}
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Item summary */}
                     {cart && cart.items.length > 0 && (
                       <div className="mt-6">
                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})
                         </h3>
                         <div className="max-h-36 overflow-y-auto pr-1">
                           {cart.items.map((item) => (
                             <div key={item.id} className="flex items-center py-2">
                               <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                 {item.product.image_url ? (
                                   <img 
                                     src={item.product.image_url} 
                                     alt={item.product.name} 
                                     className="w-full h-full object-cover"
                                   />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center">
                                     <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                     </svg>
                                   </div>
                                 )}
                               </div>
                               <div className="ml-3 flex-1 min-w-0">
                                 <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                   {item.product.name}
                                 </p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">
                                   {item.quantity} x ${(item.product.sale_price || item.product.price).toFixed(2)}
                                 </p>
                               </div>
                               <div className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-100">
                                 ${((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {/* Payment step */}
             {checkoutStep === 3 && (
               <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                 {/* Payment form */}
                 <div className="lg:col-span-2">
                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                     <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Payment Method</h2>
                     
                     {/* Payment options */}
                     <div className="space-y-4">
                       <div className="relative border rounded-md p-4">
                         <div className="flex items-start">
                           <div className="flex items-center h-5">
                             <input
                               id="payment-credit-card"
                               name="payment-method"
                               type="radio"
                               checked={paymentMethod === 'credit_card'}
                               onChange={() => setPaymentMethod('credit_card')}
                               className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                             />
                           </div>
                           <div className="ml-3 text-sm">
                             <label htmlFor="payment-credit-card" className="font-medium text-gray-700 dark:text-gray-300">
                               Credit Card
                             </label>
                             <p className="text-gray-500 dark:text-gray-400">
                               Pay with your credit or debit card.
                             </p>
                           </div>
                         </div>
                         
                         {/* Credit card details form (will redirect to Stripe) */}
                         {paymentMethod === 'credit_card' && (
                           <div className="mt-4">
                             <p className="text-sm text-gray-500 dark:text-gray-400">
                               You'll be redirected to our secure payment provider (Stripe) when you place your order.
                             </p>
                             <div className="mt-3 flex flex-wrap gap-2">
                               <img src="/images/credit-cards/visa.svg" alt="Visa" className="h-6" />
                               <img src="/images/credit-cards/mastercard.svg" alt="Mastercard" className="h-6" />
                               <img src="/images/credit-cards/amex.svg" alt="American Express" className="h-6" />
                               <img src="/images/credit-cards/discover.svg" alt="Discover" className="h-6" />
                             </div>
                           </div>
                         )}
                       </div>
                       
                       <div className="relative border rounded-md p-4">
                         <div className="flex items-start">
                           <div className="flex items-center h-5">
                             <input
                               id="payment-paypal"
                               name="payment-method"
                               type="radio"
                               checked={paymentMethod === 'paypal'}
                               onChange={() => setPaymentMethod('paypal')}
                               className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                             />
                           </div>
                           <div className="ml-3 text-sm">
                             <label htmlFor="payment-paypal" className="font-medium text-gray-700 dark:text-gray-300">
                               PayPal
                             </label>
                             <p className="text-gray-500 dark:text-gray-400">
                               Pay with your PayPal account.
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     {/* Selected shipping address */}
                     {selectedAddressId && (
                       <div className="mt-6">
                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           Shipping To
                         </h3>
                         {shippingAddresses.find(addr => addr.id === selectedAddressId) && (
                           <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-700">
                             <p className="text-sm text-gray-700 dark:text-gray-300">
                               <span className="font-medium">
                                 {shippingAddresses.find(addr => addr.id === selectedAddressId).first_name}{' '}
                                 {shippingAddresses.find(addr => addr.id === selectedAddressId).last_name}
                               </span><br />
                               {shippingAddresses.find(addr => addr.id === selectedAddressId).address_line1}<br />
                               {shippingAddresses.find(addr => addr.id === selectedAddressId).address_line2 && (
                                 <>{shippingAddresses.find(addr => addr.id === selectedAddressId).address_line2}<br /></>
                               )}
                               {shippingAddresses.find(addr => addr.id === selectedAddressId).city},{' '}
                               {shippingAddresses.find(addr => addr.id === selectedAddressId).state}{' '}
                               {shippingAddresses.find(addr => addr.id === selectedAddressId).postal_code}<br />
                               {shippingAddresses.find(addr => addr.id === selectedAddressId).country}
                             </p>
                           </div>
                         )}
                         <button
                           onClick={() => setCheckoutStep(2)}
                           className="mt-2 text-sm text-violet-600 dark:text-violet-400 hover:underline"
                         >
                           Change
                         </button>
                       </div>
                     )}

                     {/* Navigation buttons */}
                     <div className="mt-6 flex justify-between">
                       <button
                         onClick={() => setCheckoutStep(2)}
                         className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                       >
                         Back to Shipping
                       </button>
                       <button
                         onClick={handlePlaceOrder}
                         disabled={!paymentMethod || isProcessingOrder}
                         className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                           !paymentMethod || isProcessingOrder
                             ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                             : 'bg-violet-600 hover:bg-violet-700'
                         }`}
                       >
                         {isProcessingOrder ? (
                           <span className="flex items-center">
                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             Processing...
                           </span>
                         ) : (
                           'Place Order'
                         )}
                       </button>
                     </div>
                   </div>
                 </div>

                 {/* Order summary */}
                 <div>
                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                     <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
                     
                     <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                         <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                         <p className="text-gray-900 dark:text-gray-100">${cart?.subtotal.toFixed(2) || '0.00'}</p>
                       </div>
                       <div className="flex justify-between text-sm">
                         <p className="text-gray-600 dark:text-gray-400">Shipping</p>
                         <p className="text-gray-900 dark:text-gray-100">$5.99</p>
                       </div>
                       <div className="flex justify-between text-sm">
                         <p className="text-gray-600 dark:text-gray-400">Tax (7%)</p>
                         <p className="text-gray-900 dark:text-gray-100">${(cart?.subtotal * 0.07).toFixed(2) || '0.00'}</p>
                       </div>
                       <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                         <div className="flex justify-between">
                           <p className="text-base font-medium text-gray-900 dark:text-gray-100">Total</p>
                           <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                             ${(parseFloat(cart?.subtotal || 0) + 5.99 + parseFloat(cart?.subtotal * 0.07 || 0)).toFixed(2)}
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Item summary */}
                     {cart && cart.items.length > 0 && (
                       <div className="mt-6">
                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                           Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})
                         </h3>
                         <div className="max-h-36 overflow-y-auto pr-1">
                           {cart.items.map((item) => (
                             <div key={item.id} className="flex items-center py-2">
                               <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                 {item.product.image_url ? (
                                   <img 
                                     src={item.product.image_url} 
                                     alt={item.product.name} 
                                     className="w-full h-full object-cover"
                                   />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center">
                                     <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                     </svg>
                                   </div>
                                 )}
                               </div>
                               <div className="ml-3 flex-1 min-w-0">
                                 <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                   {item.product.name}
                                 </p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">
                                   {item.quantity} x ${(item.product.sale_price || item.product.price).toFixed(2)}
                                 </p>
                               </div>
                               <div className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-100">
                                 ${((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             )}
           </div>
         </main>

         {/* Footer */}
         <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="py-4 text-sm text-center text-gray-500 dark:text-gray-400">
               &copy; {new Date().getFullYear()} Cosmetic Formula Lab. All rights reserved.
             </div>
           </div>
         </footer>
       </div>
       
       {/* Address Modal */}
       <AddressModal
         isOpen={showAddressModal}
         onClose={() => setShowAddressModal(false)}
         onAddressAdded={handleAddressAdded}
       />
     </div>
   </ProtectedRoute>
 );
}

export default ShoppingCart;