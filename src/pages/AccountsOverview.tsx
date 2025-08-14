import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CurrencyBalance } from '../components/CurrencyBalance';
import { ActionButton } from '../components/ActionButton';
import { TransactionItem } from '../components/TransactionItem';
import { mockAccounts, mockCurrencyBalances, mockTransactions } from '../data/mockData';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  UserPlus,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';

export const AccountsOverview: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const [showOtherWallets, setShowOtherWallets] = useState(false);

  const account = mockAccounts.find(acc => acc.id === (accountId || '2'));
  const balances = mockCurrencyBalances.filter(bal => bal.accountId === (accountId || '2'));
  
  const mainBalances = balances.slice(0, 3);
  const otherBalances = balances.slice(3);

  const totalInEUR = balances.reduce((sum, bal) => {
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
            {mainBalances.map((balance) => (
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
                  {otherBalances.map((balance) => (
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
            {mockTransactions
              .filter(t => t.accountId === (accountId || '2'))
              .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
              .slice(0, 5)
              .map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => console.log('Transaction clicked:', transaction)}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};