// frontend/src/components/Formula/FormulaDocumentationTab.jsx
import React, { useState } from 'react';
import { useFormula } from '../../context/FormulaContext';
import { formulaAPI } from '../../services/api';
import ReactMarkdown from 'react-markdown';

const FormulaDocumentationTab = ({ formula }) => {
  const { updateFormulaField } = useFormula();
  const [isEditingMSDS, setIsEditingMSDS] = useState(false);
  const [isEditingSOP, setIsEditingSOP] = useState(false);
  const [msdsContent, setMsdsContent] = useState(formula.msds || '');
  const [sopContent, setSopContent] = useState(formula.sop || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Handle saving MSDS
  const handleSaveMSDS = async () => {
    setIsSaving(true);
    setError('');
    try {
      await formulaAPI.update_formula_documentation(formula.id, { msds: msdsContent });
      updateFormulaField('msds', msdsContent);
      setIsEditingMSDS(false);
    } catch (err) {
      console.error('Failed to save MSDS:', err);
      setError('Failed to save MSDS. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle saving SOP
  const handleSaveSOP = async () => {
    setIsSaving(true);
    setError('');
    try {
      await formulaAPI.update_formula_documentation(formula.id, { sop: sopContent });
      updateFormulaField('sop', sopContent);
      setIsEditingSOP(false);
    } catch (err) {
      console.error('Failed to save SOP:', err);
      setError('Failed to save SOP. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Material Safety Data Sheet (MSDS) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Material Safety Data Sheet (MSDS)
          </h3>
          <button
            type="button"
            onClick={() => setIsEditingMSDS(!isEditingMSDS)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
          >
            {isEditingMSDS ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="p-4">
          {isEditingMSDS ? (
            <div className="space-y-4">
              <textarea
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={msdsContent}
                onChange={(e) => setMsdsContent(e.target.value)}
                placeholder="Enter Material Safety Data Sheet information in Markdown format..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingMSDS(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMSDS}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save MSDS'}
                </button>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {formula.msds ? (
                <ReactMarkdown>{formula.msds}</ReactMarkdown>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No Material Safety Data Sheet information available. Click Edit to add MSDS details.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Standard Operating Procedure (SOP) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Standard Operating Procedure (SOP)
          </h3>
          <button
            type="button"
            onClick={() => setIsEditingSOP(!isEditingSOP)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
          >
            {isEditingSOP ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="p-4">
          {isEditingSOP ? (
            <div className="space-y-4">
              <textarea
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={sopContent}
                onChange={(e) => setSopContent(e.target.value)}
                placeholder="Enter Standard Operating Procedure in Markdown format..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSOP(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSOP}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save SOP'}
                </button>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {formula.sop ? (
                <ReactMarkdown>{formula.sop}</ReactMarkdown>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No Standard Operating Procedure available. Click Edit to add SOP details.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaDocumentationTab;