import React, { useState, useEffect } from 'react';
import { notionAPI } from '../../services/api';
import { toast } from 'react-toastify';

const SyncNotionButton = ({ formulaId }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [notionUrl, setNotionUrl] = useState('');
  const [notionStatus, setNotionStatus] = useState(null);

  // Check if Notion is connected on component mount
  useEffect(() => {
    const checkNotionStatus = async () => {
      try {
        const response = await notionAPI.getStatus();
        setNotionStatus(response.data);
      } catch (error) {
        console.error('Failed to get Notion status:', error);
      }
    };
    
    checkNotionStatus();
  }, []);

  // Handle syncing formula to Notion
  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const response = await notionAPI.syncFormula(formulaId);
      
      if (response.data.success) {
        toast.success('Formula synced to Notion successfully!');
        setLastSynced(new Date());
        setNotionUrl(response.data.notion_url);
      } else {
        toast.error('Failed to sync formula to Notion');
      }
    } catch (error) {
      console.error('Failed to sync formula to Notion:', error);
      toast.error(error.response?.data?.detail || 'Failed to sync formula to Notion');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle connecting to Notion
  const handleConnect = async () => {
    try {
      const response = await notionAPI.connect({
        database_name: "Cosmetic Formula Lab"
      });
      
      if (response.data.success) {
        toast.success('Connected to Notion successfully!');
        setNotionStatus({
          is_connected: true,
          database_id: response.data.database_id
        });
      } else {
        toast.error('Failed to connect to Notion');
      }
    } catch (error) {
      console.error('Failed to connect to Notion:', error);
      toast.error(error.response?.data?.detail || 'Failed to connect to Notion');
    }
  };

  return (
    <>
      {notionStatus?.is_connected ? (
        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="btn bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
        >
          {isSyncing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400 shrink-0 mr-2" viewBox="0 0 24 24">
                <path d="M20 5H4V3h16v2zm0 2H4v2h16V7zM4 13h16v-2H4v2zm0 2h16v2H4v-2z"/>
              </svg>
              <span>Sync to Notion</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          className="btn bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <svg className="w-4 h-4 fill-current shrink-0 mr-2" viewBox="0 0 24 24">
            <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2h-15zm2.5 5h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm0 5h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1zm0 5h7a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/>
          </svg>
          <span>Connect to Notion</span>
        </button>
      )}
      
      {notionUrl && (
        <div className="mt-2">
          <a 
            href={notionUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
          >
            View in Notion →
          </a>
        </div>
      )}
      
      {lastSynced && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Last synced: {lastSynced.toLocaleString()}
        </div>
      )}
    </>
  );
};

export default SyncNotionButton;