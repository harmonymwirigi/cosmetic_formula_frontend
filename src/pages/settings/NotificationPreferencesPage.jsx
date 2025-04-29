import React, { useState, useEffect } from 'react';
import Header from '../../partials/Header';
import Sidebar from '../../partials/Sidebar';
import { notificationAPI, userAPI } from '../../services/api';
import { useToast } from '../../components/Notifications/ToastContainer';

function NotificationPreferencesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingType, setSavingType] = useState(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const toast = useToast();

  // Notification types and their descriptions
  const notificationTypes = [
    {
      id: 'system',
      name: 'System Notifications',
      description: 'Important system updates and announcements'
    },
    {
      id: 'formula',
      name: 'Formula Notifications',
      description: 'Updates about your formulas and recommendations'
    },
    {
      id: 'subscription',
      name: 'Subscription Notifications',
      description: 'Information about your subscription plan and billing'
    },
    {
      id: 'order',
      name: 'Order Notifications',
      description: 'Updates about your orders and shipments'
    }
  ];

  // Initialize default preferences - only run this once for initial state
  useEffect(() => {
    // Only set initial defaults if preferences is empty
    if (Object.keys(preferences).length === 0) {
      const defaultPrefs = {};
      notificationTypes.forEach(type => {
        defaultPrefs[type.id] = {
          email_enabled: true,
          push_enabled: true,
          sms_enabled: false
        };
      });
      setPreferences(defaultPrefs);
    }
  }, []);

  // Load user data from API directly to ensure we have the latest status
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to get stored user data for faster rendering
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          
          // Convert to boolean explicitly to handle string values like "true"
          setIsPhoneVerified(Boolean(parsedUser.is_phone_verified));
        }
        
        // Then fetch latest data from API
        const response = await userAPI.getUserStatus();
        if (response && response.data) {
          setUserData(response.data);
          
          // Update localStorage with current data
          localStorage.setItem('user', JSON.stringify(response.data));
          
          // Explicitly convert to boolean and update state
          setIsPhoneVerified(Boolean(response.data.is_phone_verified));
          
          console.log('Phone verification status:', response.data.is_phone_verified);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  // Fetch notification preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await notificationAPI.getNotificationPreferences();
        
        if (response && response.data) {
          console.log('Fetched preferences from API:', response.data);
          
          // Initialize preferences structure for each notification type
          const initializedPrefs = {};
          
          // For each notification type, ensure we have a proper structure
          notificationTypes.forEach(type => {
            // Use data from API if available, otherwise use defaults
            initializedPrefs[type.id] = response.data[type.id] || {
              email_enabled: true,
              push_enabled: true, 
              sms_enabled: false
            };
            
            // Convert values to boolean to ensure correct type
            initializedPrefs[type.id].email_enabled = Boolean(initializedPrefs[type.id].email_enabled);
            initializedPrefs[type.id].push_enabled = Boolean(initializedPrefs[type.id].push_enabled);
            initializedPrefs[type.id].sms_enabled = Boolean(initializedPrefs[type.id].sms_enabled);
          });
          
          console.log('Setting preferences state to:', initializedPrefs);
          setPreferences(initializedPrefs);
        }
      } catch (error) {
        console.error('Failed to fetch notification preferences:', error);
        toast.showError({
          title: 'Error',
          message: 'Failed to load notification preferences'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Handle toggle changes - completely rewritten for simplicity
  const handleToggle = (typeId, channel) => {
    setPreferences(prev => {
      // Create a deep copy of the preferences
      const newPrefs = JSON.parse(JSON.stringify(prev));
      
      // Toggle the current value (if undefined, default to true)
      newPrefs[typeId][`${channel}_enabled`] = !newPrefs[typeId][`${channel}_enabled`];
      
      console.log(`Toggled ${typeId}.${channel}_enabled to:`, newPrefs[typeId][`${channel}_enabled`]);
      return newPrefs;
    });
  };

  // Save preferences
  const savePreferences = async (type) => {
    try {
      setSaving(true);
      setSavingType(type);
      
      // Get the current preferences for this type
      const typePrefs = preferences[type];
      console.log(`Saving preferences for ${type}:`, typePrefs);
      
      if (!typePrefs) {
        throw new Error(`No preferences found for type: ${type}`);
      }
      
      // Send to API
      const response = await notificationAPI.updateNotificationPreferences(type, typePrefs);
      console.log(`Preferences update response:`, response);
      
      toast.showSuccess({
        title: 'Success',
        message: 'Notification preferences updated'
      });
    } catch (error) {
      console.error(`Failed to update ${type} notification preferences:`, error);
      toast.showError({
        title: 'Error',
        message: 'Failed to update notification preferences'
      });
    } finally {
      setSaving(false);
      setSavingType(null);
    }
  };

  // Custom toggle component that doesn't rely on checkbox input
  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => {
    return (
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          disabled 
            ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed' 
            : enabled 
              ? 'bg-violet-600 dark:bg-violet-500' 
              : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span className="sr-only">Toggle</span>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </button>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                Notification Preferences
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage how you receive notifications from Cosmetic Formula Lab
              </p>
            </div>

            {/* Notification preferences */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-8">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading your preferences...</p>
                </div>
              ) : (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">Notification Settings</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notificationTypes.map((type) => {
                      // Ensure we have preferences for this type
                      const typePrefs = preferences[type.id] || {
                        email_enabled: true,
                        push_enabled: true,
                        sms_enabled: false
                      };
                      
                      const isSavingThisType = savingType === type.id;
                      
                      return (
                        <div key={type.id} className="p-6">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
                              {type.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {type.description}
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            {/* Email notifications */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Email Notifications
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Receive notifications via email
                                </p>
                              </div>
                              <div className="flex items-center">
                                <ToggleSwitch 
                                  enabled={!!typePrefs.email_enabled} 
                                  onChange={() => handleToggle(type.id, 'email')} 
                                />
                              </div>
                            </div>
                            
                            {/* Push notifications */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  In-App Notifications
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Receive notifications in the app
                                </p>
                              </div>
                              <div className="flex items-center">
                                <ToggleSwitch 
                                  enabled={!!typePrefs.push_enabled} 
                                  onChange={() => handleToggle(type.id, 'push')} 
                                />
                              </div>
                            </div>
                            
                            {/* SMS notifications */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  SMS Notifications
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Receive notifications via SMS
                                </p>
                              </div>
                              <div className="flex items-center">
                                <ToggleSwitch 
                                  enabled={!!typePrefs.sms_enabled} 
                                  onChange={() => handleToggle(type.id, 'sms')} 
                                  disabled={!isPhoneVerified}
                                />
                              </div>
                            </div>
                            
                            {!isPhoneVerified && (
                              <div className="text-xs text-amber-500 dark:text-amber-400 mt-1">
                                Verify your phone number in your account settings to enable SMS notifications
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6 text-right">
                            <button
                              className="btn bg-violet-500 hover:bg-violet-600 text-white"
                              onClick={() => savePreferences(type.id)}
                              disabled={saving}
                            >
                              {isSavingThisType ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </>
                              ) : 'Save Settings'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Debug info - only in development */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Debug Information</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>Phone verification status: {isPhoneVerified ? 'Verified' : 'Not verified'}</div>
                  <div>Raw phone verified value: {userData?.is_phone_verified?.toString()}</div>
                  <div>Type: {userData?.is_phone_verified !== undefined ? typeof userData.is_phone_verified : 'undefined'}</div>
                  <div className="mt-2 font-medium">Current Preferences:</div>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs mt-1 overflow-auto max-h-40">
                    {JSON.stringify(preferences, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Information card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
              <div className="flex">
                <div className="shrink-0 mr-3">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-1">About Notifications</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Stay up to date with your formulations, orders, and subscription. We'll send you notifications based on your preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NotificationPreferencesPage;