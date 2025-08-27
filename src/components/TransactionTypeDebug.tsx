import React from 'react';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../api/loaders';
import { useTransactions } from '../api/client';
import { DebugPanel } from './debug/DebugPanel';

export const TransactionTypeDebug: React.FC = () => {
  // Get raw data from loader
  const rawTransactions = useDataLoader(GQL_LOADERS.get_npa_identity_banktransactions).get();
  
  // Get adapted data from hook
  const { data: adaptedTransactions } = useTransactions();
  
  // Show first few transactions with type info
  const firstRaw = rawTransactions?.[0];
  const firstAdapted = adaptedTransactions?.[0];
  
  console.log('=== Transaction Type Debug ===');
  if (firstRaw) {
    console.log('Raw transaction type_char:', firstRaw.type_char);
    console.log('Raw transaction type_txt:', firstRaw.type_txt);
    console.log('Raw transaction request_amount:', firstRaw.request_amount);
    console.log('Raw transaction settle_amount:', firstRaw.settle_amount);
  }
  if (firstAdapted) {
    console.log('Adapted transaction type:', firstAdapted.type);
    console.log('Adapted transaction amount:', firstAdapted.amount);
    console.log('Adapted transaction description:', firstAdapted.description);
  }
  
  return (
    <DebugPanel title="Transaction Type Debug" position="top-left">
      <div className="space-y-2 text-xs">
        <h4 className="font-semibold">Transaction Types Analysis</h4>
        
        {rawTransactions && rawTransactions.length > 0 && (
          <div className="space-y-2">
            {rawTransactions.slice(0, 3).map((tx: any, idx: number) => (
              <div key={idx} className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
                <div className="font-semibold">Transaction {idx + 1}:</div>
                <div>Type Char: <span className="font-mono">{tx.type_char}</span></div>
                <div>Type Text: <span className="font-mono">{tx.type_txt}</span></div>
                <div>Request Amount: <span className="font-mono">{tx.request_amount}</span></div>
                <div>Status: <span className="font-mono">{tx.status_txt}</span></div>
                <div className="mt-1 text-green-600">
                  Raw Amount: {tx.request_amount} → Display as: {tx.type_txt?.toLowerCase().includes('deposit') ? '+' : '-'}{Math.abs(tx.request_amount || 0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DebugPanel>
  );
};