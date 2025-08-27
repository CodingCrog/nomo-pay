import type { Account, CurrencyBalance, Transaction, CurrencyInfo, Beneficiary } from '../types';

export function adaptBankAccountToAccount(bankAccount: any): Account | null {
    if (!bankAccount) return null;
    
    try {
        // Determine account type based on type_char
        const accountType = bankAccount.type_char === 'N' ? 'numbered' : 'gb_based';
        
        // Generate account number based on type
        const accountNumber = accountType === 'numbered' 
            ? `CH${bankAccount.id.slice(0, 2).toUpperCase()} **** ${bankAccount.id.slice(-4)}`
            : `GB${bankAccount.id.slice(0, 2).toUpperCase()} **** ${bankAccount.id.slice(-4)}`;
        
        return {
            id: bankAccount.id,
            name: accountType === 'numbered' ? 'Numbered Account' : 'GB Based Account',
            accountNumber: accountNumber,
            type: accountType,
            balance: parseFloat(bankAccount.balance || '0'),
            currency: bankAccount.transactioncurrency?.currency_code || 'EUR',
            availableCurrencies: bankAccount.transactioncurrency ? [{
                code: bankAccount.transactioncurrency.currency_code,
                name: bankAccount.transactioncurrency.currency_txt,
                symbol: getCurrencySymbol(bankAccount.transactioncurrency.currency_code),
                decimals: 2
            }] : [],
            chartData: {
                labels: [],
                data: []
            },
            lastUpdated: new Date(bankAccount.created_at || Date.now()),
            status: 'active'
        };
    } catch (error) {
        console.error('Error adapting bank account:', error, bankAccount);
        return null;
    }
}

export function adaptBankAccountToBalance(bankAccount: any): CurrencyBalance | null {
    if (!bankAccount || !bankAccount.transactioncurrency) return null;
    
    try {
        return {
            id: `balance-${bankAccount.id}`,
            accountId: bankAccount.id,
            currency: {
                code: bankAccount.transactioncurrency.currency_code,
                name: bankAccount.transactioncurrency.currency_txt,
                symbol: getCurrencySymbol(bankAccount.transactioncurrency.currency_code),
                decimals: 2
            },
            balance: parseFloat(bankAccount.balance || '0'),
            available: parseFloat(bankAccount.available_balance || bankAccount.balance || '0'),
            pending: 0
        };
    } catch (error) {
        console.error('Error adapting balance:', error, bankAccount);
        return null;
    }
}

export function adaptTransactionData(transaction: any): Transaction | null {
    if (!transaction) return null;
    
    try {
        return {
            id: transaction.id,
            date: new Date(transaction.created_at),
            description: transaction.type_txt || 'Transaction',
            amount: parseFloat(transaction.request_amount || '0'),
            currency: transaction.transactioncurrency?.currency_code || 'EUR',
            type: mapTransactionType(transaction.type_char),
            status: mapTransactionStatus(transaction.status_txt),
            accountId: transaction.identitybankaccount?.id || '',
            reference: transaction.reference_code || undefined,
            beneficiary: transaction.beneficiary ? {
                name: `${transaction.beneficiary.firstname_txt || ''} ${transaction.beneficiary.lastname_txt || ''}`.trim(),
                account: transaction.beneficiary.accountnumber_txt || transaction.beneficiary.beneficiary_bankaccountnumber_txt
            } : undefined
        };
    } catch (error) {
        console.error('Error adapting transaction:', error, transaction);
        return null;
    }
}

export function adaptCurrencyData(currency: any): CurrencyInfo | null {
    if (!currency) return null;
    
    try {
        return {
            code: currency.currency_code,
            name: currency.currency_txt,
            symbol: getCurrencySymbol(currency.currency_code),
            decimals: 2
        };
    } catch (error) {
        console.error('Error adapting currency:', error, currency);
        return null;
    }
}

export function adaptBeneficiaryData(beneficiary: any): Beneficiary | null {
    if (!beneficiary) return null;
    
    try {
        return {
            id: beneficiary.id,
            firstname: beneficiary.firstname_txt || beneficiary.accountholder_txt?.split(' ')[0] || '',
            lastname: beneficiary.lastname_txt || beneficiary.accountholder_txt?.split(' ').slice(1).join(' ') || '',
            email: beneficiary.email_txt || '',
            bankName: beneficiary.beneficiary_bankname_txt || beneficiary.regular_bankname_txt || '',
            accountNumber: beneficiary.beneficiary_bankaccountnumber_txt || beneficiary.accountnumber_txt || '',
            iban: beneficiary.beneficiary_bankiban_txt || '',
            swiftCode: beneficiary.beneficiary_bankswiftcode_txt || beneficiary.regular_bankswiftcode_txt || ''
        };
    } catch (error) {
        console.error('Error adapting beneficiary:', error, beneficiary);
        return null;
    }
}

// Helper functions
function getCurrencySymbol(code: string): string {
    const symbols: Record<string, string> = {
        'EUR': '€',
        'GBP': '£',
        'USD': '$',
        'CHF': 'CHF',
        'AUD': 'A$',
        'CAD': 'C$',
        'SGD': 'S$',
        'HKD': 'HK$',
        'JPY': '¥',
        'CNY': '¥'
    };
    return symbols[code] || code;
}

function mapTransactionType(typeChar: string): 'credit' | 'debit' | 'pending' {
    switch (typeChar?.toUpperCase()) {
        case 'C':
        case 'D': // Deposit
            return 'credit';
        case 'W': // Withdrawal
        case 'T': // Transfer
            return 'debit';
        default:
            return 'pending';
    }
}

function mapTransactionStatus(status: string): 'completed' | 'pending' | 'failed' {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus.includes('complete') || lowerStatus.includes('success') || lowerStatus.includes('settled')) {
        return 'completed';
    }
    if (lowerStatus.includes('fail') || lowerStatus.includes('error') || lowerStatus.includes('reject')) {
        return 'failed';
    }
    return 'pending';
}