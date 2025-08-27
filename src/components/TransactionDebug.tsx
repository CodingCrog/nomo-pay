import React from 'react';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../api/loaders';
import { useTransactions } from '../api/client';
import { DebugPanel } from './debug/DebugPanel';

export const TransactionDebug: React.FC = () => {
  // Get raw data from loader
  const rawTransactions = useDataLoader(GQL_LOADERS.get_npa_identity_banktransactions).get();
  
  // Get adapted data from hook
  const { data: adaptedTransactions } = useTransactions();
  
  console.log('=== Transaction Debug ===');
  console.log('Raw transactions from loader:', rawTransactions);
  console.log('Adapted transactions from hook:', adaptedTransactions);
  
  return (
    <DebugPanel title="Transaction Debug" position="bottom-left">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm">Raw Transactions ({rawTransactions?.length || 0})</h4>
          {rawTransactions && rawTransactions.length > 0 ? (
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(rawTransactions[0], null, 2)}
            </pre>
          ) : (
            <p className="text-xs text-gray-500">No raw transactions</p>
          )}
        </div>
        
        <div>
          <h4 className="font-semibold text-sm">Adapted Transactions ({adaptedTransactions.length})</h4>
          {adaptedTransactions.length > 0 ? (
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(adaptedTransactions[0], null, 2)}
            </pre>
          ) : (
            <p className="text-xs text-gray-500">No adapted transactions</p>
          )}
        </div>
      </div>
    </DebugPanel>
  );
};