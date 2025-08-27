import React, { useEffect, useState } from 'react';
import { useDataLoader, coreLibQuery } from '../../node_modules/nsw-frontend-core-lib/dist/index.js';
import { GQL_LOADERS } from '../api/loaders';
import { getNpaIdentity, getNpaIdentityBankAccounts } from '../api/queries';
import { useTheme } from '../context/ThemeContext';

export const DataLoaderDebug: React.FC = () => {
  const { colors } = useTheme();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Try to use the data loaders
  const identityLoader = useDataLoader(GQL_LOADERS.get_npa_identity);
  const accountsLoader = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts);
  
  // Test direct query
  const testDirectQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing direct GraphQL query...');
      const result = await coreLibQuery({
        query: getNpaIdentity,
        variables: {}
      });
      console.log('Direct query result:', result);
      setTestResult(result);
    } catch (err: any) {
      console.error('Direct query error:', err);
      setError(err?.message || 'Query failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Get loader data
  const identityData = identityLoader.peek();
  const accountsData = accountsLoader.peek();
  
  useEffect(() => {
    // Try to get data from loaders
    console.log('Identity loader data:', identityData);
    console.log('Accounts loader data:', accountsData);
    
    // Log loader state
    console.log('Identity loader has data:', identityLoader.has());
    console.log('Accounts loader has data:', accountsLoader.has());
  }, [identityData, accountsData]);
  
  if (!import.meta.env.VITE_FORCE_DEBUG) {
    return null;
  }
  
  return (
    <div className="fixed top-20 right-4 max-w-md z-50">
      <div 
        className="rounded-lg p-4 shadow-xl"
        style={{ backgroundColor: colors.background2 }}
      >
        <h3 className="font-bold mb-2" style={{ color: colors.text1 }}>
          Data Loader Debug
        </h3>
        
        <div className="space-y-2 text-xs">
          <div>
            <span style={{ color: colors.text2 }}>Identity Loader: </span>
            <span style={{ color: identityData ? '#10b981' : '#ef4444' }}>
              {identityData ? 'Has Data' : 'No Data'}
            </span>
          </div>
          
          <div>
            <span style={{ color: colors.text2 }}>Accounts Loader: </span>
            <span style={{ color: accountsData ? '#10b981' : '#ef4444' }}>
              {accountsData ? 'Has Data' : 'No Data'}
            </span>
          </div>
          
          <button
            onClick={testDirectQuery}
            disabled={loading}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Query'}
          </button>
          
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-xs">
              Error: {error}
            </div>
          )}
          
          {testResult && (
            <div className="mt-2">
              <p style={{ color: colors.text2 }}>Query Result:</p>
              <pre className="text-xs overflow-auto max-h-40" style={{ color: colors.text1 }}>
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
          
          <details className="mt-2">
            <summary style={{ color: colors.text2, cursor: 'pointer' }}>
              Loader Details
            </summary>
            <div className="mt-1 space-y-1">
              <div style={{ color: colors.text1 }}>
                Identity: {JSON.stringify(identityData, null, 2)}
              </div>
              <div style={{ color: colors.text1 }}>
                Accounts: {JSON.stringify(accountsData, null, 2)}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};