import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import NotificationsPanel from '../../partials/settings/NotificationsPanel';

function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    formulaComments: true,
    formulaSharing: true,
    newIngredients: true,
    subscriptionUpdates: true,
    marketingEmails: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userAPI.getUserStatus();
        setUserData(response.data);
        // In a real implementation, you would fetch notification settings from the API
        // setNotificationSettings(response.data.notificationSettings);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // In a real implementation, you would save these changes to the API
    // userAPI.updateNotificationSettings({ [setting]: value });
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
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Notifications</h1>
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
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Email Notifications</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Email Notifications</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                          </div>
                          <div className="flex items-center">
                            <div className="form-switch">
                              <input 
                                type="checkbox" 
                                id="email-notifications" 
                                className="sr-only" 
                                checked={notificationSettings.emailNotifications}
                                onChange={e => handleNotificationChange('emailNotifications', e.target.checked)}
                              />
                              <label className="bg-gray-400 dark:bg-gray-700" htmlFor="email-notifications">
                                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                <span className="sr-only">Enable</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Formula Comments</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when someone comments on your formulas</p>
                          </div>
                          <div className="flex items-center">
                            <div className="form-switch">
                              <input 
                                type="checkbox" 
                                id="formula-comments" 
                                className="sr-only" 
                                checked={notificationSettings.formulaComments}
                                onChange={e => handleNotificationChange('formulaComments', e.target.checked)}
                              />
                              <label className="bg-gray-400 dark:bg-gray-700" htmlFor="formula-comments">
                                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                <span className="sr-only">Enable</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Formula Sharing</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when someone shares a formula with you</p>
                          </div>
                          <div className="flex items-center">
                            <div className="form-switch">
                              <input 
                                type="checkbox" 
                                id="formula-sharing" 
                                className="sr-only" 
                                checked={notificationSettings.formulaSharing}
                                onChange={e => handleNotificationChange('formulaSharing', e.target.checked)}
                              />
                              <label className="bg-gray-400 dark:bg-gray-700" htmlFor="formula-sharing">
                                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                <span className="sr-only">Enable</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">New Ingredients</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when new ingredients are added to the database</p>
                          </div>
                          <div className="flex items-center">
                            <div className="form-switch">
                              <input 
                                type="checkbox" 
                                id="new-ingredients" 
                                className="sr-only" 
                                checked={notificationSettings.newIngredients}
                                onChange={e => handleNotificationChange('newIngredients', e.target.checked)}
                              />
                              <label className="bg-gray-400 dark:bg-gray-700" htmlFor="new-ingredients">
                                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                <span className="sr-only">Enable</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Subscription Updates</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about billing and subscription changes</p>
                          </div>
                          <div className="flex items-center">
                            <div className="form-switch">
                              <input 
                                type="checkbox" 
                                id="subscription-updates" 
                                className="sr-only" 
                                checked={notificationSettings.subscriptionUpdates}
                                onChange={e => handleNotificationChange('subscriptionUpdates', e.target.checked)}
                              />
                              <label className="bg-gray-400 dark:bg-gray-700" htmlFor="subscription-updates">
                                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                <span className="sr-only">Enable</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Marketing Emails</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive product updates and promotional offers</p>
                          </div>
                          <div className="flex items-center">
                            <div className="form-switch">
                              <input 
                                type="checkbox" 
                                id="marketing-emails" 
                                className="sr-only" 
                                checked={notificationSettings.marketingEmails}
                                onChange={e => handleNotificationChange('marketingEmails', e.target.checked)}
                              />
                              <label className="bg-gray-400 dark:bg-gray-700" htmlFor="marketing-emails">
                                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                <span className="sr-only">Enable</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <button className="btn bg-violet-500 hover:bg-violet-600 text-white">Save Changes</button>
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