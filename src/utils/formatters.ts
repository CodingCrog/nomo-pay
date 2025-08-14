import { format, isToday, isYesterday } from 'date-fns';
import { CURRENCY_SYMBOLS, CURRENCY_DECIMALS } from '../constants/currency';

export const formatCurrency = (
  amount: number,
  currencyCode: string,
  options?: Intl.NumberFormatOptions
): string => {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  const decimals = CURRENCY_DECIMALS[currencyCode] ?? 2;
  
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...options,
  });
  
  return `${symbol}${formatted}`;
};

export const formatAmount = (
  amount: number,
  decimals = 2
): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatDateHeader = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'dd MMMM yyyy');
  }
};

export const formatTransactionDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm');
};

export const formatAccountNumber = (accountNumber: string): string => {
  // Add spacing for better readability
  if (accountNumber.startsWith('GB')) {
    // Format as GB12 3456 78
    return accountNumber.replace(/(\w{2})(\d{2})(\d{4})(\d{2})/, '$1$2 $3 $4');
  }
  // Format numbered account as 001 4357
  return accountNumber.replace(/(\d{3})(\d{4})/, '$1 $2');
};