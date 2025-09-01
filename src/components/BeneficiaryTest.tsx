import React, { useEffect, useState } from 'react';
import { coreLibQuery } from 'nsw-frontend-core-lib';
import { gql } from '@apollo/client';
import { DebugPanel } from './debug/DebugPanel';

export const BeneficiaryTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  
  useEffect(() => {
    const testQuery = async () => {
      try {
        // Test the beneficiaries query
        const query = gql`
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
        
        console.log('BeneficiaryTest - Running query...');
        const res = await coreLibQuery({ query });
        console.log('BeneficiaryTest - Result:', res);
        setResult(res);
      } catch (err) {
        console.error('BeneficiaryTest - Error:', err);
        setResult({ error: err });
      }
    };
    
    testQuery();
  }, []);
  
  return (
    <DebugPanel title="Beneficiary Test" position="top-left">
      <div className="space-y-2 text-xs">
        <div className="font-semibold">Beneficiaries Query Test</div>
        {result ? (
          result.error ? (
            <div className="text-red-600">Error: {JSON.stringify(result.error)}</div>
          ) : (
            <div>
              <div className="text-green-600">
                Found {result.data?.npa_identity?.beneficiaries?.length || 0} beneficiaries
              </div>
              {result.data?.npa_identity?.beneficiaries?.map((b: any) => (
                <div key={b.id} className="p-1 bg-gray-100 dark:bg-gray-900 rounded mt-1">
                  {b.firstname_txt} {b.lastname_txt}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-yellow-600">Loading...</div>
        )}
      </div>
    </DebugPanel>
  );
};