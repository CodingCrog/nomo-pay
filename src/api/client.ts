import { coreLibQuery, useDataLoader } from "nsw-frontend-core-lib";
import { GQL_LOADERS } from "./loaders";
import { 
    adaptBankAccountToAccount, 
    adaptBankAccountToBalance, 
    adaptTransactionData,
    adaptCurrencyData,
    adaptBeneficiaryData 
} from "./adapters";
import type { Account, CurrencyBalance, Transaction, CurrencyInfo, Beneficiary } from '../types';

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

    static async getTransactions(accountId?: string): Promise<Transaction[]> {
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

    static async getBeneficiaries(): Promise<Beneficiary[]> {
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
        
        // If no data from backend, return empty but not loading
        if (!bankAccounts) return { data: [], loading: false, error: null };
        
        const accounts = bankAccounts
            .map(adaptBankAccountToAccount)
            .filter((acc: Account | null): acc is Account => acc !== null);
        
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
        
        // If no data from backend, return empty but not loading
        if (!transactions) return { data: [], loading: false, error: null };
    
    const adaptedTransactions = transactions
        .map(adaptTransactionData)
        .filter((tx: Transaction | null): tx is Transaction => tx !== null);
    
    const filteredTransactions = accountId
        ? adaptedTransactions.filter((tx: Transaction) => tx.accountId === accountId)
        : adaptedTransactions;
    
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
        .filter((ben: Beneficiary | null): ben is Beneficiary => ben !== null);
    
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