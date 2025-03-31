import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formulaAPI, aiFormulaAPI, ingredientAPI } from '../services/api';

// Initial state for the formula context
const initialState = {
  // Current formula being created or edited
  currentFormula: {
    name: '',
    description: '',
    type: '',
    is_public: false,
    total_weight: 100.0,
    ingredients: [],
    steps: []
  },
  // Available ingredients from the database
  availableIngredients: [],
  // Ingredient phases (water phase, oil phase, etc.)
  ingredientPhases: [],
  // Ingredient functions (emollient, preservative, etc.)
  ingredientFunctions: [],
  // User's saved formulas
  savedFormulas: [],
  // Compatibility issues between ingredients
  compatibilityIssues: [],
  // Loading states for various operations
  isLoading: {
    ingredients: false,
    formulaCreation: false,
    formulaSaving: false,
    formulaFetching: false,
    aiRecommendation: false
  },
  // Error states
  errors: {
    ingredients: null,
    formulaCreation: null,
    formulaSaving: null,
    formulaFetching: null,
    aiRecommendation: null
  },
  // UI state for formula creation wizard
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

// Reducer function
const formulaReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_FORMULA:
      return {
        ...state,
        currentFormula: action.payload,
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
      // Add ingredient with correct order
      const newIngredients = [
        ...state.currentFormula.ingredients,
        {
          ...action.payload,
          order: state.currentFormula.ingredients.length + 1
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
        availableIngredients: action.payload
      };
    
    case actionTypes.SET_INGREDIENT_PHASES:
      return {
        ...state,
        ingredientPhases: action.payload
      };
    
    case actionTypes.SET_INGREDIENT_FUNCTIONS:
      return {
        ...state,
        ingredientFunctions: action.payload
      };
    
    case actionTypes.SET_SAVED_FORMULAS:
      return {
        ...state,
        savedFormulas: action.payload
      };
    
    case actionTypes.SET_COMPATIBILITY_ISSUES:
      return {
        ...state,
        compatibilityIssues: action.payload
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
      // Add step with correct order
      const newSteps = [
        ...state.currentFormula.steps,
        {
          ...action.payload,
          order: state.currentFormula.steps.length + 1
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
      return {
        ...state,
        currentFormula: {
          ...state.currentFormula,
          ...action.payload,
          // If user has already named the formula, keep their name
          name: state.currentFormula.name || action.payload.name,
        },
        wizard: {
          ...state.wizard,
          isDirty: true
        }
      };
    
    default:
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
      localStorage.setItem('formulaDraft', JSON.stringify(state.currentFormula));
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
    const ingredientIds = state.currentFormula.ingredients.map(ing => ing.ingredient_id);
    
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
  
  const generateAIFormula = async (productType, skinConcerns, preferredIngredients, avoidedIngredients) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: { key: 'aiRecommendation', value: true } });
    dispatch({ type: actionTypes.SET_ERROR, payload: { key: 'aiRecommendation', value: null } });
    
    try {
      const response = await aiFormulaAPI.generateFormula({
        product_type: productType,
        skin_concerns: skinConcerns,
        preferred_ingredients: preferredIngredients,
        avoided_ingredients: avoidedIngredients
      });
      
      // Apply the AI-generated formula
      dispatch({
        type: actionTypes.APPLY_AI_RECOMMENDATION,
        payload: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating AI formula:', error);
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: { key: 'aiRecommendation', value: error.response?.data?.detail || 'Failed to generate formula' }
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
      let response;
      
      // Format the formula data for API
      const formulaData = {
        ...state.currentFormula,
        ingredients: state.currentFormula.ingredients.map(ing => ({
          ingredient_id: ing.ingredient_id,
          percentage: parseFloat(ing.percentage),
          order: ing.order
        })),
        steps: state.currentFormula.steps.map(step => ({
          description: step.description,
          order: step.order
        }))
      };
      
      response = await formulaAPI.createFormula(formulaData);
      
      // Update saved formulas list
      await fetchSavedFormulas();
      
      // Clear draft formula from localStorage
      localStorage.removeItem('formulaDraft');
      
      // Reset form dirty state
      dispatch({ type: actionTypes.SET_WIZARD_DIRTY, payload: false });
      
      return response.data;
    } catch (error) {
      console.error('Error saving formula:', error);
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: { key: 'formulaSaving', value: error.response?.data?.detail || 'Failed to save formula' }
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