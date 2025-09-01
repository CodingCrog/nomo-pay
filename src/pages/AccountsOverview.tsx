import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CurrencyBalance } from '../components/CurrencyBalance';
import { ActionButton } from '../components/ActionButton';
import { TransactionItem } from '../components/TransactionItem';
import { useAccounts, useBalances, useTransactions } from '../core/api/client';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  UserPlus,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import type { Account, Transaction } from '../types';
import type { CurrencyBalance as CurrencyBalanceType } from '../types/currency';

export const AccountsOverview: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const [showOtherWallets, setShowOtherWallets] = useState(false);

  // Get all accounts first to get a valid default ID
  const { data: allAccounts } = useAccounts();
  const defaultAccountId = allAccounts[0]?.id || '';
  const currentAccountId = accountId || defaultAccountId;
  
  // Use real data from backend
  const account = allAccounts.find((acc: Account) => acc.id === currentAccountId);
  const { data: balances } = useBalances(currentAccountId);
  const { data: realTransactions, loading: transactionsLoading } = useTransactions(currentAccountId);
  
  // Debug logging
  console.log('AccountsOverview Debug:');
  console.log('- Current Account ID:', currentAccountId);
  console.log('- Account:', account);
  console.log('- Balances:', balances);
  console.log('- Transactions for this account:', realTransactions);
  console.log('- Number of transactions:', realTransactions?.length);
  
  const mainBalances = balances.slice(0, 3);
  const otherBalances = balances.slice(3);

  const totalInEUR = balances.reduce((sum: number, bal: CurrencyBalanceType) => {
    const rate = bal.currency.code === 'EUR' ? 1 : 
                 bal.currency.code === 'USD' ? 0.92 : 
                 bal.currency.code === 'GBP' ? 1.16 : 1;
    return sum + (bal.balance * rate);
  }, 0);

  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <div className="min-h-screen relative z-10">
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{account.name}</h1>
          <p className="text-white/80 text-sm mb-6">~ {totalInEUR.toFixed(2)} EUR</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Accounts Overview
          </h2>
          
          <div className="space-y-3 mb-4">
            {mainBalances.map((balance: CurrencyBalanceType) => (
              <CurrencyBalance
                key={balance.id}
                balance={balance}
                onClick={() => navigate(`/accounts/${accountId}/transactions/${balance.currency.code}`, {
                  state: { accountName: account.name }
                })}
              />
            ))}
          </div>

          {otherBalances.length > 0 && (
            <>
              <button
                onClick={() => setShowOtherWallets(!showOtherWallets)}
                className="w-full text-left text-purple-600 dark:text-purple-400 font-medium mb-3 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Other wallets {showOtherWallets ? '▼' : '▶'}
              </button>
              
              {showOtherWallets && (
                <div className="space-y-3">
                  {otherBalances.map((balance: CurrencyBalanceType) => (
                    <CurrencyBalance
                      key={balance.id}
                      balance={balance}
                      onClick={() => navigate(`/accounts/${accountId}/transactions/${balance.currency.code}`, {
                        state: { accountName: account.name }
                      })}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actions
          </h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ActionButton
              icon={ArrowDownLeft}
              label="Deposit"
              onClick={() => navigate('/deposit')}
              variant="primary"
            />
            <ActionButton
              icon={ArrowUpRight}
              label="Transfer"
              onClick={() => navigate('/transfer')}
              variant="secondary"
            />
            <ActionButton
              icon={ArrowUpRight}
              label="Withdraw"
              onClick={() => navigate('/withdraw')}
              variant="outline"
            />
            <ActionButton
              icon={UserPlus}
              label="Beneficiary List"
              onClick={() => navigate('/beneficiaries')}
              variant="outline"
            />
          </div>
          
          <ActionButton
            icon={RefreshCw}
            label="Exchange"
            onClick={() => navigate('/exchange')}
            variant="outline"
            className="w-full"
          />
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <button
              onClick={() => navigate(`/accounts/${accountId}/transactions/EUR`)}
              className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <span className="text-sm">View All</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-2">
            {transactionsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : realTransactions.length > 0 ? (
              realTransactions
                .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((transaction: Transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => console.log('Transaction clicked:', transaction)}
                  />
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};