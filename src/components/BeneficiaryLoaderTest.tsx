import React from 'react';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../core/api/loaders';
import { DebugPanel } from './debug/DebugPanel';

export const BeneficiaryLoaderTest: React.FC = () => {
  const beneficiariesFromLoader = useDataLoader(GQL_LOADERS.get_npa_beneficiaries).get();
  
  console.log('BeneficiaryLoaderTest - Data from loader:', beneficiariesFromLoader);
  
  return (
    <DebugPanel title="Beneficiary Loader Test" position="right">
      <div className="space-y-2 text-xs">
        <div className="font-semibold">Direct Loader Test</div>
        <div>Type: {typeof beneficiariesFromLoader}</div>
        <div>Is Array: {Array.isArray(beneficiariesFromLoader) ? 'Yes' : 'No'}</div>
        <div>Count: {Array.isArray(beneficiariesFromLoader) ? beneficiariesFromLoader.length : 'N/A'}</div>
        
        {Array.isArray(beneficiariesFromLoader) && beneficiariesFromLoader.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold">Beneficiaries:</div>
            {beneficiariesFromLoader.map((b: any) => (
              <div key={b.id} className="p-1 bg-gray-100 dark:bg-gray-900 rounded mt-1">
                {b.firstname_txt} {b.lastname_txt}
              </div>
            ))}
          </div>
        )}
        
        {!beneficiariesFromLoader && (
          <div className="text-yellow-600">Loader returned null/undefined</div>
        )}
      </div>
    </DebugPanel>
  );
};