import { MOCK_EXCHANGE_RATES } from '../../constants';
import type { CurrencyBalance } from '../../types';

export class CurrencyService {
  /**
   * Convert amount to EUR
   */
  static toEUR(amount: number, fromCurrency: string): number {
    // Still use mock rates for now, but could be fetched from API
    const rate = MOCK_EXCHANGE_RATES[fromCurrency] || 1;
    return amount * rate;
  }

  /**
   * Convert between any two currencies
   */
  static convert(amount: number, fromCurrency: string, toCurrency: string): number {
    const amountInEUR = this.toEUR(amount, fromCurrency);
    const targetRate = MOCK_EXCHANGE_RATES[toCurrency] || 1;
    return amountInEUR / targetRate;
  }

  /**
   * Calculate total balance in EUR from multiple currency balances
   */
  static calculateTotalBalance(balances: CurrencyBalance[]): number {
    return balances.reduce((sum, balance) => {
      return sum + this.toEUR(balance.balance, balance.currency.code);
    }, 0);
  }

  /**
   * Get exchange rate between two currencies
   */
  static getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1;
    
    const fromRate = MOCK_EXCHANGE_RATES[fromCurrency] || 1;
    const toRate = MOCK_EXCHANGE_RATES[toCurrency] || 1;
    
    return fromRate / toRate;
  }

  /**
   * Format exchange rate for display
   */
  static formatExchangeRate(fromCurrency: string, toCurrency: string): string {
    const rate = this.getExchangeRate(fromCurrency, toCurrency);
    return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  }
}