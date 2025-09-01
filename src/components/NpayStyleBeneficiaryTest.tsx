import React, { useEffect } from 'react';
import { defineLoader, useDataLoader, coreLibQuery } from 'nsw-frontend-core-lib';
import { gql } from '@apollo/client';
import { DebugPanel } from './debug/DebugPanel';

// Define the exact same query as npay-fe
const testQuery = gql`
  {
    npa_identity {
      beneficiaries {
        id
        firstname_txt
        lastname_txt
        email_txt
      }
    }
  }
`;

// Create a test loader with a unique name
const TEST_LOADER_KEY = 'test_beneficiaries_loader_' + Date.now();

export const NpayStyleBeneficiaryTest: React.FC = () => {
  const [manualResult, setManualResult] = React.useState<any>(null);
  const [loaderResult, setLoaderResult] = React.useState<any>(null);
  
  useEffect(() => {
    // Test 1: Direct query (we know this works)
    const testDirect = async () => {
      try {
        const res = await coreLibQuery({ query: testQuery });
        console.log('NpayStyleBeneficiaryTest - Direct query result:', res);
        setManualResult(res);
      } catch (err) {
        console.error('NpayStyleBeneficiaryTest - Direct query error:', err);
        setManualResult({ error: err });
      }
    };
    
    // Test 2: Define and use a fresh loader
    try {
      console.log('Defining test loader with key:', TEST_LOADER_KEY);
      defineLoader(TEST_LOADER_KEY, testQuery, {
        clean_fct: (data: any) => {
          console.log('Test loader clean_fct received:', data);
          return data?.npa_identity?.beneficiaries || [];
        }
      });
      
      // Small delay to let loader initialize
      setTimeout(() => {
        try {
          const result = useDataLoader(TEST_LOADER_KEY).get();
          console.log('Test loader result:', result);
          setLoaderResult(result);
        } catch (err) {
          console.error('Test loader error:', err);
          setLoaderResult({ error: err });
        }
      }, 100);
    } catch (err) {
      console.error('Error defining test loader:', err);
    }
    
    testDirect();
  }, []);
  
  // Try using the loader after it's defined
  let liveLoaderData = null;
  try {
    liveLoaderData = useDataLoader(TEST_LOADER_KEY).get();
  } catch (e) {
    // Loader might not be ready yet
  }
  
  return (
    <DebugPanel title="Npay Style Test" position="top-center">
      <div className="space-y-2 text-xs">
        <div>
          <div className="font-semibold">Direct Query:</div>
          {manualResult ? (
            manualResult.error ? (
              <div className="text-red-600">Error</div>
            ) : (
              <div className="text-green-600">
                Found {manualResult.data?.npa_identity?.beneficiaries?.length || 0} beneficiaries
              </div>
            )
          ) : (
            <div className="text-yellow-600">Loading...</div>
          )}
        </div>
        
        <div>
          <div className="font-semibold">Fresh Loader:</div>
          {liveLoaderData !== null ? (
            <div className="text-green-600">
              Live data: {Array.isArray(liveLoaderData) ? liveLoaderData.length : typeof liveLoaderData} items
            </div>
          ) : (
            <div className="text-yellow-600">Not ready</div>
          )}
        </div>
        
        <div>
          <div className="font-semibold">Loader Result:</div>
          {loaderResult ? (
            loaderResult.error ? (
              <div className="text-red-600">Error: {JSON.stringify(loaderResult.error)}</div>
            ) : (
              <div className="text-green-600">
                {Array.isArray(loaderResult) ? loaderResult.length : typeof loaderResult} items
              </div>
            )
          ) : (
            <div className="text-yellow-600">Waiting...</div>
          )}
        </div>
      </div>
    </DebugPanel>
  );
};