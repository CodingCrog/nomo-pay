import React from 'react';
import { TransactionItem } from '../../../components/TransactionItem';
import { formatDateHeader } from '../../../utils';
import { useTheme } from '../../../context/ThemeContext';
import type { Transaction } from '../../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onTransactionClick 
}) => {
  const { colors } = useTheme();
  
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const dateKey = transaction.orderDate ? new Date(transaction.orderDate).toISOString().split('T')[0] : 'unknown';
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
  
  if (Object.entries(groupedTransactions).length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: colors.foreground3 }}>
          No transactions found
        </p>
      </div>
    );
  }
  
  return (
    <div className="px-4 pb-4 relative z-10">
      {Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
        <div key={dateKey} className="mb-6">
          <h2 
            className="text-xs font-medium mb-3 px-1"
            style={{ color: colors.foreground3 }}
          >
            {formatDateHeader(dayTransactions[0].orderDate ? new Date(dayTransactions[0].orderDate) : new Date())}
          </h2>
          <div className="space-y-2">
            {dayTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onClick={() => onTransactionClick?.(transaction)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};