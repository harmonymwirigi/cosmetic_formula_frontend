import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  userData
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? true : storedSidebarExpanded === "true");

  // Get user data from localStorage if not provided via props
  const userDataFromStorage = userData || JSON.parse(localStorage.getItem('user') || '{}');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  // Define gradient based on subscription type
  const getSubscriptionGradient = (type) => {
    switch(type) {
      case 'premium':
        return 'from-violet-600 to-indigo-700';
      case 'professional':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  // Get primary color for icons based on subscription
  const getPrimaryColor = (type) => {
    switch(type) {
      case 'premium':
        return 'text-violet-500 dark:text-violet-400';
      case 'professional':
        return 'text-amber-500 dark:text-amber-400';
      default:
        return 'text-blue-500 dark:text-blue-400';
    }
  };
  
  const primaryColor = getPrimaryColor(userDataFromStorage?.subscription_type);
  const subscriptionGradient = getSubscriptionGradient(userDataFromStorage?.subscription_type);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/60 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700/60 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700/60">
          {/* Logo */}
          <NavLink end to="/" className="block">
            <div className="flex items-center">
              {/* Flask Icon */}
              <svg className="h-8 w-8 fill-current text-violet-600 dark:text-violet-500" viewBox="0 0 24 24">
                <path d="M16.5 2h-9a.5.5 0 0 0-.5.5V7c0 .22.037.431.107.631L11 16v5a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-5l3.893-8.369c.07-.2.107-.411.107-.631V2.5a.5.5 0 0 0-.5-.5zm-4 2v2h-1V4h1zm-3 0h1v2h-1V4zm6 2.5c0 .06-.01.119-.029.174L12 15.201V21h-.5v-5.799l-3.471-8.527A.498.498 0 0 1 8 6.5V4h1v2.5a.5.5 0 0 0 1 0V4h1v2.5a.5.5 0 0 0 1 0V4h1v2.5a.5.5 0 0 0 1 0V4h1v2.5z"/>
              </svg>
              {/* Expanded view text logo */}
              <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                Cosmetic Lab
              </span>
            </div>
          </NavLink>
          
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-6">
          <div className={`relative bg-gradient-to-r ${subscriptionGradient} rounded-lg p-4 mb-4 text-white overflow-hidden`}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-3 -mr-3 w-16 h-16 rounded-full bg-white/10"></div>
            <div className="absolute bottom-0 left-0 -mb-3 -ml-3 w-12 h-12 rounded-full bg-white/10"></div>
            
            <div className="flex items-center">
              <div className="mr-3 bg-white rounded-full p-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center justify-center text-white font-bold">
                  {userDataFromStorage?.first_name?.[0]}{userDataFromStorage?.last_name?.[0]}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {userDataFromStorage?.first_name} {userDataFromStorage?.last_name}
                </div>
                <div className="flex items-center text-xs text-white/80">
                  <span className="capitalize">{userDataFromStorage?.subscription_type || 'Free'} Plan</span>
                  {userDataFromStorage?.subscription_type && userDataFromStorage?.subscription_type !== 'free' && (
                    <div className="w-2 h-2 rounded-full bg-green-300 ml-2"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2 px-4">
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold px-2 mb-2">
            <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6">•••</span>
            <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Main Menu</span>
          </h3>
          
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) => 
              `flex items-center p-2 rounded-lg group ${
                isActive
                  ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path 
                className={`fill-current ${pathname === '/' ? primaryColor : 'text-gray-400'}`}
                d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
              />
              <path 
                className={`fill-current ${pathname === '/' ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}
                d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
              />
              <path 
                className={`fill-current ${pathname === '/' ? 'text-gray-200 dark:text-gray-600' : 'text-gray-600 dark:text-gray-600'}`}
                d="M12 15c-1.654 0-3-1.346-3-3 0-1.654 1.346-3 3-3 1.654 0 3 1.346 3 3 0 1.654-1.346 3-3 3z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              Dashboard
            </span>
          </NavLink>
          
          {/* Formulas */}
          <NavLink
            to="/formulas"
            className={({ isActive }) => 
              `flex items-center p-2 rounded-lg group ${
                isActive || pathname.includes('/formulas')
                  ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path 
                className={`fill-current ${pathname.includes('/formulas') ? primaryColor : 'text-gray-400'}`}
                d="M20 7a2 2 0 00-2-2h-2V4c0-1.103-.897-2-2-2H10C8.897 2 8 2.897 8 4v1H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V7zm-6-3v1H10V4h4zm-6 7h4v2H8v-2zm8 0h-2v2h2v-2zm-8-2h8v.5H8V9zm0 6h8v.5H8v-.5z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              Formulas
            </span>
          </NavLink>
          
          {/* Create Formula */}
          <NavLink
            to="/formulas/create"
            className={({ isActive }) => 
              `flex items-center p-2 rounded-lg group ${
                isActive
                  ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path 
                className={`fill-current ${pathname === '/formulas/create' ? primaryColor : 'text-gray-400'}`}
                d="M17 11h-4V7c0-.552-.448-1-1-1s-1 .448-1 1v4H7c-.552 0-1 .448-1 1s.448 1 1 1h4v4c0 .552.448 1 1 1s1-.448 1-1v-4h4c.552 0 1-.448 1-1s-.448-1-1-1z"
              />
              <path 
                className={`fill-current ${pathname === '/formulas/create' ? primaryColor : 'text-gray-400'}`}
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              Create Formula
            </span>
          </NavLink>
          
          {/* Ingredients */}
          <NavLink
            to="/ingredients"
            className={({ isActive }) => 
              `flex items-center p-2 rounded-lg group ${
                isActive
                  ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path 
                className={`fill-current ${pathname === '/ingredients' ? primaryColor : 'text-gray-400'}`}
                d="M19 8h-1.26c-.19-.73-.48-1.42-.85-2.06l.94-.94a.996.996 0 0 0 0-1.41l-1.41-1.41a.996.996 0 0 0-1.41 0l-.94.94c-.65-.38-1.34-.67-2.07-.86V1c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v1.26c-.76.2-1.47.5-2.13.89L5 2.28a.972.972 0 0 0-1.36 0L2.28 3.64c-.37.38-.37.98 0 1.36l.87.87c-.39.66-.69 1.37-.89 2.13H1c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h1.26c.19.73.48 1.42.85 2.06l-.94.94a.996.996 0 0 0 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l.94-.94c.64.38 1.33.66 2.06.85V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-1.26c.76-.2 1.47-.5 2.13-.89l.88.87c.37.37.98.37 1.36 0l1.36-1.36c.37-.38.37-.98 0-1.36l-.87-.87c.4-.65.7-1.37.89-2.13H19c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-7 5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              Ingredients
            </span>
          </NavLink>

          {/* AI Formula Generator - only visible for premium/professional users */}
          {userDataFromStorage?.subscription_type && userDataFromStorage?.subscription_type !== 'free' && (
            <NavLink
              to="/ai-formula-generator"
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg group ${
                  isActive
                    ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                <path 
                  className={`fill-current ${pathname === '/ai-formula-generator' ? primaryColor : 'text-gray-400'}`}
                  d="M12 2c-4.42 0-8 3.58-8 8 0 1.95.7 3.73 1.86 5.12C7.55 17.2 9.68 18.5 12 18.5s4.45-1.3 6.14-3.38C19.3 13.73 20 11.95 20 10c0-4.42-3.58-8-8-8zm3.75 11.25h-7.5v-1.5h7.5v1.5zm-7.5-4.5h4.5V10h-4.5V8.75z"
                />
                <path 
                  className={`fill-current ${pathname === '/ai-formula-generator' ? primaryColor : 'text-gray-400'}`}
                  d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"
                />
              </svg>
              <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                AI Generator
              </span>
              <span className="flex items-center justify-center ml-2 w-5 h-5 text-xs rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                Pro
              </span>
            </NavLink>
          )}
          
          {/* Knowledge Base */}
<NavLink
  to="/knowledge"
  className={({ isActive }) => 
    `flex items-center p-2 rounded-lg group ${
      isActive || pathname.includes('/knowledge')
        ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`
  }
>
  <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
    <path 
      className={`fill-current ${pathname.includes('/knowledge') ? primaryColor : 'text-gray-400'}`}
      d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z"
    />
    <path
      className={`fill-current ${pathname.includes('/knowledge') ? 'text-slate-400 dark:text-slate-300' : 'text-gray-400'}`}
      d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z"
    />
    <path
      className={`fill-current ${pathname.includes('/knowledge') ? primaryColor : 'text-gray-400'}`}
      d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z"
    />
    <path
      className={`fill-current ${pathname.includes('/knowledge') ? 'text-slate-400 dark:text-slate-300' : 'text-gray-400'}`}
      d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z"
    />
  </svg>
  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
    Knowledge Hub
  </span>
</NavLink>

{/* Shop */}
<NavLink
  to="/shop"
  className={({ isActive }) => 
    `flex items-center p-2 rounded-lg group ${
      isActive || pathname.includes('/shop')
        ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`
  }
>
  <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
    <path 
      className={`fill-current ${pathname.includes('/shop') ? primaryColor : 'text-gray-400'}`}
      d="M20 7a2 2 0 00-2-2h-2V4c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v1H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V7zm-6-3v1h-4V4h4zm-6 7h4v2H8v-2zm8 0h-2v2h2v-2zm-8-2h8v.5H8V9zm0 6h8v.5H8v-.5z"
    />
  </svg>
  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
    Shop
  </span>
</NavLink>
        </div>

        {/* Settings Section */}
        <div className="space-y-2 px-4 mt-6">
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold px-2 mb-2">
            <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6">•••</span>
            <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Settings</span>
          </h3>
          
          {/* Account Settings */}
          <NavLink
            to="/settings/account"
            className={({ isActive }) => 
              `flex items-center p-2 rounded-lg group ${
                isActive || pathname.includes('/settings/')
                  ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path 
                className={`fill-current ${pathname.includes('/settings/') ? primaryColor : 'text-gray-400'}`}
                d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17l-1.3-1.44zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              Account Settings
            </span>
          </NavLink>
          
          {/* Subscription Management */}
          <NavLink
            to="/subscription"
            className={({ isActive }) => 
              `flex items-center p-2 rounded-lg group ${
                isActive
                  ? `bg-gray-100 dark:bg-gray-700/70 ${primaryColor}` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path 
                className={`fill-current ${pathname === '/subscription' ? primaryColor : 'text-gray-400'}`}
                d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
              />
            </svg>
            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              Subscription
            </span>
          </NavLink>
        </div>

        {/* Bottom section */}
        <div className="mt-auto px-4 pb-6 pt-4">
          <div className="border-t border-gray-200 dark:border-gray-700/60 pt-4">
            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg className="shrink-0 h-6 w-6 text-gray-400" viewBox="0 0 24 24">
                <path 
                  className="fill-current"
                  d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z"
                />
              </svg>
              <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                Logout
              </span>
            </button>
          </div>
          
          {/* Expand / Collapse button */}
          <div className="px-3 mt-4 lg:inline-flex lg:mt-8 hidden">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current text-gray-400" viewBox="0 0 24 24">
                <path 
                  d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" 
                  className={`${sidebarExpanded ? 'hidden' : 'block'}`} 
                />
                <path 
                  d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" 
                  className={`${sidebarExpanded ? 'block' : 'hidden'}`} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;