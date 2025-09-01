import React, { useState } from 'react';
import { coreLibQuery } from 'nsw-frontend-core-lib';
import { gql } from '@apollo/client';
import { DebugPanel } from './debug/DebugPanel';

export const MinimalTransactionTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runMinimalTest = async () => {
    setLoading(true);
    try {
      // Test with absolute minimal fields
      const minimalQuery = gql`
        {
          npa_identity_banktransactions {
            id
            created_at
            type_txt
            request_amount
            status_txt
          }
        }
      `;
      
      console.log('Running minimal transaction query...');
      const response = await coreLibQuery({ query: minimalQuery });
      console.log('Minimal query response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Minimal query error:', err);
      setResult({ error: err.message || err });
    } finally {
      setLoading(false);
    }
  };

  const runFullTest = async () => {
    setLoading(true);
    try {
      // Test with all fields from npay-fe
      const fullQuery = gql`
        {
          npa_identity_banktransactions {
            id
            created_at
            updated_at
            settled_at
            status_txt
            request_amount
            settle_amount
            fee_amount
            reference_code
            type_char
            type_txt
            identitybankaccount {
              id
              created_at
              type_char
              balance
            }
            transactioncurrency {
              id
              currency_code
              currency_name
            }
          }
        }
      `;
      
      console.log('Running full transaction query...');
      const response = await coreLibQuery({ query: fullQuery });
      console.log('Full query response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('Full query error:', err);
      setResult({ error: err.message || err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DebugPanel title="Minimal Transaction Test" position="top-left">
      <div className="space-y-2 text-xs">
        <h4 className="font-semibold">Test Transaction Query Step by Step</h4>
        
        <div className="space-y-2">
          <button
            onClick={runMinimalTest}
            disabled={loading}
            className="w-full px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test 1: Minimal Fields Only
          </button>
          
          <button
            onClick={runFullTest}
            disabled={loading}
            className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test 2: Full Transaction Fields
          </button>
        </div>
        
        {loading && (
          <div className="text-yellow-600">Loading...</div>
        )}
        
        {result && (
          <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded max-h-60 overflow-auto">
            {result.error ? (
              <div className="text-red-600">
                <div className="font-semibold">Error:</div>
                <pre className="whitespace-pre-wrap">{JSON.stringify(result.error, null, 2)}</pre>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-green-600">Success!</div>
                <div className="mt-2">
                  {result.data?.npa_identity_banktransactions ? (
                    <div>
                      <div>Found {result.data.npa_identity_banktransactions.length} transactions</div>
                      {result.data.npa_identity_banktransactions.length > 0 && (
                        <div className="mt-2">
                          <div className="font-semibold">First transaction:</div>
                          <pre className="whitespace-pre-wrap text-xs">
                            {JSON.stringify(result.data.npa_identity_banktransactions[0], null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>No transactions field in response</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DebugPanel>
  );
};