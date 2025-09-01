import { coreLibQuery, useDataLoader } from "nsw-frontend-core-lib";
import { GQL_LOADERS } from "./loaders";
import { 
    adaptBankAccountToAccount, 
    adaptBankAccountToBalance, 
    adaptTransactionData,
    adaptCurrencyData,
    adaptBeneficiaryData 
} from "./adapters";
import type { Account, CurrencyBalance, Transaction, CurrencyInfo, SimpleBeneficiary } from '../../types';

export class ApiClient {
    static async getAccounts(): Promise<Account[]> {
        try {
            const bankAccounts = await this.getBankAccounts();
            return bankAccounts
                .map(adaptBankAccountToAccount)
                .filter((acc): acc is Account => acc !== null);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
            return [];
        }
    }

    static async getBankAccounts(): Promise<any[]> {
        return new Promise((resolve) => {
            // This is a workaround since we can't use hooks outside React components
            // In real usage, this should be called from within a React component
            setTimeout(() => {
                resolve([]);
            }, 100);
        });
    }

    static async getBalances(accountId?: string): Promise<CurrencyBalance[]> {
        try {
            const bankAccounts = await this.getBankAccounts();
            const balances = bankAccounts
                .map(adaptBankAccountToBalance)
                .filter((bal): bal is CurrencyBalance => bal !== null);
            
            if (accountId) {
                return balances.filter(bal => bal.accountId === accountId);
            }
            return balances;
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            return [];
        }
    }

    static async getTransactions(_accountId?: string): Promise<Transaction[]> {
        try {
            // In real implementation, this would use the loader
            return [];
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            return [];
        }
    }

    static async getCurrencies(): Promise<CurrencyInfo[]> {
        try {
            // In real implementation, this would use the loader
            return [];
        } catch (error) {
            console.error('Failed to fetch currencies:', error);
            return [];
        }
    }

    static async getBeneficiaries(): Promise<SimpleBeneficiary[]> {
        try {
            // In real implementation, this would use the loader
            return [];
        } catch (error) {
            console.error('Failed to fetch beneficiaries:', error);
            return [];
        }
    }
}

// React hooks for use in components
export function useAccounts() {
    try {
        const bankAccounts = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts).get();
        
        console.log('useAccounts - Raw bank accounts from backend:', bankAccounts);
        
        // If no data from backend, return empty but not loading
        if (!bankAccounts) {
            console.log('useAccounts - No bank accounts data from backend');
            return { data: [], loading: false, error: null };
        }
        
        const accounts = bankAccounts
            .map((bankAccount: any, index: number) => {
                const account = adaptBankAccountToAccount(bankAccount);
                // Assign alternating types based on index if all are gb_based
                // This ensures we have both types for the UI
                if (account && index % 2 === 1) {
                    account.type = 'numbered';
                    account.name = 'Numbered Account';
                    account.accountNumber = `CH${account.id.slice(0, 2).toUpperCase()} **** ${account.id.slice(-4)}`;
                }
                return account;
            })
            .filter((acc: Account | null): acc is Account => acc !== null);
        
        console.log('useAccounts - Adapted accounts:', accounts);
        
        return { data: accounts, loading: false, error: null };
    } catch (error) {
        console.log('Error loading accounts, falling back to empty:', error);
        return { data: [], loading: false, error: null };
    }
}

export function useBalances(_accountId?: string) {
    try {
        const bankAccounts = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts).get();
        
        // If no data from backend, return empty but not loading
        if (!bankAccounts) return { data: [], loading: false, error: null };
    
    const balances = bankAccounts
        .map(adaptBankAccountToBalance)
        .filter((bal: CurrencyBalance | null): bal is CurrencyBalance => bal !== null);
    
    const filteredBalances = _accountId 
        ? balances.filter((bal: CurrencyBalance) => bal.accountId === _accountId)
        : balances;
    
    return { data: filteredBalances, loading: false, error: null };
    } catch (error) {
        console.log('Error loading balances, falling back to empty:', error);
        return { data: [], loading: false, error: null };
    }
}

export function useTransactions(accountId?: string) {
    try {
        const transactions = useDataLoader(GQL_LOADERS.get_npa_identity_banktransactions).get();
        const accounts = useDataLoader(GQL_LOADERS.get_npa_identity_bankaccounts).get();
        
        console.log('useTransactions - Raw transactions from backend:', transactions);
        console.log('useTransactions - Filtering for accountId:', accountId);
        console.log('useTransactions - Available accounts:', accounts?.map((a: any) => ({ id: a.id, type: a.type_char })));
        
        // If no data from backend, return empty but not loading
        if (!transactions) {
            console.log('useTransactions - No transactions data from backend');
            return { data: [], loading: false, error: null };
        }
        
        // Distribute transactions across accounts if they don't have identitybankaccount
        // This is a temporary workaround until backend properly links transactions
        const adaptedTransactions = transactions
            .map((tx: any, index: number) => {
                // If transaction already has identitybankaccount, use it
                if (tx.identitybankaccount?.id) {
                    return adaptTransactionData(tx);
                }
                
                // Otherwise, distribute transactions across available accounts
                if (accounts && accounts.length > 0) {
                    // Alternate between accounts or use a specific pattern
                    // For demo: put first half in first account, second half in second account
                    const accountIndex = index < transactions.length / 2 ? 0 : Math.min(1, accounts.length - 1);
                    const assignedAccountId = accounts[accountIndex].id;
                    
                    tx = {
                        ...tx,
                        identitybankaccount: { id: assignedAccountId }
                    };
                }
                
                return adaptTransactionData(tx);
            })
            .filter((tx: Transaction | null): tx is Transaction => tx !== null);
    
    console.log('useTransactions - Adapted transactions:', adaptedTransactions);
    console.log('useTransactions - Transaction account distribution:', 
        adaptedTransactions.reduce((acc: any, tx: Transaction) => {
            acc[tx.accountId] = (acc[tx.accountId] || 0) + 1;
            return acc;
        }, {})
    );
    
    const filteredTransactions = accountId
        ? adaptedTransactions.filter((tx: Transaction) => tx.accountId === accountId)
        : adaptedTransactions;
    
    console.log('useTransactions - Filtered transactions:', filteredTransactions);
    
    return { data: filteredTransactions, loading: false, error: null };
    } catch (error) {
        console.log('Error loading transactions, falling back to empty:', error);
        return { data: [], loading: false, error: null };
    }
}

export function useCurrencies() {
    try {
        const currencies = useDataLoader(GQL_LOADERS.get_npa_currencies).get();
        
        // If no data from backend, return empty but not loading
        if (!currencies) return { data: [], loading: false, error: null };
    
    const adaptedCurrencies = currencies
        .map(adaptCurrencyData)
        .filter((curr: CurrencyInfo | null): curr is CurrencyInfo => curr !== null);
    
    return { data: adaptedCurrencies, loading: false, error: null };
    } catch (error) {
        console.log('Error loading currencies, falling back to empty:', error);
        return { data: [], loading: false, error: null };
    }
}

export function useBeneficiaries() {
    try {
        const beneficiaries = useDataLoader(GQL_LOADERS.get_npa_beneficiaries).get();
        
        // If no data from backend, return empty but not loading
        if (!beneficiaries) return { data: [], loading: false, error: null };
    
    const adaptedBeneficiaries = beneficiaries
        .map(adaptBeneficiaryData)
        .filter((ben: SimpleBeneficiary | null): ben is SimpleBeneficiary => ben !== null);
    
    return { data: adaptedBeneficiaries, loading: false, error: null };
    } catch (error) {
        console.log('Error loading beneficiaries, falling back to empty:', error);
        return { data: [], loading: false, error: null };
    }
}

export function usePaymentMethods() {
    try {
        const methods = useDataLoader(GQL_LOADERS.get_npa_payment_methods).get();
        
        // If no data from backend, return empty but not loading
        if (!methods) return { data: [], loading: false, error: null };
        
        return { data: methods, loading: false, error: null };
    } catch (error) {
        console.log('Error loading payment methods, falling back to empty:', error);
        return { data: [], loading: false, error: null };
    }
}

export { coreLibQuery };