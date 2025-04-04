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
  createCheckoutSession: (data: { subscription_type: string }) => {
    return api.post('/payments/create-checkout-session', data);
  },
  verifySession: (sessionId: string, subscriptionType?: string) => {
    return api.post('/payments/verify-session', { 
      session_id: sessionId,
      subscription_type: subscriptionType || localStorage.getItem('selectedPlan') || 'premium'
    });
  },
  createSubscription: (data: { plan: string, billing_cycle: string }) => {
    console.log('Creating subscription with data:', data);
    return api.post('/payments/create-subscription', data);
  },
  // Adding the confirmation and cancellation functions as well
  confirmSubscription: (data: { plan: string, billing_cycle: string }) => {
    return api.post('/payments/confirm-subscription', data);
  },
  cancelSubscription: () => {
    return api.post('/payments/cancel-subscription');
  },
};
// User API
export const userAPI = {
  getUserStatus: () => {
    return api.get('/users/status');
  },
  updateSubscription: (data: { subscription_type: string }) => {
    return api.post('/users/subscription', data);
  },
};

// Formulas API
export const formulaAPI = {
  getFormulas: () => {
    return api.get('/formulas/read_formulas');
  },
  duplicateFormula: (id: number, newName?: string) => {
    return api.post(`/formulas/duplicate/${id}`, { new_name: newName });
  },
  updateFormulaIngredients: (id: number, data: any) => {
    return api.put(`/formulas/${id}/ingredients`, data);
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
  deleteFormula: (id: number) => {
    return api.delete(`/formulas/${id}`);
  },
};

// AI Formula API
export const aiFormulaAPI = {
  generateFormula: (data: any) => { // Using 'any' here since AI data can vary
    return api.post('/ai-formula/generate_formula', data);
  },
  analyzeIngredients: (data: any) => {
    return api.post('/ai-formula/analyze', data);
  },
  checkIngredientCompatibility: (ingredientIds: number[]) => {
    return api.post('/ai-formula/check-compatibility', { ingredient_ids: ingredientIds });
  },
};

// Ingredients API
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
export default {
  auth: authAPI,
  user: userAPI,
  payments: paymentsAPI,
  formula: formulaAPI,
  aiFormula: aiFormulaAPI,
  ingredient: ingredientAPI,
};