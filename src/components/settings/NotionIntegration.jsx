// frontend/src/components/settings/NotionIntegration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const NotionIntegration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [formulasDbId, setFormulasDbId] = useState('');
  const [docsDbId, setDocsDbId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch Notion integration status
  useEffect(() => {
    const fetchNotionStatus = async () => {
      try {
        setLoading(true);
        const response = await api.notion.getStatus();
        setIntegrationStatus(response.data);
        
        // Pre-fill form fields if integration exists
        if (response.data.connected) {
          setWorkspaceId(response.data.workspace_id || '');
          setFormulasDbId(response.data.formulas_db_id || '');
          setDocsDbId(response.data.docs_db_id || '');
        }
      } catch (error) {
        console.error('Failed to fetch Notion status:', error);
        setError('Failed to check Notion integration status');
      } finally {
        setLoading(false);
      }
    };

    fetchNotionStatus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!accessToken && !integrationStatus?.connected) {
      setError('Access token is required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const data = {
        access_token: accessToken || undefined,
        workspace_id: workspaceId || undefined,
        formulas_db_id: formulasDbId || undefined,
        docs_db_id: docsDbId || undefined
      };
      
      const response = await api.notion.connect(data);
      
      if (response.data.success) {
        setSuccess('Notion integration saved successfully');
        
        // Update status
        const statusResponse = await api.notion.getStatus();
        setIntegrationStatus(statusResponse.data);
        setAccessToken(''); // Clear sensitive data
      } else {
        setError('Failed to save Notion integration');
      }
    } catch (error) {
      console.error('Failed to connect Notion:', error);
      setError(error.response?.data?.detail || 'Failed to connect Notion');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle disconnecting Notion
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Notion integration?')) {
      return;
    }
    
    setError('');
    setSuccess('');
    setIsSaving(true);
    
    try {
      const response = await api.notion.disconnect();
      
      if (response.data.success) {
        setSuccess('Notion integration disconnected successfully');
        setIntegrationStatus({ connected: false });
        setWorkspaceId('');
        setFormulasDbId('');
        setDocsDbId('');
      } else {
        setError('Failed to disconnect Notion integration');
      }
    } catch (error) {
      console.error('Failed to disconnect Notion:', error);
      setError(error.response?.data?.detail || 'Failed to disconnect Notion');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
          <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Notion Integration
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect your Notion workspace to sync formulas and documentation.
        </p>
      </div>
      
      {error && (
        <div className="m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="m-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}
      
      {/* Status banner */}
      {integrationStatus && (
        <div className={`mx-6 mt-6 p-4 rounded-md flex items-center ${
          integrationStatus.connected 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full ${
            integrationStatus.connected 
              ? 'bg-green-100 dark:bg-green-800' 
              : 'bg-yellow-100 dark:bg-yellow-800'
          }`}>
            {integrationStatus.connected ? (
              <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              integrationStatus.connected 
                ? 'text-green-800 dark:text-green-300' 
                : 'text-yellow-800 dark:text-yellow-300'
            }`}>
              {integrationStatus.connected 
                ? 'Connected to Notion' 
                : 'Not connected to Notion'}
            </h3>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {integrationStatus.connected && (
                <>
                  {integrationStatus.workspace_id && (
                    <p>Workspace ID: {integrationStatus.workspace_id}</p>
                  )}
                  {integrationStatus.formulas_db_id && (
                    <p>Formulas Database ID: {integrationStatus.formulas_db_id}</p>
                  )}
                  {integrationStatus.docs_db_id && (
                    <p>Docs Database ID: {integrationStatus.docs_db_id}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Configuration form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notion Access Token {!integrationStatus?.connected && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            id="accessToken"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder={integrationStatus?.connected ? '••••••••••••••••' : 'Enter your Notion access token'}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required={!integrationStatus?.connected}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {integrationStatus?.connected 
              ? 'Leave blank to keep the current token' 
              : 'Generate an access token in your Notion integrations settings'}
          </p>
        </div>
        
        <div>
          <label htmlFor="workspaceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Workspace ID
          </label>
          <input
            type="text"
            id="workspaceId"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            placeholder="Enter your Notion workspace ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="formulasDbId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Formulas Database ID
          </label>
          <input
            type="text"
            id="formulasDbId"
            value={formulasDbId}
            onChange={(e) => setFormulasDbId(e.target.value)}
            placeholder="Enter your Notion formulas database ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            The ID of the Notion database where formulas will be synced
          </p>
        </div>
        
        <div>
          <label htmlFor="docsDbId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Docs Database ID
          </label>
          <input
            type="text"
            id="docsDbId"
            value={docsDbId}
            onChange={(e) => setDocsDbId(e.target.value)}
            placeholder="Enter your Notion docs database ID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            The ID of the Notion database where documentation will be synced
          </p>
        </div>
        
        <div className="flex justify-between pt-4">
          {integrationStatus?.connected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-red-400 dark:hover:bg-gray-650"
            >
              {isSaving ? 'Disconnecting...' : 'Disconnect Notion'}
            </button>
          ) : (
            <div></div> // Empty div to maintain layout with flex justify-between
          )}
          
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : (integrationStatus?.connected ? 'Update Connection' : 'Connect to Notion')}
          </button>
        </div>
      </form>
      
      {/* How it works section */}
      {integrationStatus?.connected && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            How to use Notion sync
          </h4>
          <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 list-disc pl-5">
            <li>Go to any formula detail page</li>
            <li>Click the "Sync to Notion" button</li>
            <li>Your formula and documentation will be synced as a Notion page</li>
            <li>Any changes made to the formula will be synced with the Notion page</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotionIntegration;