// frontend/src/components/Cost/CostInput.jsx
import React, { useState, useEffect } from 'react';
import { costsAPI } from '../../services/api';

/**
 * CostInput component for entering ingredient cost information
 * Supports multiple input methods and currencies
 */
const CostInput = ({ 
  ingredient, 
  onCostUpdate, 
  onClose, 
  showTitle = true 
}) => {
  const [inputMethod, setInputMethod] = useState('per_unit'); // 'per_unit' or 'total_purchase'
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [costData, setCostData] = useState({
    // Per unit inputs
    cost_per_gram: ingredient?.cost_per_gram || '',
    cost_per_oz: ingredient?.cost_per_oz || '',
    
    // Total purchase inputs
    purchase_cost: ingredient?.purchase_cost || '',
    purchase_quantity: ingredient?.purchase_quantity || '',
    purchase_unit: ingredient?.purchase_unit || 'g',
    
    // Common fields
    currency: ingredient?.currency || 'USD',
    supplier_name: ingredient?.supplier_name || '',
    supplier_sku: ingredient?.supplier_sku || '',
    shipping_cost: ingredient?.shipping_cost || ''
  });

  const unitOptions = [
    { value: 'g', label: 'Grams (g)' },
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'l', label: 'Liters (l)' }
  ];

  // Load currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await costsAPI.getSupportedCurrencies();
        setCurrencies(response.data || []);
      } catch (err) {
        console.error('Failed to load currencies:', err);
        // Default currencies if API fails
        setCurrencies([
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' },
          { code: 'GBP', name: 'British Pound', symbol: '£' },
          { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }
        ]);
      }
    };

    loadCurrencies();
  }, []);

  // Determine which input method to show initially
  useEffect(() => {
    if (ingredient?.purchase_cost && ingredient?.purchase_quantity) {
      setInputMethod('total_purchase');
    } else if (ingredient?.cost_per_gram || ingredient?.cost_per_oz) {
      setInputMethod('per_unit');
    }
  }, [ingredient]);

  const handleInputChange = (field, value) => {
    setCostData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Prepare data based on input method
      const updateData = {
        currency: costData.currency,
        supplier_name: costData.supplier_name || null,
        supplier_sku: costData.supplier_sku || null,
        shipping_cost: costData.shipping_cost ? parseFloat(costData.shipping_cost) : null,
      };

      if (inputMethod === 'per_unit') {
        // Per unit input
        if (costData.cost_per_gram) {
          updateData.cost_per_gram = parseFloat(costData.cost_per_gram);
        }
        if (costData.cost_per_oz) {
          updateData.cost_per_oz = parseFloat(costData.cost_per_oz);
        }
      } else {
        // Total purchase input
        if (costData.purchase_cost && costData.purchase_quantity) {
          updateData.purchase_cost = parseFloat(costData.purchase_cost);
          updateData.purchase_quantity = parseFloat(costData.purchase_quantity);
          updateData.purchase_unit = costData.purchase_unit;
        }
      }

      // Call API to update ingredient cost
      const response = await costsAPI.updateIngredientCost(ingredient.id, updateData);
      
      if (onCostUpdate) {
        onCostUpdate(response.data);
      }
      
      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.error('Failed to update ingredient cost:', err);
      setError(err.response?.data?.detail || 'Failed to update cost information');
    } finally {
      setLoading(false);
    }
  };

  const selectedCurrency = currencies.find(c => c.code === costData.currency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
      {showTitle && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Update Cost for {ingredient?.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            INCI: {ingredient?.inci_name}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Input Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          How do you want to enter the cost?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setInputMethod('per_unit')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              inputMethod === 'per_unit'
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-white">Cost per unit</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Enter cost per gram or ounce directly
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setInputMethod('total_purchase')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              inputMethod === 'total_purchase'
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
            }`}
          >
            <div className="font-medium text-gray-900 dark:text-white">Total purchase</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Enter total cost and quantity purchased
            </div>
          </button>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Currency
        </label>
        <select
          value={costData.currency}
          onChange={(e) => handleInputChange('currency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
        >
          {currencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name} ({currency.code})
            </option>
          ))}
        </select>
      </div>

      {/* Cost Input Fields */}
      <div className="mb-6">
        {inputMethod === 'per_unit' ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Cost per unit</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cost per gram
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    {selectedCurrency?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={costData.cost_per_gram}
                    onChange={(e) => handleInputChange('cost_per_gram', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cost per ounce
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    {selectedCurrency?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costData.cost_per_oz}
                    onChange={(e) => handleInputChange('cost_per_oz', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Purchase information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total cost paid
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">
                    {selectedCurrency?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costData.purchase_cost}
                    onChange={(e) => handleInputChange('purchase_cost', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity purchased
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costData.purchase_quantity}
                  onChange={(e) => handleInputChange('purchase_quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit
                </label>
                <select
                  value={costData.purchase_unit}
                  onChange={(e) => handleInputChange('purchase_unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                >
                  {unitOptions.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mb-6 space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Additional information (optional)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supplier name
            </label>
            <input
              type="text"
              value={costData.supplier_name}
              onChange={(e) => handleInputChange('supplier_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Lotioncrafter, MakingCosmetics"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supplier SKU
            </label>
            <input
              type="text"
              value={costData.supplier_sku}
              onChange={(e) => handleInputChange('supplier_sku', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              placeholder="Product code or SKU"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shipping cost
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-gray-500">
              {selectedCurrency?.symbol || '$'}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={costData.shipping_cost}
              onChange={(e) => handleInputChange('shipping_cost', e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Additional shipping cost allocated to this ingredient
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
          >
            Cancel
          </button>
        )}
        
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none disabled:opacity-50 flex items-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Saving...' : 'Save Cost Information'}
        </button>
      </div>
    </div>
  );
};

export default CostInput;