import React from 'react';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../core/api/loaders';
import { useAccounts, useBeneficiaries, useCurrencies } from '../core/api/client';
import { DebugPanel } from './debug/DebugPanel';

export const TransferPageDebug: React.FC = () => {
  // Get raw data from loaders
  const rawAccounts = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts).get();
  const rawBeneficiaries = useDataLoader(GQL_LOADERS.get_npa_beneficiaries).get();
  const rawCurrencies = useDataLoader(GQL_LOADERS.get_npa_currencies).get();
  
  // Get adapted data from hooks
  const { data: adaptedAccounts, loading: accountsLoading } = useAccounts();
  const { data: adaptedBeneficiaries, loading: beneficiariesLoading } = useBeneficiaries();
  const { data: adaptedCurrencies, loading: currenciesLoading } = useCurrencies();
  
  console.log('=== Transfer Page Debug ===');
  console.log('Raw accounts:', rawAccounts);
  console.log('Raw beneficiaries:', rawBeneficiaries);
  console.log('Raw currencies:', rawCurrencies);
  console.log('Adapted accounts:', adaptedAccounts);
  console.log('Adapted beneficiaries:', adaptedBeneficiaries);
  console.log('Adapted currencies:', adaptedCurrencies);
  
  return (
    <DebugPanel title="Transfer Page Debug" position="top-left">
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Raw Data</h4>
            <div>Accounts: {rawAccounts ? rawAccounts.length : 'null'}</div>
            <div>Beneficiaries: {rawBeneficiaries ? rawBeneficiaries.length : 'null'}</div>
            <div>Currencies: {rawCurrencies ? rawCurrencies.length : 'null'}</div>
          </div>
          
          <div>
            <h4 className="font-semibold">Adapted Data</h4>
            <div>Accounts: {adaptedAccounts.length} {accountsLoading && '(loading)'}</div>
            <div>Beneficiaries: {adaptedBeneficiaries.length} {beneficiariesLoading && '(loading)'}</div>
            <div>Currencies: {adaptedCurrencies.length} {currenciesLoading && '(loading)'}</div>
          </div>
        </div>
        
        {rawBeneficiaries && rawBeneficiaries.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-1">First Raw Beneficiary:</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(rawBeneficiaries[0], null, 2)}
            </pre>
          </div>
        )}
        
        {adaptedBeneficiaries.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-1">First Adapted Beneficiary:</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(adaptedBeneficiaries[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </DebugPanel>
  );
};