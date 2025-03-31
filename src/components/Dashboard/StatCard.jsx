import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatCard component for displaying dashboard statistics
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main statistic value
 * @param {string} props.icon - Icon component or JSX for the card
 * @param {string} props.description - Optional description text
 * @param {string} props.trend - Optional trend indicator (up, down, or neutral)
 * @param {string} props.trendValue - Optional trend value (e.g., "+15%")
 * @param {string} props.color - Color theme for the card (primary, success, warning, danger, info)
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {function} props.onClick - Optional click handler
 */
const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  color = 'primary',
  isLoading = false,
  onClick
}) => {
  // Color mapping for different themes
  const colorMap = {
    primary: {
      background: 'bg-violet-50 dark:bg-violet-900/20',
      text: 'text-violet-500 dark:text-violet-400',
      border: 'border-violet-200 dark:border-violet-700',
      icon: 'bg-violet-100 dark:bg-violet-800/60 text-violet-600 dark:text-violet-300'
    },
    success: {
      background: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-500 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-700',
      icon: 'bg-emerald-100 dark:bg-emerald-800/60 text-emerald-600 dark:text-emerald-300'
    },
    warning: {
      background: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-500 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-700',
      icon: 'bg-amber-100 dark:bg-amber-800/60 text-amber-600 dark:text-amber-300'
    },
    danger: {
      background: 'bg-rose-50 dark:bg-rose-900/20',
      text: 'text-rose-500 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-700',
      icon: 'bg-rose-100 dark:bg-rose-800/60 text-rose-600 dark:text-rose-300'
    },
    info: {
      background: 'bg-sky-50 dark:bg-sky-900/20',
      text: 'text-sky-500 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-700',
      icon: 'bg-sky-100 dark:bg-sky-800/60 text-sky-600 dark:text-sky-300'
    }
  };

  // Get color classes based on theme
  const colors = colorMap[color] || colorMap.primary;

  // Trend indicator element based on trend direction
  const renderTrendIndicator = () => {
    if (!trend || !trendValue) return null;

    const trendIcon = 
      trend === 'up' ? (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12">
          <path d="M1.5 9.5L6 5 10.5 9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : trend === 'down' ? (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12">
          <path d="M1.5 2.5L6 7l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12">
          <path d="M2 6h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    const trendColorClass = 
      trend === 'up' ? 'text-emerald-500' : 
      trend === 'down' ? 'text-rose-500' : 
      'text-gray-500';

    return (
      <div className={`flex items-center ${trendColorClass}`}>
        <span className="mr-1">{trendIcon}</span>
        <span>{trendValue}</span>
      </div>
    );
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${colors.border} ${colors.background} ${onClick ? 'cursor-pointer transition-transform hover:scale-105' : ''}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className={`w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center opacity-50`}></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div className={`w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {value}
              </div>
              {description && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </div>
              )}
            </div>
            {renderTrendIndicator()}
          </div>
        </>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  description: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info']),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func
};

export default StatCard;