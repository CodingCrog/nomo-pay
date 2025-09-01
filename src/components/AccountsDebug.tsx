import React from 'react';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../core/api/loaders';
import { useAccounts } from '../core/api/client';
import { DebugPanel } from './debug/DebugPanel';

export const AccountsDebug: React.FC = () => {
  // Get raw data from loader
  const rawAccounts = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts).get();
  
  // Get adapted data from hook
  const { data: adaptedAccounts } = useAccounts();
  
  console.log('=== Accounts Debug ===');
  console.log('Raw accounts from backend:', rawAccounts);
  console.log('Adapted accounts:', adaptedAccounts);
  
  // Check first account structure
  const firstRaw = rawAccounts?.[0];
  if (firstRaw) {
    console.log('First raw account structure:', {
      id: firstRaw.id,
      type_char: firstRaw.type_char,
      balance: firstRaw.balance,
      transactioncurrency: firstRaw.transactioncurrency,
      created_at: firstRaw.created_at,
      keys: Object.keys(firstRaw)
    });
  }
  
  return (
    <DebugPanel title="Accounts Debug" position="bottom-left">
      <div className="space-y-2 text-xs">
        <h4 className="font-semibold">Accounts Analysis</h4>
        
        <div>
          <div className="font-semibold">Raw Accounts: {rawAccounts?.length || 0}</div>
          <div className="font-semibold">Adapted Accounts: {adaptedAccounts?.length || 0}</div>
        </div>
        
        {rawAccounts && rawAccounts.length > 0 && (
          <div className="space-y-2">
            <div className="font-semibold">Raw Account Fields:</div>
            {rawAccounts.slice(0, 2).map((acc: any, idx: number) => (
              <div key={idx} className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
                <div className="font-semibold">Account {idx + 1}:</div>
                <div>ID: <span className="font-mono">{acc.id}</span></div>
                <div>Type Char: <span className="font-mono">{acc.type_char}</span></div>
                <div>Balance: <span className="font-mono">{acc.balance}</span></div>
                <div>Currency: <span className="font-mono">{acc.transactioncurrency?.currency_code}</span></div>
                <div className="text-yellow-600">
                  Should adapt to: {acc.type_char === 'N' ? 'Numbered' : 'GB Based'}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {adaptedAccounts && adaptedAccounts.length > 0 && (
          <div className="space-y-2">
            <div className="font-semibold">Adapted Accounts:</div>
            {adaptedAccounts.map((acc: any, idx: number) => (
              <div key={idx} className="p-2 bg-green-100 dark:bg-green-900 rounded">
                <div>Name: {acc.name}</div>
                <div>Type: {acc.type}</div>
                <div>Balance: {acc.balance} {acc.currency}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DebugPanel>
  );
};