import React, { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // If no saved preference, check system preference
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <svg 
          className="w-4 h-4 text-gray-500 dark:text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
            clipRule="evenodd" 
          />
        </svg>
      ) : (
        <svg 
          className="w-4 h-4 text-gray-500 dark:text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" 
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;