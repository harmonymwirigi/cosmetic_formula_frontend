// frontend/src/components/Cost/BatchSizeSelector.jsx
import React, { useState, useEffect } from 'react';
import { costsAPI } from '../../services/api';

/**
 * BatchSizeSelector component for configuring formula batch sizes
 */
const BatchSizeSelector = ({ 
  formula, 
  onBatchSizeChange, 
  onSave,
  showSaveButton = true,
  className = ''
}) => {
  const [batchSize, setBatchSize] = useState(formula?.batch_size || formula?.total_weight || 100);
  const [batchUnit, setBatchUnit] = useState(formula?.batch_unit || 'g');
  const [customSize, setCustomSize] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const unitOptions = [
    { value: 'g', label: 'Grams', symbol: 'g' },
    { value: 'oz', label: 'Ounces', symbol: 'oz' },
    { value: 'kg', label: 'Kilograms', symbol: 'kg' },
    { value: 'lb', label: 'Pounds', symbol: 'lb' }
  ];

  const commonBatchSizes = {
    'g': [50, 100, 250, 500, 1000],
    'oz': [2, 4, 8, 16, 32],
    'kg': [0.5, 1, 2.5, 5, 10],
    'lb': [0.25, 0.5, 1, 2, 5]
  };

  // Update parent component when values change
  useEffect(() => {
    if (onBatchSizeChange) {
      onBatchSizeChange(batchSize, batchUnit);
    }
  }, [batchSize, batchUnit, onBatchSizeChange]);

  const handleBatchSizeSelect = (size) => {
    setBatchSize(size);
    setShowCustomInput(false);
    setCustomSize('');
  };

  const handleCustomSizeSubmit = () => {
    const customValue = parseFloat(customSize);
    if (customValue && customValue > 0) {
      setBatchSize(customValue);
      setShowCustomInput(false);
      setCustomSize('');
    }
  };

  const handleUnitChange = (newUnit) => {
    setBatchUnit(newUnit);
    // Reset to first common size for new unit
    const commonSizes = commonBatchSizes[newUnit];
    if (commonSizes && commonSizes.length > 0) {
      setBatchSize(commonSizes[0]);
    }
  };

  const handleSave = async () => {
    if (!formula?.id) return;

    setSaving(true);
    setError('');

    try {
      await costsAPI.updateFormulaBatchSize(formula.id, batchSize, batchUnit);
      
      if (onSave) {
        onSave(batchSize, batchUnit);
      }
    } catch (err) {
      console.error('Failed to update batch size:', err);
      setError(err.response?.data?.detail || 'Failed to update batch size');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentUnit = () => {
    return unitOptions.find(unit => unit.value === batchUnit);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="space-y-4">
        {/* Unit Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {unitOptions.map(unit => (
              <button
                key={unit.value}
                onClick={() => handleUnitChange(unit.value)}
                className={`p-2 rounded-md border text-sm font-medium transition-all ${
                  batchUnit === unit.value
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-violet-300 text-gray-700 dark:text-gray-300'
                }`}
              >
                {unit.label}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Size Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Batch Size
          </label>
          
          {/* Common Sizes */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
            {commonBatchSizes[batchUnit]?.map(size => (
              <button
                key={size}
                onClick={() => handleBatchSizeSelect(size)}
                className={`p-2 rounded-md border text-sm font-medium transition-all ${
                  batchSize === size
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-violet-300 text-gray-700 dark:text-gray-300'
                }`}
              >
                {size} {getCurrentUnit()?.symbol}
              </button>
            ))}
          </div>

          {/* Custom Size Input */}
          <div className="flex items-center space-x-2">
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
              >
                + Custom size
              </button>
            ) : (
              <>
                <input
                  type="number"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="Enter custom size"
                  className="flex-1 max-w-xs px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomSizeSubmit();
                    }
                  }}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getCurrentUnit()?.symbol}
                </span>
                <button
                  onClick={handleCustomSizeSubmit}
                  className="px-3 py-2 text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700"
                >
                  Set
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomSize('');
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="bg-gray-50 dark:bg-gray-750 rounded-md p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">Current batch size:</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {batchSize} {getCurrentUnit()?.symbol}
          </div>
          
          {/* Show conversions */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            {batchUnit !== 'g' && (
              <div>≈ {(batchSize * (batchUnit === 'oz' ? 28.35 : batchUnit === 'kg' ? 1000 : batchUnit === 'lb' ? 453.6 : 1)).toFixed(1)}g</div>
            )}
            {batchUnit !== 'oz' && (
              <div>≈ {(batchSize / (batchUnit === 'g' ? 28.35 : batchUnit === 'kg' ? 35.27 : batchUnit === 'lb' ? 16 : 1)).toFixed(2)}oz</div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Save Button */}
        {showSaveButton && formula?.id && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none disabled:opacity-50"
            >
              {saving && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Batch Size'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchSizeSelector;