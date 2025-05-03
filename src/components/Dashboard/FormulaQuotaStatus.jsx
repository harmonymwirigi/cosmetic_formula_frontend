// frontend/src/components/FormulaQuotaStatus.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const FormulaQuotaStatus = ({ 
  formulaCount, 
  formulaLimit, 
  percentageUsed, 
  subscriptionType,
  isCompact = false,
  showUpgradeButton = true,
  className = ''
}) => {
  // Helper function to format the limit
  const formatLimit = () => {
    if (formulaLimit === 'Unlimited' || formulaLimit === Infinity) {
      return 'Unlimited';
    }
    return formulaLimit;
  };

  // Determine status level
  const getStatusLevel = () => {
    if (percentageUsed >= 100) return 'critical';
    if (percentageUsed >= 80) return 'warning';
    return 'normal';
  };

  const statusLevel = getStatusLevel();
  
  // Style maps
  const statusStyles = {
    normal: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      progressBar: 'bg-green-500',
      button: 'bg-violet-600 hover:bg-violet-700'
    },
    warning: {
      bg: 'bg-amber-100 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      progressBar: 'bg-amber-500',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      progressBar: 'bg-red-500',
      button: 'bg-red-600 hover:bg-red-700'
    }
  };

  const styles = statusStyles[statusLevel];

  // Compact view (for use in headers, small spaces)
  if (isCompact) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-gray-600 dark:text-gray-400">Formula Usage:</span>
        <span className={`text-sm font-medium ${styles.text}`}>
          {formulaCount}/{formatLimit()}
        </span>
        {statusLevel !== 'normal' && showUpgradeButton && (
          <Link 
            to="/subscription" 
            className={`text-xs px-2 py-1 ${styles.button} text-white rounded`}
          >
            Upgrade
          </Link>
        )}
      </div>
    );
  }

  // Standard view
  return (
    <div className={`rounded-lg p-4 ${styles.bg} ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-medium ${styles.text}`}>Formula Usage</h3>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {formulaCount}/{formatLimit()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
          className={`${styles.progressBar} h-2.5 rounded-full`} 
          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
        ></div>
      </div>
      
      {statusLevel !== 'normal' && (
        <div className="mb-3">
          <p className={`text-sm ${styles.text}`}>
            {statusLevel === 'critical' 
              ? `You've reached your formula limit with your ${subscriptionType} plan.` 
              : `You're approaching your formula limit with your ${subscriptionType} plan.`}
          </p>
        </div>
      )}
      
      {showUpgradeButton && (statusLevel !== 'normal' || subscriptionType === 'free') && (
        <Link 
          to="/subscription" 
          className={`w-full btn text-center text-white ${styles.button}`}
        >
          {statusLevel === 'critical' 
            ? 'Upgrade Now - Limit Reached!' 
            : statusLevel === 'warning'
              ? 'Upgrade Plan - Almost at Limit'
              : 'Upgrade for More Formulas'}
        </Link>
      )}
    </div>
  );
};

FormulaQuotaStatus.propTypes = {
  formulaCount: PropTypes.number.isRequired,
  formulaLimit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  percentageUsed: PropTypes.number.isRequired,
  subscriptionType: PropTypes.string.isRequired,
  isCompact: PropTypes.bool,
  showUpgradeButton: PropTypes.bool,
  className: PropTypes.string
};

export default FormulaQuotaStatus;