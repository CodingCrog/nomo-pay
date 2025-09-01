import { 
  useAccounts as useAccountsApi, 
  useBalances as useBalancesApi, 
  useTransactions as useTransactionsApi,
  useCurrencies as useCurrenciesApi,
  useBeneficiaries as useBeneficiariesApi
} from '../core/api/client';
import type { Account } from '../types';

// Re-export the API hooks with a more convenient interface
export function useAccounts() {
  return useAccountsApi();
}

export function useBalances(accountId?: string) {
  return useBalancesApi(accountId);
}

export function useTransactions(accountId?: string) {
  return useTransactionsApi(accountId);
}

export function useCurrencies() {
  return useCurrenciesApi();
}

export function useBeneficiaries() {
  return useBeneficiariesApi();
}

// Combined hook for account with its balances
export function useAccountWithBalances(accountId: string) {
  const { data: accounts, loading: accountsLoading } = useAccounts();
  const { data: balances, loading: balancesLoading } = useBalances(accountId);
  
  const account = accounts.find((acc: Account) => acc.id === accountId);
  
  return {
    account,
    balances,
    loading: accountsLoading || balancesLoading,
    error: null
  };
}

// Hook for dashboard summary data
export function useDashboardData() {
  const { data: accounts, loading: accountsLoading } = useAccounts();
  const { data: balances, loading: balancesLoading } = useBalances();
  const { data: transactions, loading: transactionsLoading } = useTransactions();
  
  return {
    accounts,
    balances,
    recentTransactions: transactions.slice(0, 5),
    loading: accountsLoading || balancesLoading || transactionsLoading,
    error: null
  };
}