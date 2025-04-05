import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchModal from '../components/ModalSearch';
import ThemeToggle from '../components/ThemeToggle';

function Header({
  sidebarOpen,
  setSidebarOpen,
  userData
}) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  
  // Load user data from localStorage if not provided via props
  const userDataFromStorage = userData || JSON.parse(localStorage.getItem('user') || '{}');

  // Close dropdown when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!userMenuOpen || userMenuRef.current?.contains(target)) return;
      setUserMenuOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close notifications when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!notificationsOpen || notificationsRef.current?.contains(target)) return;
      setNotificationsOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });
  
  // Get notification count for badge
  const unreadNotifications = 3; // This would typically come from your API

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  // Define gradient based on subscription type
  const getSubscriptionBackground = (type) => {
    switch(type) {
      case 'premium':
        return 'bg-violet-500 dark:bg-violet-600';
      case 'professional':
        return 'bg-amber-500 dark:bg-amber-600';
      default:
        return 'bg-blue-500 dark:bg-blue-600';
    }
  };

  const userSubscriptionBg = getSubscriptionBackground(userDataFromStorage?.subscription_type);

  // Mock notifications data
  const notifications = [
    {
      id: 1, 
      type: 'info',
      title: 'New ingredient available',
      description: 'Sodium Hyaluronate has been added to our ingredient database',
      time: '2 hours ago', 
      read: false
    },
    {
      id: 2, 
      type: 'success',
      title: 'Formula saved',
      description: 'Your "Hydrating Serum" formula was successfully saved',
      time: '3 hours ago', 
      read: false
    },
    {
      id: 3, 
      type: 'update',
      title: 'Subscription active',
      description: 'Your Premium subscription is now active',
      time: '1 day ago', 
      read: true
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>

            {/* Header: Dashboard logo (visible on mobile only) */}
            <div className="lg:hidden ml-3">
              <svg className="h-6 w-6 fill-current text-violet-600 dark:text-violet-500" viewBox="0 0 24 24">
                <path d="M16.5 2h-9a.5.5 0 0 0-.5.5V7c0 .22.037.431.107.631L11 16v5a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-5l3.893-8.369c.07-.2.107-.411.107-.631V2.5a.5.5 0 0 0-.5-.5zm-4 2v2h-1V4h1zm-3 0h1v2h-1V4zm6 2.5c0 .06-.01.119-.029.174L12 15.201V21h-.5v-5.799l-3.471-8.527A.498.498 0 0 1 8 6.5V4h1v2.5a.5.5 0 0 0 1 0V4h1v2.5a.5.5 0 0 0 1 0V4h1v2.5a.5.5 0 0 0 1 0V4h1v2.5z"/>
              </svg>
            </div>

            {/* Breadcrumbs (can be added if needed) */}
            {/* <div className="hidden lg:flex ml-3">
              <nav className="text-sm" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li><Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Dashboard</Link></li>
                  <li className="text-gray-400 dark:text-gray-600">/</li>
                  <li className="text-gray-800 dark:text-gray-200 font-medium">Current Page</li>
                </ol>
              </nav>
            </div> */}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions Button */}
            <div className="relative inline-flex">
              <Link 
                to="/formulas/create" 
                className="btn-sm bg-violet-500 hover:bg-violet-600 text-white inline-flex"
              >
                <svg className="w-4 h-4 fill-current opacity-50 shrink-0 mr-2" viewBox="0 0 16 16">
                  <path d="M15 7h-6V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span>New Formula</span>
              </Link>
            </div>

            {/* Search */}
            <div>
              <button
                className={`w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full ${searchModalOpen && 'bg-violet-100 dark:bg-violet-700'}`}
                onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}
                aria-controls="search-modal"
              >
                <span className="sr-only">Search</span>
                <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400" viewBox="0 0 16 16">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z" />
                  <path d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z" />
                </svg>
              </button>
              <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
            </div>

            {/* Notifications */}
            <div className="relative inline-flex" ref={notificationsRef}>
              <button
                className={`w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full ${notificationsOpen && 'bg-violet-100 dark:bg-violet-700'}`}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-haspopup="true"
              >
                <span className="sr-only">Notifications</span>
                <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400" viewBox="0 0 16 16">
                  <path d="M6.5 0C2.91 0 0 2.91 0 6.5S2.91 13 6.5 13c1.41 0 2.73-.45 3.8-1.2l4.7 4.7 1.4-1.4-4.7-4.7c.75-1.07 1.2-2.39 1.2-3.8C13 2.91 10.09 0 6.5 0zM6.5 2C8.99 2 11 4.01 11 6.5S8.99 11 6.5 11 2 8.99 2 6.5 4.01 2 6.5 2z" />
                </svg>
                {unreadNotifications > 0 && (
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </button>

              {/* Notifications dropdown */}
              <div
                className={`origin-top-right z-10 absolute top-full right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
                  notificationsOpen ? 'block' : 'hidden'
                }`}
              >
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-4 border-b border-gray-200 dark:border-gray-700">Notifications</div>
                <ul>
                  {notifications.map(item => (
                    <li key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className={`block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${item.read ? '' : 'bg-violet-50 dark:bg-violet-900/20'}`}>
                        <div className="flex items-center">
                          {/* Colored dot for notification type */}
                          <div className="relative mr-2">
                            <div className={`w-2 h-2 rounded-full ${
                              item.type === 'info' 
                                ? 'bg-blue-500' 
                                : item.type === 'success'
                                ? 'bg-green-500'  
                                : 'bg-violet-500'
                            }`}></div>
                          </div>

                          {/* Notification content */}
                          <div className="grow">
                            <div className="font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{item.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{item.description}</div>
                            <div className="text-xs font-medium text-gray-400 dark:text-gray-500">{item.time}</div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="text-center border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                  <Link to="/notifications" className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" onClick={() => setNotificationsOpen(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Divider */}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700 border-none" />

            {/* User menu */}
            <div className="relative inline-flex" ref={userMenuRef}>
              <button
                className="inline-flex justify-center items-center group"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-haspopup="true"
              >
                <div className={`flex items-center truncate ${userMenuOpen ? 'bg-gray-100 dark:bg-gray-900' : ''} rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 p-0.5`}>
                  <div className={`w-8 h-8 rounded-full ${userSubscriptionBg} flex items-center justify-center text-white font-bold`}>
                    {userDataFromStorage?.first_name?.[0]}{userDataFromStorage?.last_name?.[0]}
                  </div>
                  <div className="flex items-center overflow-hidden ml-2 mr-1">
                    <span className="truncate ml-1 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      {userDataFromStorage?.first_name || 'User'}
                    </span>
                    <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* User dropdown */}
              <div
                className={`origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
                  userMenuOpen ? 'block' : 'hidden'
                }`}
              >
                <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{userDataFromStorage?.first_name} {userDataFromStorage?.last_name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{userDataFromStorage?.email}</div>
                </div>
                <ul>
                  {/* Plan indicator */}
                  <li className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="block py-2 px-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan:</div>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          userDataFromStorage?.subscription_type === 'professional'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300'
                            : userDataFromStorage?.subscription_type === 'premium'
                            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                        }`}>
                          <span className="capitalize">{userDataFromStorage?.subscription_type || 'Free'}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/settings/account"
                      className="block py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings/plans"
                      className="block py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Subscription Plans
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings/billing"
                      className="block py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Billing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings/feedback"
                      className="block py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Feedback
                    </Link>
                  </li>
                  <li className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left py-2 px-3 text-sm font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;