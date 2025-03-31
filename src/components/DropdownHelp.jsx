import React, { useState } from 'react';

function DropdownHelp({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${dropdownOpen && 'bg-gray-200 dark:bg-gray-800'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Help</span>
        <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-current text-gray-500 dark:text-gray-400" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
        </svg>
      </button>

      {dropdownOpen && (
        <div
          className={`origin-top-right z-10 absolute top-full min-w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="pt-0.5 pb-2 px-4 mb-1 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-800 dark:text-gray-100">Help & Resources</div>
          </div>
          <ul>
            <li className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              <a 
                href="/tutorial" 
                className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-sm"
              >
                👋 Tutorial & Guides
              </a>
            </li>
            <li className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              <a 
                href="/support" 
                className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-sm"
              >
                💬 Support Center
              </a>
              </li>
            <li className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              <a 
                href="/community" 
                className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-sm"
              >
                🌐 Community Forum
              </a>
            </li>
            <li>
              <a 
                href="/feedback" 
                className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-sm"
              >
                📝 Send Feedback
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownHelp;