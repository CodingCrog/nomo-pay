import React, { useEffect, useState } from 'react';
import { coreLibQuery } from 'nsw-frontend-core-lib';
import { gql } from '@apollo/client';
import { getNpaIdentityBankTransactions } from '../core/api/queries';
import { DebugPanel } from './debug/DebugPanel';

export const DirectQueryTest: React.FC = () => {
  const [result1, setResult1] = useState<any>(null);
  const [result2, setResult2] = useState<any>(null);
  
  useEffect(() => {
    // Test 1: Simple query that we know works
    const test1 = async () => {
      try {
        const simpleQuery = gql`
          {
            npa_identity_banktransactions {
              id
              created_at
              type_txt
              request_amount
            }
          }
        `;
        const res = await coreLibQuery({ query: simpleQuery });
        console.log('DirectQueryTest - Simple query result:', res);
        setResult1(res);
      } catch (err) {
        console.error('DirectQueryTest - Simple query error:', err);
        setResult1({ error: err });
      }
    };
    
    // Test 2: The actual query being used by the loader
    const test2 = async () => {
      try {
        const res = await coreLibQuery({ query: getNpaIdentityBankTransactions });
        console.log('DirectQueryTest - Actual loader query result:', res);
        setResult2(res);
      } catch (err) {
        console.error('DirectQueryTest - Actual loader query error:', err);
        setResult2({ error: err });
      }
    };
    
    test1();
    test2();
  }, []);
  
  return (
    <DebugPanel title="Direct Query Test" position="bottom-center">
      <div className="space-y-2 text-xs">
        <div>
          <div className="font-semibold">Simple Query Result:</div>
          <div className="p-1 bg-gray-100 dark:bg-gray-900 rounded">
            {result1 ? (
              result1.error ? (
                <div className="text-red-600">Error</div>
              ) : (
                <div className="text-green-600">
                  Success: {result1.data?.npa_identity_banktransactions?.length || 0} transactions
                </div>
              )
            ) : (
              <div className="text-yellow-600">Loading...</div>
            )}
          </div>
        </div>
        
        <div>
          <div className="font-semibold">Actual Loader Query Result:</div>
          <div className="p-1 bg-gray-100 dark:bg-gray-900 rounded">
            {result2 ? (
              result2.error ? (
                <div className="text-red-600">Error: {JSON.stringify(result2.error)}</div>
              ) : (
                <div className="text-green-600">
                  Success: {result2.data?.npa_identity_banktransactions?.length || 0} transactions
                </div>
              )
            ) : (
              <div className="text-yellow-600">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </DebugPanel>
  );
};