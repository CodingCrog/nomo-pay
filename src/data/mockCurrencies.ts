import type { CurrencyInfo } from '../types';

export const mockCurrencies: CurrencyInfo[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', decimal: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimal: 2 },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimal: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', decimal: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimal: 0 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimal: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimal: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimal: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimal: 2 },
];