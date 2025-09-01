import React from 'react';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../api/loaders';
import { useTransactions } from '../api/client';
import { DebugPanel } from './debug/DebugPanel';

export const TransactionsDebug: React.FC = () => {
  // Get raw data from loader
  const rawTransactions = useDataLoader(GQL_LOADERS.get_npa_identity_banktransactions).get();
  
  // Get adapted data from hook
  const { data: adaptedTransactions } = useTransactions();
  
  console.log('=== Transactions Debug ===');
  console.log('Raw transactions from backend:', rawTransactions);
  console.log('Adapted transactions:', adaptedTransactions);
  
  // Check first transaction structure
  const firstRaw = rawTransactions?.[0];
  if (firstRaw) {
    console.log('First raw transaction structure:', {
      id: firstRaw.id,
      created_at: firstRaw.created_at,
      type_txt: firstRaw.type_txt,
      type_char: firstRaw.type_char,
      request_amount: firstRaw.request_amount,
      status_txt: firstRaw.status_txt,
      transactioncurrency: firstRaw.transactioncurrency,
      identitybankaccount: firstRaw.identitybankaccount,
      keys: Object.keys(firstRaw)
    });
  }
  
  return (
    <DebugPanel title="Transactions Debug" position="bottom-right">
      <div className="space-y-2 text-xs">
        <h4 className="font-semibold">Transactions Analysis</h4>
        
        <div>
          <div className="font-semibold">Raw Transactions: {rawTransactions?.length || 0}</div>
          <div className="font-semibold">Adapted Transactions: {adaptedTransactions?.length || 0}</div>
        </div>
        
        {rawTransactions && rawTransactions.length > 0 && (
          <div className="space-y-2">
            <div className="font-semibold">Raw Transaction Fields:</div>
            {rawTransactions.slice(0, 2).map((tx: any, idx: number) => (
              <div key={idx} className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
                <div className="font-semibold">Transaction {idx + 1}:</div>
                <div>ID: <span className="font-mono">{tx.id}</span></div>
                <div>Type: <span className="font-mono">{tx.type_txt || tx.type_char}</span></div>
                <div>Amount: <span className="font-mono">{tx.request_amount}</span></div>
                <div>Currency: <span className="font-mono">{tx.transactioncurrency?.currency_code}</span></div>
                <div>Account ID: <span className="font-mono">{tx.identitybankaccount?.id}</span></div>
                <div>Status: <span className="font-mono">{tx.status_txt}</span></div>
                <div>Created: <span className="font-mono">{new Date(tx.created_at * 1000).toLocaleString()}</span></div>
              </div>
            ))}
          </div>
        )}
        
        {adaptedTransactions && adaptedTransactions.length > 0 && (
          <div className="space-y-2">
            <div className="font-semibold">Adapted Transactions:</div>
            {adaptedTransactions.slice(0, 2).map((tx: any, idx: number) => (
              <div key={idx} className="p-2 bg-green-100 dark:bg-green-900 rounded">
                <div>Description: {tx.description}</div>
                <div>Type: {tx.type}</div>
                <div>Amount: {tx.amount} {tx.currency}</div>
                <div>Account: {tx.accountId}</div>
                <div>Date: {tx.date.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DebugPanel>
  );
};