import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Download } from 'lucide-react';
import { useTransactions, useAccounts } from '../core/api/client';
import { TransactionItem } from '../components/TransactionItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/validation';
import type { Transaction, Account } from '../types';

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  // Get all transactions from backend
  const { data: transactions, loading: transactionsLoading } = useTransactions();
  const { data: accounts } = useAccounts();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: ''
  });
  
  // Filter transactions
  const filteredTransactions = transactions.filter((tx: Transaction) => {
    // Search filter
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!tx.reference || !tx.reference.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Account filter
    if (selectedAccount !== 'all' && tx.accountId !== selectedAccount) {
      return false;
    }
    
    // Type filter
    if (selectedType !== 'all' && tx.type !== selectedType) {
      return false;
    }
    
    // Status filter
    if (selectedStatus !== 'all' && tx.status !== selectedStatus) {
      return false;
    }
    
    // Date range filter
    if (dateRange.from && new Date(tx.date) < new Date(dateRange.from)) {
      return false;
    }
    if (dateRange.to && new Date(tx.date) > new Date(dateRange.to)) {
      return false;
    }
    
    return true;
  });
  
  // Sort by date descending
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate totals
  const totalIncoming = sortedTransactions
    .filter(tx => tx.type === 'Funds' && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalOutgoing = sortedTransactions
    .filter(tx => tx.type === 'Transfer' || tx.type === 'Exchange')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  
  if (transactionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ backgroundColor: colors.background1 }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md" style={{ backgroundColor: `${colors.background2}CC` }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.text1 }} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: colors.text1 }}>All Transactions</h1>
          </div>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Download className="w-5 h-5" style={{ color: colors.text1 }} />
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                   style={{ color: colors.text2 }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: colors.background3,
                color: colors.text1,
                borderColor: colors.border
              }}
            />
          </div>
          
          {/* Filter Row */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ 
                backgroundColor: colors.background3,
                color: colors.text1,
                borderColor: colors.border
              }}
            >
              <option value="all">All Accounts</option>
              {accounts.map((acc: Account) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ 
                backgroundColor: colors.background3,
                color: colors.text1,
                borderColor: colors.border
              }}
            >
              <option value="all">All Types</option>
              <option value="Funds">Funds</option>
              <option value="Transfer">Transfer</option>
              <option value="Exchange">Exchange</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ 
                backgroundColor: colors.background3,
                color: colors.text1,
                borderColor: colors.border
              }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Statistics Bar */}
      <div className="px-4 py-3 flex justify-between items-center border-b" 
           style={{ borderColor: colors.border }}>
        <div className="text-sm">
          <span style={{ color: colors.text2 }}>Found </span>
          <span className="font-semibold" style={{ color: colors.text1 }}>
            {sortedTransactions.length}
          </span>
          <span style={{ color: colors.text2 }}> transactions</span>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div>
            <span style={{ color: colors.text2 }}>In: </span>
            <span className="font-semibold text-green-600">
              +{formatCurrency(totalIncoming, 'EUR')}
            </span>
          </div>
          <div>
            <span style={{ color: colors.text2 }}>Out: </span>
            <span className="font-semibold text-red-600">
              -{formatCurrency(totalOutgoing, 'EUR')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="px-4 py-2">
        {sortedTransactions.length > 0 ? (
          <div className="space-y-2">
            {sortedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onClick={() => {
                  // Navigate to transaction detail or handle click
                  console.log('Transaction clicked:', transaction);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-lg font-medium" style={{ color: colors.text1 }}>
              No transactions found
            </p>
            <p className="text-sm mt-2" style={{ color: colors.text2 }}>
              {searchQuery || selectedAccount !== 'all' || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Your transactions will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};