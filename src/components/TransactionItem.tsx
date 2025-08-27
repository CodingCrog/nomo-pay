import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Transaction } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const { colors } = useTheme();
  
  // Check if transaction is incoming based on type
  // Deposits are type 'Funds' and should always show as incoming (+)
  // All positive amounts are incoming, negative are outgoing
  const isIncoming = transaction.type === 'Funds' || transaction.amount > 0;
  
  const getActionLabel = () => {
    if (transaction.beneficiary) {
      return `To: ${transaction.beneficiary.name}`;
    }
    return transaction.reference || transaction.description;
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:shadow-md border relative z-20"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.secondary + '40',
        minHeight: '80px',
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isIncoming ? `${colors.primary}20` : `${colors.foreground3}20`,
          }}
        >
          {isIncoming ? (
            <ArrowDownLeft 
              size={16} 
              style={{ color: colors.primary }}
            />
          ) : (
            <ArrowUpRight 
              size={16} 
              style={{ color: colors.foreground3 }}
            />
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium" style={{ color: colors.foreground1 }}>
            {transaction.description}
          </p>
          <p className="text-xs" style={{ color: colors.foreground3 }}>
            {getActionLabel()}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p 
          className="text-sm font-medium"
          style={{ 
            color: isIncoming ? colors.primary : colors.foreground1 
          }}
        >
          {isIncoming ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
        </p>
        <p className="text-xs" style={{ color: colors.foreground3 }}>
          {formatDate(transaction.date)}
        </p>
        {transaction.status !== 'completed' && (
          <span className="text-xs px-2 py-1 rounded-full" 
                style={{ 
                  backgroundColor: transaction.status === 'pending' ? '#fbbf24' : '#ef4444',
                  color: 'white'
                }}>
            {transaction.status}
          </span>
        )}
      </div>
    </div>
  );
};