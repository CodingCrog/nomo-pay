import type { Account } from '../types';
import { mockCurrencies } from './mockCurrencies';

const generateChartData = () => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseValue = Math.random() * 10000 + 5000;
  const values = labels.map((_, i) => {
    const variation = (Math.random() - 0.5) * 1000;
    return Math.round(baseValue + variation + (i * 100));
  });
  return { labels, values };
};

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'GB Based Account',
    accountNumber: 'GB12345678',
    type: 'gb_based',
    balance: 1264.47,
    currency: 'EUR',
    availableCurrencies: mockCurrencies.filter(c => ['EUR', 'GBP'].includes(c.code)).map(c => ({ ...c, balance: 0 })),
    chartData: generateChartData(),
    lastUpdated: new Date(),
    status: 'active',
  },
  {
    id: '2',
    name: 'Numbered Account',
    accountNumber: '0014357',
    type: 'numbered',
    balance: 1680.24,
    currency: 'EUR',
    availableCurrencies: mockCurrencies.map(c => ({ ...c, balance: 0 })),
    chartData: generateChartData(),
    lastUpdated: new Date(),
    status: 'active',
  },
];