// FormulaContext.jsx - Complete Version
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formulaAPI, aiFormulaAPI, ingredientAPI } from '../services/api';

// Initial state for the formula context - ensure arrays are initialized properly
const initialState = {
  currentFormula: {
    name: '',
    description: '',
    type: '',
    is_public: false,
    total_weight: 100.0,
    ingredients: [], // Initialize as empty array
    steps: []        // Initialize as empty array
  },
  availableIngredients: [],
  ingredientPhases: [],
  ingredientFunctions: [],
  savedFormulas: [],
  compatibilityIssues: [],
  isLoading: {
    ingredients: false,
    formulaCreation: false,
    formulaSaving: false,
    formulaFetching: false,
    aiRecommendation: false
  },
  errors: {
    ingredients: null,
    formulaCreation: null,
    formulaSaving: null,
    formulaFetching: null,
    aiRecommendation: null
  },
  wizard: {
    currentStep: 0,
    totalSteps: 4,
    isDirty: false
  }
};

// Action types
const actionTypes = {
  SET_CURRENT_FORMULA: 'SET_CURRENT_FORMULA',
  UPDATE_FORMULA_FIELD: 'UPDATE_FORMULA_FIELD',
  ADD_INGREDIENT: 'ADD_INGREDIENT',
  REMOVE_INGREDIENT: 'REMOVE_INGREDIENT',
  UPDATE_INGREDIENT: 'UPDATE_INGREDIENT',
  SET_AVAILABLE_INGREDIENTS: 'SET_AVAILABLE_INGREDIENTS',
  SET_INGREDIENT_PHASES: 'SET_INGREDIENT_PHASES',
  SET_INGREDIENT_FUNCTIONS: 'SET_INGREDIENT_FUNCTIONS',
  SET_SAVED_FORMULAS: 'SET_SAVED_FORMULAS',
  SET_COMPATIBILITY_ISSUES: 'SET_COMPATIBILITY_ISSUES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_FORMULA: 'RESET_FORMULA',
  SET_WIZARD_STEP: 'SET_WIZARD_STEP',
  SET_WIZARD_DIRTY: 'SET_WIZARD_DIRTY',
  ADD_FORMULA_STEP: 'ADD_FORMULA_STEP',
  UPDATE_FORMULA_STEP: 'UPDATE_FORMULA_STEP',
  REMOVE_FORMULA_STEP: 'REMOVE_FORMULA_STEP',
  APPLY_AI_RECOMMENDATION: 'APPLY_AI_RECOMMENDATION'
};

// Improved reducer with additional null checks and error handling
const formulaReducer = (state, action) => {
  try {
    switch (action.type) {
      case actionTypes.SET_CURRENT_FORMULA:
        return {
          ...state,
          currentFormula: {
            ...initialState.currentFormula, // Make sure we have all default fields
            ...(action.payload || {}),      // Then apply payload values
            // Ensure these are arrays even if not present in payload
            ingredients: action.payload?.ingredients || [],
            steps: action.payload?.steps || []
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.UPDATE_FORMULA_FIELD:
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            [action.payload.field]: action.payload.value
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.ADD_INGREDIENT:
        // Ensure ingredients array exists before adding to it
        const currentIngredients = state.currentFormula.ingredients || [];
        const newIngredients = [
          ...currentIngredients,
          {
            ...action.payload,
            order: currentIngredients.length + 1
          }
        ];
        
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            ingredients: newIngredients
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.REMOVE_INGREDIENT:
        // Check if ingredients array exists
        if (!state.currentFormula.ingredients) {
          return state;
        }
        
        // Remove ingredient and re-order remaining ingredients
        const filteredIngredients = state.currentFormula.ingredients
          .filter(ing => ing.ingredient_id !== action.payload)
          .map((ing, index) => ({
            ...ing,
            order: index + 1
          }));
        
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            ingredients: filteredIngredients
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.UPDATE_INGREDIENT:
        // Check if ingredients array exists
        if (!state.currentFormula.ingredients) {
          return state;
        }
        
        // Update specific ingredient properties
        const updatedIngredients = state.currentFormula.ingredients.map(ing => 
          ing.ingredient_id === action.payload.ingredient_id
            ? { ...ing, ...action.payload }
            : ing
        );
        
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            ingredients: updatedIngredients
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.SET_AVAILABLE_INGREDIENTS:
        return {
          ...state,
          availableIngredients: action.payload || []
        };
      
      case actionTypes.SET_INGREDIENT_PHASES:
        return {
          ...state,
          ingredientPhases: action.payload || []
        };
      
      case actionTypes.SET_INGREDIENT_FUNCTIONS:
        return {
          ...state,
          ingredientFunctions: action.payload || []
        };
      
      case actionTypes.SET_SAVED_FORMULAS:
        return {
          ...state,
          savedFormulas: action.payload || []
        };
      
      case actionTypes.SET_COMPATIBILITY_ISSUES:
        return {
          ...state,
          compatibilityIssues: action.payload || []
        };
      
      case actionTypes.SET_LOADING:
        return {
          ...state,
          isLoading: {
            ...state.isLoading,
            [action.payload.key]: action.payload.value
          }
        };
      
      case actionTypes.SET_ERROR:
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.payload.key]: action.payload.value
          }
        };
      
      case actionTypes.RESET_FORMULA:
        return {
          ...state,
          currentFormula: initialState.currentFormula,
          compatibilityIssues: [],
          wizard: {
            ...state.wizard,
            currentStep: 0,
            isDirty: false
          }
        };
      
      case actionTypes.SET_WIZARD_STEP:
        return {
          ...state,
          wizard: {
            ...state.wizard,
            currentStep: action.payload
          }
        };
      
      case actionTypes.SET_WIZARD_DIRTY:
        return {
          ...state,
          wizard: {
            ...state.wizard,
            isDirty: action.payload
          }
        };
      
      case actionTypes.ADD_FORMULA_STEP:
        // Ensure steps array exists
        const currentSteps = state.currentFormula.steps || [];
        
        // Add step with correct order
        const newSteps = [
          ...currentSteps,
          {
            ...action.payload,
            order: currentSteps.length + 1
          }
        ];
        
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            steps: newSteps
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.UPDATE_FORMULA_STEP:
        // Check if steps array exists
        if (!state.currentFormula.steps) {
          return state;
        }
        
        // Update specific step
        const updatedSteps = state.currentFormula.steps.map(step => 
          step.order === action.payload.order
            ? { ...step, ...action.payload }
            : step
        );
        
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            steps: updatedSteps
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.REMOVE_FORMULA_STEP:
        // Check if steps array exists
        if (!state.currentFormula.steps) {
          return state;
        }
        
        // Remove step and re-order remaining steps
        const filteredSteps = state.currentFormula.steps
          .filter(step => step.order !== action.payload)
          .map((step, index) => ({
            ...step,
            order: index + 1
          }));
        
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            steps: filteredSteps
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      case actionTypes.APPLY_AI_RECOMMENDATION:
        // Apply AI-generated formula while preserving any user modifications
        // Make sure to initialize empty arrays if they don't exist in the payload
        const aiFormula = action.payload || {};
        
        return {
          ...state,
          currentFormula: {
            ...state.currentFormula,
            ...aiFormula,
            // If user has already named the formula, keep their name
            name: state.currentFormula.name || aiFormula.name || '',
            // Ensure these are arrays
            ingredients: aiFormula.ingredients || state.currentFormula.ingredients || [],
            steps: aiFormula.steps || state.currentFormula.steps || []
          },
          wizard: {
            ...state.wizard,
            isDirty: true
          }
        };
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Error in formula reducer:', error);
    // Return unchanged state in case of error
    return state;
  }
};

// Create context
const FormulaContext = createContext();

// Context provider component
export const FormulaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formulaReducer, initialState);
  
  // Load initial data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load available ingredients
        await fetchIngredients();
        // Load ingredient phases
        await fetchIngredientPhases();
        // Load ingredient functions
        await fetchIngredientFunctions();
        // Load user's saved formulas
        await fetchSavedFormulas();
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
    
    // Try to load draft formula from localStorage
    const draftFormula = localStorage.getItem('formulaDraft');
    if (draftFormula) {
      try {
        const parsedDraft = JSON.parse(draftFormula);
        dispatch({
          type: actionTypes.SET_CURRENT_FORMULA,
          payload: parsedDraft
        });
      } catch (error) {
        console.error('Error loading draft formula:', error);
        localStorage.removeItem('formulaDraft');
      }
    }
  }, []);
  
  // Save draft formula to localStorage when it changes
  useEffect(() => {
    if (state.wizard.isDirty) {
      try {
        localStorage.setItem('formulaDraft', JSON.stringify(state.currentFormula));
      } catch (error) {
        console.error('Error saving draft formula:', error);
      }
    }
  }, [state.currentFormula, state.wizard.isDirty]);
  
  // API interaction functions
  const fetchIngredients = async (params = {}) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'ingredients', value: true } });
    dispatch({ type: actionTypes.SET_ERROR, payload: { key: 'ingredients', value: null } });
    
    try {
      const response = await ingredientAPI.getIngredients(params);
      dispatch({
        type: actionTypes.SET_AVAILABLE_INGREDIENTS,
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: { key: 'ingredients', value: error.message || 'Failed to fetch ingredients' }
      });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'ingredients', value: false } });
    }
  };
  
  const fetchIngredientPhases = async () => {
    try {
      const response = await ingredientAPI.getIngredientPhases();
      dispatch({
        type: actionTypes.SET_INGREDIENT_PHASES,
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching ingredient phases:', error);
    }
  };
  
  const fetchIngredientFunctions = async () => {
    try {
      const response = await ingredientAPI.getIngredientFunctions();
      dispatch({
        type: actionTypes.SET_INGREDIENT_FUNCTIONS,
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching ingredient functions:', error);
    }
  };
  
  const fetchSavedFormulas = async () => {
    dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'formulaFetching', value: true } });
    dispatch({ type: actionTypes.SET_ERROR, payload: { key: 'formulaFetching', value: null } });
    
    try {
      const response = await formulaAPI.getFormulas();
      dispatch({
        type: actionTypes.SET_SAVED_FORMULAS,
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching saved formulas:', error);
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: { key: 'formulaFetching', value: error.message || 'Failed to fetch saved formulas' }
      });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'formulaFetching', value: false } });
    }
  };
  
  const checkIngredientCompatibility = async () => {
    const ingredientIds = state.currentFormula.ingredients?.map(ing => ing.ingredient_id) || [];
    
    if (ingredientIds.length < 2) {
      dispatch({
        type: actionTypes.SET_COMPATIBILITY_ISSUES,
        payload: []
      });
      return;
    }
    
    try {
      const response = await aiFormulaAPI.checkIngredientCompatibility(ingredientIds);
      dispatch({
        type: actionTypes.SET_COMPATIBILITY_ISSUES,
        payload: response.data.issues || []
      });
    } catch (error) {
      console.error('Error checking ingredient compatibility:', error);
    }
  };
  
  // Enhanced AI formula generation function that accepts comprehensive user data
  
// Update the generateAIFormula function in FormulaContext.jsx to return the formula ID

const generateAIFormula = async (formulaData) => {
  dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'aiRecommendation', value: true } });
  dispatch({ type: actionTypes.SET_ERROR, payload: { key: 'aiRecommendation', value: null } });
  
  try {
    // Check if this is questionnaire data (new format) or legacy data
    const isQuestionnaireFormat = formulaData.product_category && formulaData.formula_types;
    
    if (isQuestionnaireFormat) {
      // Use new questionnaire endpoint
      console.log('Using questionnaire format:', formulaData);
      
      const response = await aiFormulaAPI.generateFormulaFromQuestionnaire(formulaData);
      
      // Apply the AI-generated formula
      dispatch({
        type: actionTypes.APPLY_AI_RECOMMENDATION,
        payload: response.data
      });
      
      console.log('AI-generated formula:', response.data);
      return response.data;
    } else {
      // Legacy format - ensure we have a product type (required)
      if (!formulaData.product_type) {
        throw new Error('Product type is required');
      }
      
      // Create a sanitized copy to avoid mutating the original data
      const sanitizedData = { ...formulaData };
      
      // Define all fields that must be arrays
      const arrayFields = [
        'skin_concerns', 'sensitivities', 'preferred_textures', 
        'preferred_product_types', 'lifestyle_factors', 'sales_channels',
        'performance_goals', 'desired_certifications', 'preferred_ingredients',
        'avoided_ingredients', 'hair_concerns', 'target_markets'
      ];
      
      // Ensure these fields are arrays
      arrayFields.forEach(field => {
        if (sanitizedData[field] !== undefined) {
          if (!Array.isArray(sanitizedData[field])) {
            // If it's a string that looks like a JSON array, parse it
            if (typeof sanitizedData[field] === 'string' && 
                (sanitizedData[field].startsWith('[') && sanitizedData[field].endsWith(']'))) {
              try {
                sanitizedData[field] = JSON.parse(sanitizedData[field]);
              } catch (e) {
                console.warn(`Field ${field} looks like JSON but failed to parse:`, e);
                sanitizedData[field] = [];
              }
            } else {
              // Not an array and not a parseable string - use empty array
              console.warn(`Field ${field} is not an array, using empty array instead of:`, sanitizedData[field]);
              sanitizedData[field] = [];
            }
          }
        } else {
          // Field is missing - provide empty array
          sanitizedData[field] = [];
        }
      });
      
      // Special handling for brand_info if it exists
      if (sanitizedData.brand_info && typeof sanitizedData.brand_info === 'object') {
        const brandFields = ['target_markets', 'sales_channels', 'performance_goals', 'desired_certifications'];
        
        brandFields.forEach(field => {
          if (sanitizedData.brand_info[field] !== undefined) {
            if (!Array.isArray(sanitizedData.brand_info[field])) {
              if (typeof sanitizedData.brand_info[field] === 'string' && 
                  sanitizedData.brand_info[field].startsWith('[') && 
                  sanitizedData.brand_info[field].endsWith(']')) {
                try {
                  sanitizedData.brand_info[field] = JSON.parse(sanitizedData.brand_info[field]);
                } catch (e) {
                  console.warn(`brand_info.${field} looks like JSON but failed to parse:`, e);
                  sanitizedData.brand_info[field] = [];
                }
              } else {
                sanitizedData.brand_info[field] = [];
              }
            }
          } else {
            sanitizedData.brand_info[field] = [];
          }
        });
      }
      
      console.log('Sending sanitized formula data to legacy API:', sanitizedData);
      
      // Send sanitized data to the legacy API
      const response = await aiFormulaAPI.generateFormula(sanitizedData);
      
      // Apply the AI-generated formula
      dispatch({
        type: actionTypes.APPLY_AI_RECOMMENDATION,
        payload: response.data
      });
      
      console.log('AI-generated formula:', response.data);
      
      // Return the full response data so components can access the formula ID
      return response.data;
    }
  } catch (error) {
    console.error('Error generating AI formula:', error);
    
    let errorMessage = 'Failed to generate formula';
    
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
      
      if (error.response.data && error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          // This is typical for FastAPI validation errors
          errorMessage = error.response.data.detail
            .map(err => err.msg || JSON.stringify(err))
            .join(', ');
        } else {
          errorMessage = error.response.data.detail;
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: { key: 'aiRecommendation', value: errorMessage }
    });
    
    throw error;
  } finally {
    dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'aiRecommendation', value: false } });
  }
};
const saveFormula = async () => {
    dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'formulaSaving', value: true } });
    dispatch({ type: actionTypes.SET_ERROR, payload: { key: 'formulaSaving', value: null } });
    
    try {
      // Format the formula data for API
      const formulaData = {
        ...state.currentFormula,
        ingredients: state.currentFormula.ingredients?.map(ing => ({
          ingredient_id: ing.ingredient_id,
          percentage: parseFloat(ing.percentage || 0), // Handle undefined
          order: ing.order || 0 // Handle undefined
        })) || [],
        steps: state.currentFormula.steps?.map(step => ({
          description: step.description,
          order: step.order || 0 // Handle undefined
        })) || []
      };
      
      // Log the data being sent for debugging
      console.log('Saving formula data:', formulaData);
      
      // Set a timeout to avoid hanging forever
      const response = await Promise.race([
        formulaAPI.createFormula(formulaData),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 30000))
      ]);
      
      // Clear draft formula from localStorage
      localStorage.removeItem('formulaDraft');
      
      // Reset form dirty state
      dispatch({ type: actionTypes.SET_WIZARD_DIRTY, payload: false });
      
      return response.data;
    } catch (error) {
      console.error('Error saving formula:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to save formula';
      dispatch({
        type: actionTypes.SET_ERROR, 
        payload: { key: 'formulaSaving', value: errorMessage }
      });
      throw error;
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'formulaSaving', value: false } });
    }
  };
  
  // Provide value to consumers
  const contextValue = {
    ...state,
    dispatch,
    // Action creators
    setCurrentFormula: (formula) => dispatch({
      type: actionTypes.SET_CURRENT_FORMULA,
      payload: formula
    }),
    updateFormulaField: (field, value) => dispatch({
      type: actionTypes.UPDATE_FORMULA_FIELD,
      payload: { field, value }
    }),
    addIngredient: (ingredient) => {
      dispatch({
        type: actionTypes.ADD_INGREDIENT,
        payload: ingredient
      });
      // Check compatibility whenever ingredients change
      setTimeout(checkIngredientCompatibility, 100);
    },
    removeIngredient: (ingredientId) => {
      dispatch({
        type: actionTypes.REMOVE_INGREDIENT,
        payload: ingredientId
      });
      // Check compatibility whenever ingredients change
      setTimeout(checkIngredientCompatibility, 100);
    },
    updateIngredient: (ingredient) => {
      dispatch({
        type: actionTypes.UPDATE_INGREDIENT,
        payload: ingredient
      });
      // Check compatibility whenever ingredients change
      setTimeout(checkIngredientCompatibility, 100);
    },
    addFormulaStep: (step) => dispatch({
      type: actionTypes.ADD_FORMULA_STEP,
      payload: step
    }),
    updateFormulaStep: (step) => dispatch({
      type: actionTypes.UPDATE_FORMULA_STEP,
      payload: step
    }),
    removeFormulaStep: (stepOrder) => dispatch({
      type: actionTypes.REMOVE_FORMULA_STEP,
      payload: stepOrder
    }),
    resetFormula: () => {
      dispatch({ type: actionTypes.RESET_FORMULA });
      localStorage.removeItem('formulaDraft');
    },
    setWizardStep: (step) => dispatch({
      type: actionTypes.SET_WIZARD_STEP,
      payload: step
    }),
    // API interaction methods
    fetchIngredients,
    fetchSavedFormulas,
    checkIngredientCompatibility,
    generateAIFormula,
    saveFormula
  };
  
  return (
    <FormulaContext.Provider value={contextValue}>
      {children}
    </FormulaContext.Provider>
  );
};

// Custom hook for using formula context
export const useFormula = () => {
  const context = useContext(FormulaContext);
  if (!context) {
    throw new Error('useFormula must be used within a FormulaProvider');
  }
  return context;
};

export default FormulaContext;