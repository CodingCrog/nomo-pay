import React, { useEffect, useState } from 'react';
import { useDataLoader, coreLibQuery } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../api/loaders';
import { getNpaIdentity, getNpaIdentityBankTransactions } from '../api/queries';
import { useTheme } from '../context/ThemeContext';
import { DebugPanel } from './debug/DebugPanel';

export const DataLoaderDebug: React.FC = () => {
  const { colors } = useTheme();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Try to use the data loaders
  const identityLoader = useDataLoader(GQL_LOADERS.get_npa_identity);
  const accountsLoader = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts);
  const transactionsLoader = useDataLoader(GQL_LOADERS.get_npa_identity_banktransactions);
  
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
  
  // Test transactions query
  const testTransactionsQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing transactions GraphQL query...');
      const result = await coreLibQuery({
        query: getNpaIdentityBankTransactions,
        variables: {}
      });
      console.log('Transactions query result:', result);
      setTestResult(result);
    } catch (err: any) {
      console.error('Transactions query error:', err);
      setError(err?.message || 'Transaction query failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Get loader data
  const identityData = identityLoader.get();
  const accountsData = accountsLoader.get();
  const transactionsData = transactionsLoader.get();
  
  useEffect(() => {
    // Try to get data from loaders
    console.log('Identity loader data:', identityData);
    console.log('Accounts loader data:', accountsData);
    console.log('Transactions loader data:', transactionsData);
    
    // Log transaction details if available
    if (transactionsData && transactionsData.length > 0) {
      console.log('First transaction raw data:', transactionsData[0]);
    }
  }, [identityData, accountsData, transactionsData]);
  
  return (
    <DebugPanel title="Data Loader Debug" position="top-right">
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
              {accountsData ? `Has Data (${accountsData.length})` : 'No Data'}
            </span>
          </div>
          
          <div>
            <span style={{ color: colors.text2 }}>Transactions Loader: </span>
            <span style={{ color: transactionsData ? '#10b981' : '#ef4444' }}>
              {transactionsData ? `Has Data (${transactionsData.length})` : 'No Data'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={testDirectQuery}
              disabled={loading}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Identity'}
            </button>
            
            <button
              onClick={testTransactionsQuery}
              disabled={loading}
              className="mt-2 px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Transactions'}
            </button>
          </div>
          
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
    </DebugPanel>
  );
};