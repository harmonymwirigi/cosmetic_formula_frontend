import React, { useState } from 'react';

function DropdownNotifications({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${dropdownOpen && 'bg-gray-200 dark:bg-gray-800'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>
        <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-current text-gray-500 dark:text-gray-400" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V12l2.757-1.379A4.577 4.577 0 006.5 11c3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0z" />
          <path className="fill-current text-gray-400 dark:text-gray-500" d="M16 9.5c0-.987-.429-1.897-1.147-2.601C14.876 7.195 14 6.421 14 5.5 14 3.019 11.864 1 9 1c-.756 0-1.474.166-2.12.477-.453.25-.853.554-1.2.911C4.554 2.416 4 3.67 4 5c0 1.47.611 2.79 1.594 3.734.505.504 1.054.923 1.637 1.234l1.5 3.363a1 1 0 001.789.107l3.48-4.987V9.5z" />
        </svg>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-[#182235] rounded-full"></div>
      </button>

      {dropdownOpen && (
        <div
          className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="pt-0.5 pb-2 px-4 mb-1 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-800 dark:text-gray-100">Notifications</div>
          </div>
          <ul>
            <li className="border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20">
                <span className="block text-sm mb-2">📢 <span className="font-medium">Edit your information in a swipe</span> Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</span>
                <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">Feb 12, 2021</span>
              </div>
            </li>
            {/* Add more notification items */}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownNotifications;