import type { Account, CurrencyBalance, Transaction, CurrencyInfo, SimpleBeneficiary } from '../../types';

export function adaptBankAccountToAccount(bankAccount: any): Account | null {
    if (!bankAccount) {
        console.log('adaptBankAccountToAccount - No bank account provided');
        return null;
    }
    
    console.log('adaptBankAccountToAccount - Raw bank account:', bankAccount);
    
    try {
        // Determine account type based on type_char or account index
        // Check different possible fields for account type
        let accountType: 'numbered' | 'gb_based' = 'gb_based';
        
        if (bankAccount.type_char === 'N' || 
            bankAccount.accounttype_char === 'N' ||
            bankAccount.account_type === 'numbered' ||
            bankAccount.name?.toLowerCase().includes('numbered')) {
            accountType = 'numbered';
        }
        
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
                balance: 0,
                exchangeRate: 1
            }] : [],
            chartData: {
                labels: [],
                values: []
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
                decimal: 2
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
    
    console.log('adaptTransactionData - Raw transaction:', {
        id: transaction.id,
        identitybankaccount: transaction.identitybankaccount,
        transactioncurrency: transaction.transactioncurrency,
        type_txt: transaction.type_txt,
        request_amount: transaction.request_amount
    });
    
    try {
        // Handle date - could be a string or timestamp
        let transactionDate: Date;
        if (typeof transaction.created_at === 'string') {
            transactionDate = new Date(transaction.created_at);
        } else if (typeof transaction.created_at === 'number') {
            // If it's a Unix timestamp (seconds), convert to milliseconds
            const dateInMs = transaction.created_at * 1000;
            transactionDate = new Date(dateInMs);
        } else {
            transactionDate = new Date();
        }
        
        // Determine transaction type based on type_txt or type_char
        const typeTxt = transaction.type_txt?.toLowerCase() || '';
        let transactionType: 'Funds' | 'Transfer' | 'Exchange';
        
        if (typeTxt.includes('deposit') || typeTxt.includes('fund')) {
            transactionType = 'Funds';
        } else if (typeTxt.includes('transfer') || typeTxt.includes('withdrawal')) {
            transactionType = 'Transfer';
        } else if (typeTxt.includes('exchange') || typeTxt.includes('conversion')) {
            transactionType = 'Exchange';
        } else {
            // Fallback to type_char mapping
            transactionType = mapTransactionType(transaction.type_char);
        }
        
        // Parse amount - ensure it's always a number
        let amount = parseFloat(transaction.request_amount || '0');
        
        // Deposits (Funds type) should always be positive
        // Withdrawals and transfers should be negative  
        if (transactionType === 'Funds') {
            // Force deposits to be positive
            amount = Math.abs(amount);
        } else if (transactionType === 'Transfer' && amount > 0) {
            // Outgoing transfers should be negative
            amount = -Math.abs(amount);
        }
        
        const result = {
            id: transaction.id,
            date: transactionDate,
            description: transaction.type_txt || 'Transaction',
            amount: amount,
            currency: transaction.transactioncurrency?.currency_code || 'USD', // Default to USD
            type: transactionType,
            status: mapTransactionStatus(transaction.status_txt),
            accountId: transaction.identitybankaccount?.id || '',
            reference: transaction.reference_code || undefined,
            beneficiary: transaction.beneficiary ? {
                name: `${transaction.beneficiary.firstname_txt || ''} ${transaction.beneficiary.lastname_txt || ''}`.trim(),
                account: transaction.beneficiary.accountnumber_txt || transaction.beneficiary.beneficiary_bankaccountnumber_txt
            } : undefined
        };
        
        console.log('adaptTransactionData - Result:', {
            id: result.id,
            accountId: result.accountId,
            currency: result.currency,
            amount: result.amount
        });
        
        return result;
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
            decimal: 2
        };
    } catch (error) {
        console.error('Error adapting currency:', error, currency);
        return null;
    }
}

export function adaptBeneficiaryData(beneficiary: any): SimpleBeneficiary | null {
    if (!beneficiary) return null;
    
    try {
        return {
            id: beneficiary.id,
            name: `${beneficiary.firstname_txt || ''} ${beneficiary.lastname_txt || ''}`.trim() || beneficiary.accountholder_txt || '',
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

function mapTransactionType(typeChar: string): 'Funds' | 'Transfer' | 'Exchange' {
    switch (typeChar?.toUpperCase()) {
        case 'C':
        case 'D': // Deposit
            return 'Funds';
        case 'W': // Withdrawal  
        case 'T': // Transfer
            return 'Transfer';
        case 'E': // Exchange
            return 'Exchange';
        default:
            // Default to Funds for unknown types
            return 'Funds';
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