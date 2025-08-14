import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CurrencyBalance as CurrencyBalanceType } from '../types';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CurrencyBalanceProps {
  balance: CurrencyBalanceType;
  onClick?: () => void;
  location?: 'london' | 'singapore';
}

const currencyFlags: Record<string, string> = {
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  USD: '🇺🇸',
  CHF: '🇨🇭',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  SGD: '🇸🇬',
  HKD: '🇭🇰',
};

export const CurrencyBalance: React.FC<CurrencyBalanceProps> = ({ balance, onClick, location }) => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  
  const formatBalance = (amount: number, decimal: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });
  };

  const isZeroBalance = balance.balance === 0;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/accounts/${balance.accountId}/transactions/${balance.currency.code}`, {
        state: { accountName: balance.currency.name }
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-3 rounded-xl border transition-all duration-300 ease-out cursor-pointer hover:shadow-lg"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.secondary + '30',
        opacity: isZeroBalance ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary + '80';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.secondary + '30';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-xl">
            {location === 'london' ? '🇬🇧' : location === 'singapore' ? '🇸🇬' : (currencyFlags[balance.currency.code] || '💱')}
          </div>
          <div>
            <h4 className="font-medium text-base" style={{ color: colors.foreground1 }}>
              {balance.currency.name}
            </h4>
            <p className="text-sm" style={{ color: colors.foreground3 }}>
              {balance.currency.code}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="font-medium text-lg" style={{ color: colors.foreground1 }}>
              {balance.currency.symbol}{formatBalance(balance.balance, balance.currency.decimal)}
            </p>
            {balance.pending > 0 && (
              <p className="text-xs" style={{ color: colors.primary }}>
                {balance.currency.symbol}{formatBalance(balance.pending, balance.currency.decimal)} pending
              </p>
            )}
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: colors.foreground3 }} />
        </div>
      </div>
    </div>
  );
};