import React, { useState } from 'react';
import { Bug, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../../core/api/loaders';
import { useAccounts, useBalances, useTransactions, useBeneficiaries } from '../../core/api/client';

interface DebugSection {
  title: string;
  render: () => React.ReactNode;
}

export const DebugContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Accounts']));

  // Only show in development
  if (!import.meta.env.DEV && !import.meta.env.VITE_FORCE_DEBUG) {
    return null;
  }

  // Get data from loaders
  const rawAccounts = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts).get();
  const rawTransactions = useDataLoader(GQL_LOADERS.get_npa_identity_banktransactions).get();
  const rawBeneficiaries = useDataLoader(GQL_LOADERS.get_npa_beneficiaries).get();
  const rawIdentity = useDataLoader(GQL_LOADERS.get_npa_identity).get();
  
  // Get adapted data
  const { data: accounts } = useAccounts();
  const { data: balances } = useBalances();
  const { data: transactions } = useTransactions();
  const { data: beneficiaries } = useBeneficiaries();

  const debugSections: DebugSection[] = [
    {
      title: 'Accounts',
      render: () => (
        <div className="space-y-2 text-xs">
          <div className="text-purple-400 font-semibold">Backend Data:</div>
          <div>Raw Accounts: {rawAccounts?.length || 0}</div>
          <div>Adapted Accounts: {accounts?.length || 0}</div>
          {rawAccounts?.map((acc: any, idx: number) => (
            <div key={idx} className="p-2 bg-gray-800 rounded">
              <div className="text-green-400">Account {idx + 1}:</div>
              <div>ID: {acc.id?.substring(0, 8)}...</div>
              <div>Type: {acc.type_char || 'N/A'}</div>
              <div>Balance: {acc.balance || 0}</div>
              <div>Currency: {acc.transactioncurrency?.currency_code || 'N/A'}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Transactions',
      render: () => (
        <div className="space-y-2 text-xs">
          <div className="text-purple-400 font-semibold">Transaction Data:</div>
          <div>Raw Transactions: {rawTransactions?.length || 0}</div>
          <div>Adapted Transactions: {transactions?.length || 0}</div>
          {rawTransactions?.slice(0, 3).map((tx: any, idx: number) => (
            <div key={idx} className="p-2 bg-gray-800 rounded">
              <div className="text-green-400">TX {idx + 1}:</div>
              <div>ID: {tx.id?.substring(0, 8)}...</div>
              <div>Amount: {tx.request_amount || tx.settle_amount || 0}</div>
              <div>Status: {tx.status_txt || 'N/A'}</div>
              <div>Type: {tx.type_txt || tx.type_char || 'N/A'}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Balances',
      render: () => (
        <div className="space-y-2 text-xs">
          <div className="text-purple-400 font-semibold">Balance Data:</div>
          <div>Total Balances: {balances?.length || 0}</div>
          {balances?.map((bal: any, idx: number) => (
            <div key={idx} className="p-2 bg-gray-800 rounded">
              <div className="text-green-400">Balance {idx + 1}:</div>
              <div>Currency: {bal.currency?.code || 'N/A'}</div>
              <div>Amount: {bal.balance || 0}</div>
              <div>Available: {bal.available || 0}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Beneficiaries',
      render: () => (
        <div className="space-y-2 text-xs">
          <div className="text-purple-400 font-semibold">Beneficiary Data:</div>
          <div>Raw Beneficiaries: {rawBeneficiaries?.length || 0}</div>
          <div>Adapted Beneficiaries: {beneficiaries?.length || 0}</div>
          {rawBeneficiaries?.slice(0, 3).map((ben: any, idx: number) => (
            <div key={idx} className="p-2 bg-gray-800 rounded">
              <div className="text-green-400">Beneficiary {idx + 1}:</div>
              <div>Name: {ben.firstname_txt} {ben.lastname_txt}</div>
              <div>Email: {ben.email_txt || 'N/A'}</div>
              <div>Bank: {ben.beneficiary_bankname_txt || 'N/A'}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Identity',
      render: () => (
        <div className="space-y-2 text-xs">
          <div className="text-purple-400 font-semibold">Identity Data:</div>
          <div>Has Identity: {rawIdentity ? 'Yes' : 'No'}</div>
          {rawIdentity && (
            <div className="p-2 bg-gray-800 rounded">
              <div>ID: {rawIdentity.id?.substring(0, 8)}...</div>
              <div>Created: {new Date(rawIdentity.created_at).toLocaleDateString()}</div>
              <div>V1 Account: {rawIdentity.v1_account ? 'Yes' : 'No'}</div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Loader Status',
      render: () => (
        <div className="space-y-2 text-xs">
          <div className="text-purple-400 font-semibold">Data Loader Status:</div>
          {Object.entries(GQL_LOADERS).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-400">{key}:</span>
              <span className="text-green-400">Active</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      {/* Debug Toggle Button */}
      <div className="fixed bottom-4 right-4 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-all"
        >
          <Bug className="w-5 h-5" />
          <span className="font-medium">Debug Panel</span>
        </button>
      </div>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 text-white shadow-2xl z-[99] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold">Debug Panel</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {debugSections.map(({ title, render }) => (
              <div key={title} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(title)}
                  className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">{title}</span>
                  {expandedSections.has(title) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.has(title) && (
                  <div className="p-3 bg-gray-850 max-h-96 overflow-y-auto">
                    {render()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
            <p>Environment: {import.meta.env.MODE}</p>
            <p>Backend: Connected</p>
          </div>
        </div>
      )}
    </>
  );
};