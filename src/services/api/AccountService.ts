import { ApiClient } from '../../api/client';
import type { Account, CurrencyBalance } from '../../types';

export class AccountService {
  /**
   * Fetch all accounts
   */
  static async getAccounts(): Promise<Account[]> {
    return ApiClient.getAccounts();
  }

  /**
   * Fetch account by ID
   */
  static async getAccountById(accountId: string): Promise<Account | null> {
    const accounts = await this.getAccounts();
    return accounts.find(acc => acc.id === accountId) || null;
  }

  /**
   * Get account balances
   */
  static async getAccountBalances(accountId: string): Promise<CurrencyBalance[]> {
    return ApiClient.getBalances(accountId);
  }

  /**
   * Get non-zero balances for an account
   */
  static async getActiveBalances(accountId: string): Promise<CurrencyBalance[]> {
    const balances = await this.getAccountBalances(accountId);
    return balances.filter(balance => balance.balance > 0);
  }

  /**
   * Get account by type
   */
  static async getAccountByType(type: 'gb_based' | 'numbered'): Promise<Account | null> {
    const accounts = await this.getAccounts();
    return accounts.find(acc => acc.type === type) || null;
  }

  /**
   * Calculate total account value in specified currency
   */
  static calculateAccountValue(
    balances: CurrencyBalance[]
  ): number {
    // This would use the CurrencyService in a real implementation
    // For now, just sum up the balances
    return balances.reduce((sum, balance) => sum + balance.balance, 0);
  }
}