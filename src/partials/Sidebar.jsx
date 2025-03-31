import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import SidebarLinkGroup from "./SidebarLinkGroup";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
  userData
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");

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

  // Navigation items specific to your application
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: (
        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
          <path 
            className={`fill-current text-gray-400 ${pathname === '/' ? 'text-violet-500' : ''}`}
            d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
          />
          <path 
            className={`fill-current text-gray-600 ${pathname === '/' ? 'text-violet-600' : ''}`}
            d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
          />
        </svg>
      )
    },
    { 
      name: 'Formulas', 
      path: '/formulas', 
      icon: (
        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
          <path 
            className={`fill-current text-gray-400 ${pathname.includes('/formulas') ? 'text-violet-500' : ''}`}
            d="M13 15l11-7L11.474.585a.496.496 0 0 0-.948 0L0 8l13 7z"
          />
          <path 
            className={`fill-current text-gray-600 ${pathname.includes('/formulas') ? 'text-violet-600' : ''}`}
            d="M13 15L0 8v7c0 .737.398 1.476 1.194 1.902l11.383 6.932A2.006 2.006 0 0 0 13 22v-7z"
          />
          <path 
            className={`fill-current text-gray-600 ${pathname.includes('/formulas') ? 'text-violet-600' : ''}`}
            d="M13 15l11-7v7c0 .737-.398 1.476-1.194 1.902l-11.383 6.932A2.007 2.007 0 0 1 13 22v-7z"
          />
        </svg>
      )
    },
    { 
      name: 'Create Formula', 
      path: '/formulas/create', 
      icon: (
        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
          <path 
            className={`fill-current text-gray-400 ${pathname === '/formulas/create' ? 'text-violet-500' : ''}`}
            d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z"
          />
          <path 
            className={`fill-current text-gray-600 ${pathname === '/formulas/create' ? 'text-violet-600' : ''}`}
            d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9zm5 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
          />
        </svg>
      )
    },
    { 
      name: 'Ingredients', 
      path: '/ingredients', 
      icon: (
        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
          <path 
            className={`fill-current text-gray-400 ${pathname === '/ingredients' ? 'text-violet-500' : ''}`}
            d="M7 0l6 7H8v10H6V7H1z"
          />
          <path 
            className={`fill-current text-gray-600 ${pathname === '/ingredients' ? 'text-violet-600' : ''}`}
            d="M20 7a4 4 0 01-4 4v11H8V11a4 4 0 01-4-4 4 4 0 114 4 4 4 0 014-4 4 4 0 114 4v11h4V7a4 4 0 01-4-4z"
          />
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to signin
    navigate('/signin');
  };

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
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
          {/* Logo */}
          <NavLink end to="/" className="block">
            <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>
        </div>

        {/* User info */}
        <div className="flex items-center mb-10">
          <div className="mr-3">
            <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
              {userDataFromStorage?.first_name?.[0]}{userDataFromStorage?.last_name?.[0]}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {userDataFromStorage?.first_name} {userDataFromStorage?.last_name}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {userDataFromStorage?.subscription_type || 'Free Plan'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Main</span>
            </h3>
            <ul className="mt-3">
              {navItems.map((item) => (
                <li key={item.path} className="mb-2">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center p-2 rounded group ${
                        isActive || (item.path !== '/' && pathname.includes(item.path))
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-auto pt-4">
          <div className="border-t border-gray-200 dark:border-gray-700/60 pt-4">
            <NavLink
              to="/settings/account"
              className={({ isActive }) => 
                `flex items-center p-2 rounded group ${
                  isActive 
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <svg className="shrink-0 h-5 w-5" viewBox="0 0 24 24">
                <path 
                  className="fill-current"
                  d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 2a9.983 9.983 0 017.654 3.48C18.159 6.41 16.14 7 14 7H9.914a1 1 0 00-.707.293l-4.243 4.243a1 1 0 000 1.414l4.243 4.243a1 1 0 001.414 0l4.243-4.243A1 1 0 0115.914 12H19a10 10 0 01-3.298 7.616A9.98 9.98 0 0112 22a9.98 9.98 0 01-7.702-3.384A9.98 9.98 0 012 12c0-2.685 1.04-5.073 2.732-6.848A9.98 9.98 0 0112 2z"
                />
              </svg>
              <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                Account
              </span>
            </NavLink>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-2 rounded group text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 mt-2"
            >
              <svg className="shrink-0 h-5 w-5" viewBox="0 0 24 24">
                <path 
                  className="fill-current"
                  d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm4.243 7.757a1 1 0 010 1.414L13.414 12l2.829 2.829a1 1 0 01-1.414 1.414L12 13.414l-2.829 2.829a1 1 0 01-1.414-1.414L10.586 12 7.757 9.171a1 1 0 011.414-1.414L12 10.586l2.829-2.829a1 1 0 011.414 0z"
                />
              </svg>
              <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;