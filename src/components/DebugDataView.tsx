import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDataContext } from '../context/DataProvider';
import { useIdentity } from '../hooks/useIdentity';
import { useAccounts, useBalances, useTransactions, useCurrencies, useBeneficiaries } from '../hooks/useApiData';
import { useNomoConnected } from '../../node_modules/nsw-frontend-core-lib/dist/index.js';

export const DebugDataView: React.FC = () => {
  const { colors } = useTheme();
  const { isConnected } = useDataContext();
  const isNomoConnected = useNomoConnected();
  
  // Load all data
  const { data: identity } = useIdentity();
  const { data: accounts } = useAccounts();
  const { data: balances } = useBalances();
  const { data: transactions } = useTransactions();
  const { data: currencies } = useCurrencies();
  const { data: beneficiaries } = useBeneficiaries();
  
  // Only show in debug mode
  if (!import.meta.env.VITE_FORCE_DEBUG) {
    return null;
  }
  
  return (
    <div className="fixed bottom-20 right-4 max-w-md max-h-96 overflow-auto z-50">
      <div 
        className="rounded-lg p-4 shadow-xl"
        style={{ backgroundColor: colors.background2 }}
      >
        <h3 className="font-bold mb-2" style={{ color: colors.text1 }}>
          Debug Data View
        </h3>
        
        <div className="space-y-2 text-xs">
          <div>
            <span style={{ color: colors.text2 }}>Backend Connected: </span>
            <span style={{ color: isConnected ? '#10b981' : '#ef4444' }}>
              {isConnected ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div>
            <span style={{ color: colors.text2 }}>Nomo Connected: </span>
            <span style={{ color: isNomoConnected ? '#10b981' : '#ef4444' }}>
              {isNomoConnected ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="border-t pt-2" style={{ borderColor: colors.text2 + '20' }}>
            <div style={{ color: colors.text2 }}>Data Loaded:</div>
            <ul className="ml-2 space-y-1">
              <li style={{ color: identity ? '#10b981' : '#ef4444' }}>
                ✓ Identity: {identity ? `${identity.firstname} ${identity.lastname}` : 'Not loaded'}
              </li>
              <li style={{ color: accounts.length > 0 ? '#10b981' : '#ef4444' }}>
                ✓ Accounts: {accounts.length} loaded
              </li>
              <li style={{ color: balances.length > 0 ? '#10b981' : '#ef4444' }}>
                ✓ Balances: {balances.length} loaded
              </li>
              <li style={{ color: transactions.length > 0 ? '#10b981' : '#ef4444' }}>
                ✓ Transactions: {transactions.length} loaded
              </li>
              <li style={{ color: currencies.length > 0 ? '#10b981' : '#ef4444' }}>
                ✓ Currencies: {currencies.length} loaded
              </li>
              <li style={{ color: beneficiaries.length > 0 ? '#10b981' : '#ef4444' }}>
                ✓ Beneficiaries: {beneficiaries.length} loaded
              </li>
            </ul>
          </div>
          
          <details className="border-t pt-2" style={{ borderColor: colors.text2 + '20' }}>
            <summary style={{ color: colors.text2, cursor: 'pointer' }}>
              Raw Data (click to expand)
            </summary>
            <pre className="mt-2 text-xs overflow-auto" style={{ color: colors.text1 }}>
              {JSON.stringify({
                identity: identity ? { 
                  name: `${identity.firstname} ${identity.lastname}`,
                  email: identity.email 
                } : null,
                accounts: accounts.map((acc: any) => ({
                  id: acc.id,
                  name: acc.accountName,
                  type: acc.type
                })),
                balances: balances.slice(0, 3).map((bal: any) => ({
                  currency: bal.currency,
                  amount: bal.amount
                })),
                transactionCount: transactions.length,
                currencyCount: currencies.length,
                beneficiaryCount: beneficiaries.length
              }, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};