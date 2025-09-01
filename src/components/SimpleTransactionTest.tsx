import React, { useEffect, useState } from 'react';
import { useDataLoader, coreLibQuery } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../core/api/loaders';
import { gql } from '@apollo/client';
import { DebugPanel } from './debug/DebugPanel';

export const SimpleTransactionTest: React.FC = () => {
  const [manualResult, setManualResult] = useState<any>(null);
  
  // Try using the loader directly
  const loaderData = useDataLoader(GQL_LOADERS.get_npa_identity_banktransactions).get();
  
  useEffect(() => {
    // Try a simple manual query
    const testManualQuery = async () => {
      try {
        const simpleQuery = gql`
          {
            npa_identity_banktransactions {
              id
            }
          }
        `;
        
        const result = await coreLibQuery({ query: simpleQuery });
        console.log('Simple manual query result:', result);
        setManualResult(result);
      } catch (error) {
        console.error('Manual query error:', error);
        setManualResult({ error: error });
      }
    };
    
    testManualQuery();
  }, []);
  
  return (
    <DebugPanel title="Simple Transaction Test" position="top-left">
      <div className="space-y-2 text-xs">
        <div>
          <div className="font-semibold">Loader Data:</div>
          <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
            {loaderData ? (
              <div>
                <div>Type: {typeof loaderData}</div>
                <div>Is Array: {Array.isArray(loaderData) ? 'Yes' : 'No'}</div>
                <div>Length: {Array.isArray(loaderData) ? loaderData.length : 'N/A'}</div>
                <div>Data: {JSON.stringify(loaderData).slice(0, 100)}...</div>
              </div>
            ) : (
              <div className="text-yellow-600">No data from loader</div>
            )}
          </div>
        </div>
        
        <div>
          <div className="font-semibold">Manual Query Result:</div>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
            {manualResult ? (
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(manualResult, null, 2).slice(0, 200)}...
              </pre>
            ) : (
              <div className="text-yellow-600">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </DebugPanel>
  );
};