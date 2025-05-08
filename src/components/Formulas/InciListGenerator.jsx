// frontend/src/components/formulas/InciListGenerator.jsx
import React, { useState, useEffect } from 'react';
import { formulaAPI } from '../../services/api';

/**
 * InciListGenerator component for displaying properly formatted INCI lists
 * 
 * Features:
 * - Displays ingredients in descending percentage order per regulations
 * - Option to highlight common allergens
 * - Displays percentage for each ingredient (for formulator use only)
 * - Copy to clipboard functionality
 * 
 * @param {Object} props - Component props
 * @param {number} props.formulaId - ID of the formula to generate INCI list for
 */
const InciListGenerator = ({ formulaId }) => {
  const [inciData, setInciData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightAllergens, setHighlightAllergens] = useState(true);
  const [showPercentages, setShowPercentages] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Fetch INCI list when component mounts or when highlight option changes
  useEffect(() => {
    const fetchInciList = async () => {
      if (!formulaId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await formulaAPI.getInciList(formulaId, highlightAllergens);
        setInciData(response.data);
      } catch (err) {
        console.error('Error fetching INCI list:', err);
        setError('Failed to generate INCI list. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInciList();
  }, [formulaId, highlightAllergens]);
  
  // Handle copy to clipboard
  const handleCopy = () => {
    if (!inciData) return;
    
    navigator.clipboard.writeText(inciData.inci_list)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setError('Failed to copy to clipboard');
      });
  };
  
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Generating INCI list...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }
  
  if (!inciData) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        INCI List for {inciData.formula_name}
      </h2>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="highlight-allergens"
            checked={highlightAllergens}
            onChange={(e) => setHighlightAllergens(e.target.checked)}
            className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded dark:border-gray-600"
          />
          <label htmlFor="highlight-allergens" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Highlight common allergens
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-percentages"
            checked={showPercentages}
            onChange={(e) => setShowPercentages(e.target.checked)}
            className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded dark:border-gray-600"
          />
          <label htmlFor="show-percentages" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Show percentages (for formulator reference only)
          </label>
        </div>
      </div>
      
      {/* INCI List Display */}
      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Ready-to-use INCI List
        </h3>
        
        <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
          {highlightAllergens ? (
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {inciData.inci_list_with_allergens.split('**').map((part, index) => (
                index % 2 === 0 ? 
                  part : 
                  <span key={index} className="font-bold text-amber-600 dark:text-amber-400">{part}</span>
              ))}
            </p>
          ) : (
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {inciData.inci_list}
            </p>
          )}
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Detailed Ingredient Breakdown */}
      {showPercentages && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Detailed Ingredient Breakdown (For Formulator Reference Only)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">INCI Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Common Name</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {inciData.ingredients_by_percentage.map((ingredient, index) => (
                  <tr key={index} className={ingredient.is_allergen ? 'bg-amber-50 dark:bg-amber-900/20' : ''}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {ingredient.is_allergen ? (
                        <span className="font-bold text-amber-600 dark:text-amber-400">{ingredient.inci_name}</span>
                      ) : (
                        ingredient.inci_name
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{ingredient.common_name}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-500 dark:text-gray-400">{ingredient.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> This detailed breakdown with percentages is for formulator reference only. 
              The official INCI list for product labeling is shown above without percentages, in accordance with international regulations.
            </p>
          </div>
        </div>
      )}
      
      {/* Compliance Information */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
          Labeling Compliance Information
        </h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ingredients are listed in descending order by concentration</li>
          <li>INCI (International Nomenclature of Cosmetic Ingredients) names are used as required by regulations</li>
          <li>Common allergens can be highlighted for easier identification</li>
          <li>For EU compliance, allergens must be declared even when present in fragrance compounds</li>
          <li>This tool provides a starting point for proper labeling, but regulatory requirements may vary by region</li>
        </ul>
      </div>
    </div>
  );
};

export default InciListGenerator;