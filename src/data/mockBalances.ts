import type { CurrencyBalance } from '../types';
import { mockCurrencies } from './mockCurrencies';

export const mockCurrencyBalances: CurrencyBalance[] = [
  // GB Based Account balances
  {
    id: 'gb-1',
    accountId: '1',
    currency: mockCurrencies.find(c => c.code === 'GBP')!,
    balance: 1052.33,
    available: 1052.33,
    pending: 0,
  },
  {
    id: 'gb-2',
    accountId: '1',
    currency: mockCurrencies.find(c => c.code === 'EUR')!,
    balance: 212.14,
    available: 212.14,
    pending: 0,
  },
  // Numbered Account balances
  {
    id: '1',
    accountId: '2',
    currency: mockCurrencies.find(c => c.code === 'EUR')!,
    balance: 1165.15,
    available: 1165.15,
    pending: 0,
  },
  {
    id: '2',
    accountId: '2',
    currency: mockCurrencies.find(c => c.code === 'GBP')!,
    balance: 0,
    available: 0,
    pending: 0,
  },
  {
    id: '3',
    accountId: '2',
    currency: mockCurrencies.find(c => c.code === 'USD')!,
    balance: 588.74,
    available: 588.74,
    pending: 0,
  },
  {
    id: '4',
    accountId: '2',
    currency: mockCurrencies.find(c => c.code === 'AUD')!,
    balance: 0,
    available: 0,
    pending: 0,
  },
  {
    id: '5',
    accountId: '2',
    currency: mockCurrencies.find(c => c.code === 'CAD')!,
    balance: 0,
    available: 0,
    pending: 0,
  },
  {
    id: '6',
    accountId: '2',
    currency: mockCurrencies.find(c => c.code === 'SGD')!,
    balance: 0,
    available: 0,
    pending: 0,
  },
  {
    id: '7',
    accountId: '2',
    currency: mockCurrencies.find(c => c.code === 'HKD')!,
    balance: 0,
    available: 0,
    pending: 0,
  },
];