// src/services/stripe-service.js
import api from './api';

// This service will handle all Stripe-related actions
const stripeService = {
  // Create a Stripe Checkout session for an order
  createCheckoutSession: async (orderId) => {
    try {
      // Call the backend endpoint to create a Stripe Checkout session
      const response = await api.post('/payments/create-checkout-session', { order_id: orderId });
      
      // Return the session data, which includes the URL to redirect to
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },
  
  // Redirect to Stripe Checkout
  redirectToCheckout: (sessionId) => {
    // Redirect to the Stripe-hosted checkout page
    window.location.href = sessionId;
  },
  
  // Process a successful payment
  handlePaymentSuccess: async (sessionId) => {
    try {
      // Call the backend to confirm the payment was successful
      const response = await api.post('/payments/confirm-payment', { session_id: sessionId });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
};

export default stripeService;