import { ApiClient } from '../../core/api/client';
import type { Transaction } from '../../types';

export class TransactionService {
  /**
   * Fetch all transactions
   */
  static async getTransactions(): Promise<Transaction[]> {
    return ApiClient.getTransactions();
  }

  /**
   * Fetch transactions by account ID
   */
  static async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    const transactions = await ApiClient.getTransactions(accountId);
    return transactions.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  /**
   * Fetch transactions by account and currency
   */
  static async getTransactionsByCurrency(
    accountId: string, 
    currencyCode: string
  ): Promise<Transaction[]> {
    const transactions = await ApiClient.getTransactions(accountId);
    return transactions
      .filter(t => t.currency === currencyCode)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  /**
   * Get recent transactions with limit
   */
  static async getRecentTransactions(
    accountId: string, 
    limit: number = 5
  ): Promise<Transaction[]> {
    const transactions = await this.getAccountTransactions(accountId);
    return transactions.slice(0, limit);
  }

  /**
   * Get transactions by date range
   */
  static async getTransactionsByDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const transactions = await this.getAccountTransactions(accountId);
    return transactions.filter(t => {
      const transactionDate = new Date(t.orderDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  /**
   * Get transaction statistics
   */
  static async getTransactionStats(accountId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;
  }> {
    const transactions = await this.getAccountTransactions(accountId);
    
    const stats = transactions.reduce((acc, t) => {
      if (t.amount > 0) {
        acc.totalIncome += t.amount;
      } else {
        acc.totalExpenses += Math.abs(t.amount);
      }
      acc.transactionCount++;
      return acc;
    }, { totalIncome: 0, totalExpenses: 0, transactionCount: 0 });
    
    return stats;
  }
}