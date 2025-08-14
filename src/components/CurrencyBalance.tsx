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

const CURRENCY_FLAGS: Record<string, string> = {
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
  const navigate = useNavigate();
  const { colors } = useTheme();
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

  // Get currency flag (main icon)
  const currencyFlag = CURRENCY_FLAGS[balance.currency.code] || '💱';
  
  // Get account location flag (badge)
  const locationFlag = location === 'london' ? '🇬🇧' : 
                      location === 'singapore' ? '🇸🇬' : null;

  // Format the balance amount
  const formattedBalance = `${balance.currency.symbol}${balance.balance.toFixed(2)}`;

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:shadow-md border relative z-20"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.secondary + '40',
        minHeight: '80px',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${colors.primary}20`,
            }}
          >
            <span style={{ fontSize: '16px' }}>{currencyFlag}</span>
          </div>
          {locationFlag && (
            <span 
              className="absolute -bottom-1 -right-1"
              style={{ fontSize: '10px' }}
            >
              {locationFlag}
            </span>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium" style={{ color: colors.foreground1 }}>
            {balance.currency.name}
          </p>
          <p className="text-xs" style={{ color: colors.foreground3 }}>
            {balance.currency.code}
          </p>
        </div>
      </div>
      
      <div className="text-right flex items-center gap-2">
        <div>
          <p 
            className="text-sm font-medium"
            style={{ 
              color: isZeroBalance ? colors.foreground3 : colors.foreground1 
            }}
          >
            {formattedBalance}
          </p>
          {isZeroBalance && (
            <p className="text-xs" style={{ color: colors.foreground3 }}>
              No balance
            </p>
          )}
        </div>
        <ChevronRight 
          size={16}
          style={{ color: colors.foreground3 }}
        />
      </div>
    </div>
  );
};