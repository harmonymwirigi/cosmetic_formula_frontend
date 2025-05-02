// frontend/src/components/Dashboard/FormulaUsageCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';

const FormulaUsageCard = ({ className = '', compact = false, showButton = true, onLimitReached = null }) => {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Always declare all hooks at the top level, never conditionally
  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await userAPI.getFormulaUsage();
        console.log('Formula usage data received:', response.data);
        setUsageData(response.data);
        
        // Call the onLimitReached callback if provided and limit is reached
        if (response.data?.status === 'limit_reached' && onLimitReached) {
          onLimitReached(response.data);
        }
      } catch (err) {
        console.error('Error fetching formula usage data:', err);
        setError('Unable to load usage data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [onLimitReached]); // Include onLimitReached in the dependency array

  // Determine color scheme based on usage
  const getColorScheme = () => {
    if (!usageData) return { bg: 'bg-gray-200', text: 'text-gray-600', progressBg: 'bg-gray-500' };
    
    if (usageData.status === 'limit_reached') {
      return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', progressBg: 'bg-red-500' };
    } else if (usageData.status === 'approaching_limit') {
      return { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', progressBg: 'bg-amber-500' };
    } else {
      return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', progressBg: 'bg-green-500' };
    }
  };

  // Format the formula limit display properly
  const formatFormulaLimit = (limit) => {
    if (limit === 'Unlimited' || limit === Infinity) {
      return 'Unlimited';
    }
    return limit;
  };

  if (loading) {
    return (
      <div className={`rounded-lg p-4 bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg p-4 bg-gray-100 dark:bg-gray-800 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!usageData) {
    return (
      <div className={`rounded-lg p-4 bg-gray-100 dark:bg-gray-800 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">No usage data available</p>
      </div>
    );
  }

  const { bg, text, progressBg } = getColorScheme();
  
  // Calculate percentage safely
  const calcPercentage = () => {
    if (usageData.formula_limit === 'Unlimited' || usageData.formula_limit === Infinity) {
      return 0; // No percentage for unlimited
    }
    return Math.min(100, usageData.percentage_used);
  };

  // Compact version for inline use
  if (compact) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className="text-sm font-medium">Formulas:</div>
        <div className={`text-sm font-bold ${text}`}>
          {usageData.formula_count}/{formatFormulaLimit(usageData.formula_limit)}
        </div>
        {usageData.status === 'limit_reached' && showButton && (
          <Link 
            to="/settings/plans" 
            className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Upgrade
          </Link>
        )}
      </div>
    );
  }

  // Full card version
  return (
    <div className={`rounded-lg p-4 ${bg} ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Formula Usage</h3>
        <span className={`text-sm font-bold ${text}`}>
          {usageData.formula_count}/{formatFormulaLimit(usageData.formula_limit)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
          className={`${progressBg} h-2.5 rounded-full`} 
          style={{ width: `${calcPercentage()}%` }}
        ></div>
      </div>
      
      {usageData.status === 'limit_reached' && (
        <div className="mb-3">
          <p className={`text-sm ${text} font-medium`}>
            You've reached your formula limit with your current {usageData.subscription_type} plan.
          </p>
        </div>
      )}
      
      {usageData.status === 'approaching_limit' && (
        <div className="mb-3">
          <p className={`text-sm ${text} font-medium`}>
            You're approaching your formula limit with your current {usageData.subscription_type} plan.
          </p>
        </div>
      )}
      
      {showButton && (usageData.status === 'limit_reached' || usageData.status === 'approaching_limit') && (
        <Link 
          to="/settings/plans" 
          className={`w-full btn inline-block text-center ${
            usageData.status === 'limit_reached' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          {usageData.status === 'limit_reached' ? 'Upgrade Now' : 'Upgrade Plan'}
        </Link>
      )}
    </div>
  );
};

export default FormulaUsageCard;