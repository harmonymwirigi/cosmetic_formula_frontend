// src/services/api.tsx
import axios from 'axios';

// Define interface types for API parameters
interface LoginData {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface UserCreateData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface SubscriptionData {
  subscription_type: string;
}

interface FormulaData {
  name: string;
  description?: string;
  [key: string]: any; // For other formula properties
}

// Use the correct backend URL - IMPORTANT: This must match your FastAPI server address
const API_URL = import.meta.env.VITE_API_BASE_URL;


// Create API instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log each request for debugging
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (data: LoginData) => {
    console.log('Login request with data:', data);
    return api.post('/auth/login', data);
  },
  register: (userData: UserCreateData) => {
    console.log('Register request with data:', userData);
    return api.post('/auth/register', userData);
  },
  getCurrentUser: () => {
    return api.get('/auth/me');
  },
};

// Payment API functions
export const paymentsAPI = {
  createCheckoutSession: (data: { subscription_type: string, billing_cycle: string }) => {
    console.log('Creating checkout session with data:', data);
    return api.post('/payments/create-checkout-session', data);
  },
  verifySession: (sessionId: string, subscriptionType?: string) => {
    return api.post('/payments/verify-session', { 
      session_id: sessionId,
      subscription_type: subscriptionType || localStorage.getItem('selectedPlan') || 'premium'
    });
  },
  cancelSubscription: () => {
    return api.post('/payments/cancel-subscription');
  },
  getSubscriptionStatus: () => {
    return api.get('/payments/subscription-status');
  }
};
// User API

export const userAPI = {
  getUserStatus: () => {
    return api.get('/users/status');
  },
  updateSubscription: (data: { subscription_type: string }) => {
    return api.post('/users/subscription', data);
  },
  getFormulaUsage: () => {
    return api.get('/users/formula-usage');
  },
  getCurrentUser: () => {
    return api.get('/users/me');
  },
  updateProfile: (userData) => {
    return api.put('/users/me', userData);
  },
};


export const exportAPI = {
  exportFormula: (id, format) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // Create a direct download by opening a new window with the token in the URL
    window.open(`${api.defaults.baseURL}/formulas/${id}/export?format=${format}&token=${token}`, '_blank');
    
    return Promise.resolve({ success: true });
  },
};
// Notion API functions
export const notionAPI = {
  getStatus: () => {
    return api.get('/notion/status');
  },
  connect: (data) => {
    return api.post('/notion/connect', data);
  },
  disconnect: () => {
    return api.delete('/notion/disconnect');
  },
  syncFormula: (formulaId) => {
    return api.post(`/notion/sync-formula/${formulaId}`);
  },
  syncAll: () => {
    return api.post('/notion/sync-all');
  }
};
// Formulas API
export const formulaAPI = {
// In your formulaAPI object
getFormulas: async () => {
  try {
    const response = await api.get('/formulas/read_formulas');
    console.log('Formulas response:', response.data); // Add this for debugging
    return response;
  } catch (error) {
    console.error('Error fetching formulas:', error);
    throw error;
  }
},
  duplicateFormula: (id: number, newName?: string) => {
    return api.post(`/formulas/duplicate/${id}`, { new_name: newName });
  },
  getInciList: (id, highlightAllergens = false) => {
    return api.get(`/formulas/${id}/inci-list?highlight_allergens=${highlightAllergens}`);
  },
  updateFormulaIngredients: (id: number, data: any) => {
    return api.put(`/formulas/${id}/ingredients`, data);
  },
  update_formula_documentation: (id, data) => {
    return api.put(`/formulas/${id}/documentation`, data);
  },
  updateFormulaSteps: (id: number, data: any) => {
    return api.put(`/formulas/${id}/steps`, data);
  },
  getFormula: (id: number) => {
    return api.get(`/formulas/${id}`);
  },
  createFormula: (data: FormulaData) => {
    return api.post('/formulas/create_formula', data);
  },
  updateFormula: (id: number, data: FormulaData) => {
    return api.put(`/formulas/${id}`, data);
  },
  deleteFormula: async (id) => {
    try {
      console.log(`Deleting formula with ID: ${id}`);
      return await api.delete(`/formulas/${id}`);
    } catch (error) {
      console.error('Error deleting formula:', error);
      throw error;
    }
  },
  
};

// AI Formula API
export const aiFormulaAPI = {
  generateFormula: (data) => {
    // Convert nested product_type object to flat structure if needed
    const requestData = { ...data };
    
    // Log the request for debugging
    console.log("AI Formula request data:", requestData);
    
    // Make the request
    return api.post('/ai-formula/generate_formula', requestData);
  },
  analyzeIngredients: (data) => {
    return api.post('/ai-formula/analyze', data);
  },
  checkIngredientCompatibility: (ingredientIds) => {
    return api.post('/ai-formula/check-compatibility', { ingredient_ids: ingredientIds });
  },
};

// Knowledge Base API functions
export const knowledgeAPI = {
  getCategories: async (params = {}) => {
    return api.get('/knowledge/categories', { params });
  },
  getArticles: async (params = {}) => {
    return api.get('/knowledge/articles', { params });
  },
  getArticle: async (slug) => {
    return api.get(`/knowledge/articles/${slug}`);
  },
  createArticle: async (data) => {
    return api.post('/knowledge/articles', data);
  },
  updateArticle: async (id, data) => {
    return api.put(`/knowledge/articles/${id}`, data);
  },
  deleteArticle: async (id) => {
    return api.delete(`/knowledge/articles/${id}`);
  },
  getTutorials: async (params = {}) => {
    return api.get('/knowledge/tutorials', { params });
  },
  getTutorial: async (id) => {
    return api.get(`/knowledge/tutorials/${id}`);
  },
  updateTutorialProgress: async (tutorialId, data) => {
    return api.post(`/knowledge/tutorials/${tutorialId}/progress`, data);
  }
};
// Add to src/services/api.ts

// Shop API functions

// Shop API endpoints
export const shopAPI = {
  // Products
  getProducts: (params) => api.get('/shop/products', { params }),
  getProduct: (slug) => api.get(`/shop/products/${slug}`),
  getProductCategories: (params) => api.get('/shop/categories', { params }),
  
  // Shopping Cart
  getCart: () => api.get('/shop/cart'),
  addToCart: (productData) => api.post('/shop/cart/items', productData),
  updateCartItem: (itemId, updateData) => api.put(`/shop/cart/items/${itemId}`, updateData),
  removeFromCart: (itemId) => api.delete(`/shop/cart/items/${itemId}`),
  
  // Orders
  createOrder: (shippingAddressId, paymentMethod, notes) => 
    api.post('/shop/orders', { 
        shipping_address_id: shippingAddressId, 
        payment_method: paymentMethod, 
        notes 
    }),
  getOrders: (params) => api.get('/shop/orders', { params }),
  getOrder: (orderId) => api.get(`/shop/orders/${orderId}`),
  
  // Shipping Addresses
  getShippingAddresses: () => api.get('/shop/shipping-addresses'),
  createShippingAddress: (addressData) => api.post('/shop/shipping-addresses', addressData),
  updateShippingAddress: (addressId, addressData) => api.put(`/shop/shipping-addresses/${addressId}`, addressData),
  deleteShippingAddress: (addressId) => api.delete(`/shop/shipping-addresses/${addressId}`),
  
  // Payment integration
  createStripeCheckoutSession: (orderId) => api.post(`/payments/create-checkout-session/${orderId}`),
};
// Updated ingredientAPI in api.ts
export const ingredientAPI = {
  getIngredients: async (params = {}) => {
    try {
      console.log('Fetching ingredients with params:', params);
      const response = await api.get('/ingredients/list', { params });
      console.log('Ingredients response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      // Re-throw the error so it can be properly handled by the component
      throw error;
    }
  },
  getIngredient: (id: number) => {
    return api.get(`/ingredients/${id}`);
  },
  getIngredientPhases: () => {
    try {
      return api.get('/ingredients/phases');
    } catch (error) {
      console.error('Error fetching ingredient phases:', error);
      throw error;
    }
  },
  getIngredientFunctions: () => {
    try {
      return api.get('/ingredients/functions');
    } catch (error) {
      console.error('Error fetching ingredient functions:', error);
      throw error;
    }
  },
};
export const userProfileAPI = {
  getUserProfile: () => {
    return api.get('/user/profile');
  },
  updateUserProfile: (profileData) => {
    return api.post('/user/profile', profileData);
  }
};


export const notificationAPI = {
  // Get user notifications with optional filtering
  getUserNotifications: async (skip = 0, limit = 100, unreadOnly = false) => {
    try {
      const response = await api.get('/notifications/', {
        params: {
          skip,
          limit,
          unread_only: unreadOnly
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  
  // Mark a single notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
  
  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
  
  // Get notification preferences
  getNotificationPreferences: async () => {
    try {
      console.log('Fetching notification preferences');
      const response = await api.get('/notifications/preferences');
      console.log('Received notification preferences:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  },
  
  // Update notification preferences for a specific type
  updateNotificationPreferences: async (notificationType, preferences) => {
    try {
      console.log(`Updating ${notificationType} preferences:`, preferences);
      
      // Format the data to match what the backend expects
      // The backend expects the exact structure in preferences
      const response = await api.put(`/notifications/preferences/${notificationType}`, preferences);
      console.log('Preference update response:', response.data);
      return response;
    } catch (error) {
      console.error(`Error updating ${notificationType} preferences:`, error.response || error);
      throw error;
    }
  }
};
export default {
  auth: authAPI,
  user: userAPI,
  payments: paymentsAPI,
  formula: formulaAPI,
  aiFormula: aiFormulaAPI,
  ingredient: ingredientAPI,
  knowledge: knowledgeAPI,
  shop: shopAPI,
  notification: notificationAPI,
  userProfile: userProfileAPI,
  export: exportAPI,
  notion: notionAPI,
};