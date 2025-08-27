import React, { useState } from 'react';
import { coreLibQuery } from 'nsw-frontend-core-lib';
import { 
  getNpaIdentity,
  getNpaIdentityBankAccounts,
  getNpaIdentityBankTransactions,
  getNpaTransactionCurrencies,
  getNpaBeneficiaries
} from '../api/queries';
import { DebugPanel } from './debug/DebugPanel';

export const QueryTester: React.FC = () => {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);
  
  const queries = [
    { name: 'Identity', query: getNpaIdentity },
    { name: 'Bank Accounts', query: getNpaIdentityBankAccounts },
    { name: 'Transactions', query: getNpaIdentityBankTransactions },
    { name: 'Currencies', query: getNpaTransactionCurrencies },
    { name: 'Beneficiaries', query: getNpaBeneficiaries }
  ];
  
  const testQuery = async (name: string, query: any) => {
    setLoading(name);
    try {
      const result = await coreLibQuery({
        query,
        variables: {}
      });
      setResults(prev => ({
        ...prev,
        [name]: { success: true, data: result }
      }));
      console.log(`✅ ${name} query success:`, result);
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [name]: { success: false, error: error.message }
      }));
      console.error(`❌ ${name} query failed:`, error);
    } finally {
      setLoading(null);
    }
  };
  
  const testAllQueries = async () => {
    for (const { name, query } of queries) {
      await testQuery(name, query);
    }
  };
  
  return (
    <DebugPanel title="Query Tester" position="bottom-right" defaultCollapsed={true}>
      
      <button
        onClick={testAllQueries}
        disabled={loading !== null}
        className="mb-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
      >
        Test All Queries
      </button>
      
      <div className="space-y-2">
        {queries.map(({ name }) => (
          <div key={name} className="text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium">{name}:</span>
              {loading === name ? (
                <span className="text-yellow-500">Testing...</span>
              ) : results[name] ? (
                <span className={results[name].success ? 'text-green-500' : 'text-red-500'}>
                  {results[name].success ? '✅ Success' : '❌ Failed'}
                </span>
              ) : (
                <span className="text-gray-400">Not tested</span>
              )}
            </div>
            {results[name]?.error && (
              <div className="mt-1 p-2 bg-red-100 text-red-700 rounded text-xs">
                {results[name].error}
              </div>
            )}
          </div>
        ))}
      </div>
    </DebugPanel>
  );
};