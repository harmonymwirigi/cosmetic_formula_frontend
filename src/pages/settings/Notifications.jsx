// frontend/src/pages/settings/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { notificationAPI } from '../../services/notificationAPI';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import { Link } from 'react-router-dom';
function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState([]);
  const [formChanged, setFormChanged] = useState(false);
  
  // Define default settings to use when API doesn't return specific preferences
  const defaultSettings = {
    system: { email_enabled: true, push_enabled: true, sms_enabled: false },
    formula: { email_enabled: true, push_enabled: true, sms_enabled: false },
    subscription: { email_enabled: true, push_enabled: true, sms_enabled: false },
    educational: { email_enabled: true, push_enabled: true, sms_enabled: false },
    marketing: { email_enabled: false, push_enabled: false, sms_enabled: false },
  };

  // UI-friendly names for notification types
  const notificationTypeLabels = {
    system: {
      title: "System Notifications",
      description: "Updates about the platform, maintenance, and new features"
    },
    formula: {
      title: "Formula Notifications",
      description: "Comments, shares, and updates on your formulas"
    },
    subscription: {
      title: "Subscription Updates",
      description: "Billing and subscription status changes"
    },
    educational: {
      title: "Educational Content",
      description: "New articles, tutorials, and ingredients"
    },
    marketing: {
      title: "Marketing Emails",
      description: "Promotional offers and product updates"
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user data
        const userResponse = await userAPI.getUserStatus();
        setUserData(userResponse.data);
        
        // Fetch notification preferences
        const preferencesResponse = await notificationAPI.getNotificationPreferences();
        
        // Convert the API response to a more manageable format
        const preferencesMap = {};
        preferencesResponse.forEach(pref => {
          preferencesMap[pref.notification_type] = {
            email_enabled: pref.email_enabled,
            push_enabled: pref.push_enabled,
            sms_enabled: pref.sms_enabled
          };
        });
        
        // Merge with default settings for any missing types
        const mergedPreferences = { ...defaultSettings };
        Object.keys(preferencesMap).forEach(type => {
          mergedPreferences[type] = preferencesMap[type];
        });
        
        setNotificationPreferences(mergedPreferences);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (type, channel, value) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [`${channel}_enabled`]: value
      }
    }));
    setFormChanged(true);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // For each notification type, update the preferences
      const updatePromises = Object.entries(notificationPreferences).map(([type, preferences]) => {
        return notificationAPI.updateNotificationPreferences(type, {
          email_enabled: preferences.email_enabled,
          push_enabled: preferences.push_enabled,
          sms_enabled: preferences.sms_enabled
        });
      });
      
      await Promise.all(updatePromises);
      setFormChanged(false);
      
      // Show success feedback (could use a toast notification here)
      alert('Notification preferences saved successfully');
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      alert('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userData={userData} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Notification Settings</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage how you receive notifications and updates
              </p>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <SettingsSidebar currentPage="notifications" />
                  <div className="grow p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Notification Preferences</h2>
                      
                      {/* Notification settings form */}
                      <div className="space-y-6">
                        {Object.entries(notificationTypeLabels).map(([type, { title, description }]) => (
                          <div key={type} className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                            <div className="mb-3">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Email toggle */}
                              <div className="flex items-center justify-between md:justify-start md:gap-4 p-2 bg-white dark:bg-gray-800 rounded-md">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                                <div className="form-switch">
                                  <input 
                                    type="checkbox" 
                                    id={`${type}-email`} 
                                    className="sr-only" 
                                    checked={notificationPreferences[type]?.email_enabled}
                                    onChange={e => handleChange(type, 'email', e.target.checked)}
                                  />
                                  <label className="bg-gray-400 dark:bg-gray-700" htmlFor={`${type}-email`}>
                                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                    <span className="sr-only">Enable Email</span>
                                  </label>
                                </div>
                              </div>
                              
                              {/* Push notification toggle */}
                              <div className="flex items-center justify-between md:justify-start md:gap-4 p-2 bg-white dark:bg-gray-800 rounded-md">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push</span>
                                <div className="form-switch">
                                  <input 
                                    type="checkbox" 
                                    id={`${type}-push`} 
                                    className="sr-only" 
                                    checked={notificationPreferences[type]?.push_enabled}
                                    onChange={e => handleChange(type, 'push', e.target.checked)}
                                  />
                                  <label className="bg-gray-400 dark:bg-gray-700" htmlFor={`${type}-push`}>
                                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                    <span className="sr-only">Enable Push</span>
                                  </label>
                                </div>
                              </div>
                              
                              {/* SMS toggle */}
                              <div className="flex items-center justify-between md:justify-start md:gap-4 p-2 bg-white dark:bg-gray-800 rounded-md">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS</span>
                                <div className="form-switch">
                                  <input 
                                    type="checkbox" 
                                    id={`${type}-sms`} 
                                    className="sr-only" 
                                    checked={notificationPreferences[type]?.sms_enabled}
                                    onChange={e => handleChange(type, 'sms', e.target.checked)}
                                  />
                                  <label className="bg-gray-400 dark:bg-gray-700" htmlFor={`${type}-sms`}>
                                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                    <span className="sr-only">Enable SMS</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
                      <button 
                        className={`btn ${formChanged ? 'bg-violet-500 hover:bg-violet-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
                        onClick={handleSaveChanges}
                        disabled={!formChanged || saving}
                      >
                        {saving ? (
                          <>
                            <span className="animate-spin mr-2 w-4 h-4 border-t-2 border-r-2 border-white rounded-full inline-block"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                      
                      <Link to="/notifications" className="text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Notifications;