import { MOCK_EXCHANGE_RATES } from '../constants/currency';
import type { CurrencyBalance } from '../types';

export const convertToEUR = (amount: number, fromCurrency: string): number => {
  const rate = MOCK_EXCHANGE_RATES[fromCurrency] || 1;
  return amount * rate;
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  const amountInEUR = convertToEUR(amount, fromCurrency);
  const targetRate = MOCK_EXCHANGE_RATES[toCurrency] || 1;
  return amountInEUR / targetRate;
};

export const calculateTotalBalance = (balances: CurrencyBalance[]): number => {
  return balances.reduce((sum, balance) => {
    return sum + convertToEUR(balance.balance, balance.currency.code);
  }, 0);
};

export const sortBalancesByAmount = (balances: CurrencyBalance[]): CurrencyBalance[] => {
  return [...balances].sort((a, b) => {
    const aInEUR = convertToEUR(a.balance, a.currency.code);
    const bInEUR = convertToEUR(b.balance, b.currency.code);
    return bInEUR - aInEUR;
  });
};

export const filterNonZeroBalances = (balances: CurrencyBalance[]): CurrencyBalance[] => {
  return balances.filter(balance => balance.balance > 0);
};