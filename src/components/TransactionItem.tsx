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
  const isIncoming = transaction.amount > 0;
  
  const getActionLabel = () => {
    if (transaction.action === 'Claim' && transaction.recipient) {
      return `Interagiert mit: ${transaction.recipient}`;
    }
    return transaction.remarks || transaction.action;
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
            {transaction.action.toLowerCase()}
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
          {isIncoming ? '+' : ''}{transaction.amount.toFixed(2)} {transaction.currency}
        </p>
        {transaction.orderStatus !== 'Completed' && (
          <p className="text-xs" style={{ color: colors.foreground3 }}>
            {transaction.orderStatus}
          </p>
        )}
      </div>
    </div>
  );
};