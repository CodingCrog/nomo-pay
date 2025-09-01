import React, { useState } from 'react';
import { coreLibQuery } from 'nsw-frontend-core-lib';
import { gql } from '@apollo/client';
import { DebugPanel } from './debug/DebugPanel';

export const TransactionQueryTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testQueries = [
    {
      name: 'Test 1: npa_identity_banktransactions',
      query: gql`
        {
          npa_identity_banktransactions {
            id
            created_at
            type_txt
            request_amount
            status_txt
          }
        }
      `
    },
    {
      name: 'Test 2: npa_banktransactions',
      query: gql`
        {
          npa_banktransactions {
            id
            created_at
            type_txt
            request_amount
            status_txt
          }
        }
      `
    },
    {
      name: 'Test 3: npa_identity with transactions',
      query: gql`
        {
          npa_identity {
            id
            banktransactions {
              id
              created_at
              type_txt
              request_amount
              status_txt
            }
          }
        }
      `
    },
    {
      name: 'Test 4: npa_transactions',
      query: gql`
        {
          npa_transactions {
            id
            created_at
            type_txt
            request_amount
            status_txt
          }
        }
      `
    }
  ];

  const runTest = async (test: any) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log(`Running ${test.name}...`);
      const response = await coreLibQuery({ query: test.query });
      console.log(`${test.name} Response:`, response);
      setResult({ name: test.name, data: response });
    } catch (err: any) {
      console.error(`${test.name} Error:`, err);
      setError(`${test.name} failed: ${err.message}`);
      setResult({ name: test.name, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DebugPanel title="Transaction Query Test" position="top-right">
      <div className="space-y-2 text-xs">
        <h4 className="font-semibold">Test Different Query Formats</h4>
        
        <div className="space-y-1">
          {testQueries.map((test, idx) => (
            <button
              key={idx}
              onClick={() => runTest(test)}
              disabled={loading}
              className="w-full text-left px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {test.name}
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="text-yellow-600">Loading...</div>
        )}
        
        {error && (
          <div className="text-red-600 p-2 bg-red-100 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded max-h-60 overflow-auto">
            <div className="font-semibold">{result.name}</div>
            {result.error ? (
              <div className="text-red-600">Error: {result.error}</div>
            ) : (
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </DebugPanel>
  );
};