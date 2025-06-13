// frontend/src/components/Cost/CostSummary.jsx
import React, { useState, useEffect } from 'react';
import { costsAPI } from '../../services/api';

/**
 * CostSummary component displays comprehensive cost breakdown for a formula
 */
const CostSummary = ({ 
  formulaId, 
  batchSize, 
  batchUnit = 'g', 
  currency = 'USD',
  showDetailedBreakdown = true,
  className = ''
}) => {
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedView, setExpandedView] = useState(false);

  // Load cost breakdown
  useEffect(() => {
    if (formulaId) {
      loadCostBreakdown();
    }
  }, [formulaId, batchSize, batchUnit, currency]);

  const loadCostBreakdown = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await costsAPI.calculateFormulaCostBreakdown(formulaId, {
        batch_size: batchSize,
        batch_unit: batchUnit,
        target_currency: currency
      });

      setCostBreakdown(response.data);
    } catch (err) {
      console.error('Failed to load cost breakdown:', err);
      setError(err.response?.data?.detail || 'Failed to calculate costs');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currencyCode = currency) => {
    const currencySymbols = {
      'USD': ',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C,
      'AUD': 'A,
      'JPY': '¥'
    };

    const symbol = currencySymbols[currencyCode] || currencyCode;
    
    if (amount === null || amount === undefined) {
      return `${symbol}--`;
    }

    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const getCostPercentage = (ingredientCost, totalCost) => {
    if (!totalCost || totalCost === 0) return 0;
    return ((ingredientCost / totalCost) * 100).toFixed(1);
  };

  const getMostExpensiveIngredients = () => {
    if (!costBreakdown?.ingredient_costs) return [];
    return [...costBreakdown.ingredient_costs]
      .sort((a, b) => b.total_cost - a.total_cost)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Calculating costs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <button
            onClick={loadCostBreakdown}
            className="mt-2 text-violet-600 hover:text-violet-700 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!costBreakdown) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No cost data available
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cost Breakdown
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {costBreakdown.batch_size} {costBreakdown.batch_unit} batch • {currency}
            </p>
          </div>
          
          {showDetailedBreakdown && (
            <button
              onClick={() => setExpandedView(!expandedView)}
              className="text-violet-600 hover:text-violet-700 text-sm font-medium"
            >
              {expandedView ? 'Show less' : 'Show details'}
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Batch Cost */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
            <div className="text-sm font-medium text-violet-600 dark:text-violet-400">
              Total Batch Cost
            </div>
            <div className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-1">
              {formatCurrency(costBreakdown.total_batch_cost)}
            </div>
          </div>

          {/* Cost per Gram */}
          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Cost per Gram
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {formatCurrency(costBreakdown.cost_per_gram)}
            </div>
          </div>

          {/* Cost per Ounce */}
          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Cost per Ounce
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {formatCurrency(costBreakdown.cost_per_oz)}
            </div>
          </div>
        </div>

        {/* Missing Cost Ingredients Warning */}
        {costBreakdown.missing_cost_ingredients && costBreakdown.missing_cost_ingredients.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Missing cost data
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  {costBreakdown.missing_cost_ingredients.length} ingredient(s) don't have cost information: {' '}
                  <span className="font-medium">
                    {costBreakdown.missing_cost_ingredients.join(', ')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Overview - Top 3 Most Expensive */}
        {!expandedView && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Most expensive ingredients
            </h4>
            <div className="space-y-2">
              {getMostExpensiveIngredients().map((ingredient, index) => (
                <div key={ingredient.ingredient_id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {ingredient.ingredient_name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({ingredient.percentage}%)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(ingredient.total_cost)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getCostPercentage(ingredient.total_cost, costBreakdown.total_batch_cost)}% of total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        {expandedView && showDetailedBreakdown && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Complete ingredient breakdown
            </h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ingredient
                    </th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      %
                    </th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Needed
                    </th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cost/g
                    </th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      % of Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {costBreakdown.ingredient_costs
                    .sort((a, b) => b.total_cost - a.total_cost)
                    .map((ingredient) => (
                    <tr key={ingredient.ingredient_id}>
                      <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                        <div>
                          {ingredient.ingredient_name}
                          {costBreakdown.missing_cost_ingredients.includes(ingredient.ingredient_name) && (
                            <span className="ml-2 text-xs text-amber-500">⚠️</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                        {ingredient.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                        {ingredient.quantity_needed.toFixed(2)}g
                      </td>
                      <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(ingredient.cost_per_unit)}
                      </td>
                      <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(ingredient.total_cost)}
                      </td>
                      <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                        {getCostPercentage(ingredient.total_cost, costBreakdown.total_batch_cost)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                    <td colSpan="4" className="py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Total
                    </td>
                    <td className="py-3 text-sm font-bold text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(costBreakdown.total_batch_cost)}
                    </td>
                    <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={loadCostBreakdown}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          
          <button
            onClick={() => {
              // Export functionality could be added here
              console.log('Export cost breakdown:', costBreakdown);
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostSummary;