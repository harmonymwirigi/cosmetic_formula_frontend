import React, { useState, useRef, useEffect } from 'react';

function SearchModal({ id, searchId, modalOpen, setModalOpen }) {
  const [search, setSearch] = useState('');
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalRef.current?.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Focus input field when modal is open
  useEffect(() => {
    if (modalOpen) {
      searchInputRef.current?.focus();
    }
  }, [modalOpen]);

  return (
    <>
      {modalOpen && (
        <div
          id={id}
          ref={modalRef}
          className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center transform duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto relative">
            {/* Search input */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <label htmlFor={searchId} className="sr-only">
                  Search
                </label>
                <input
                  id={searchId}
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search anything..."
                  className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-violet-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search results */}
            <div className="p-4">
              {search ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Search Results
                  </h3>
                  {/* Add your search result logic here */}
                  <p className="text-sm text-gray-400">
                    No results found for "{search}"
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p>Start typing to search...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchModal;