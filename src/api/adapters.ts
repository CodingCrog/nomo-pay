import type { Account, CurrencyBalance, Transaction, CurrencyInfo, Beneficiary } from '../types';

export function adaptBankAccountToAccount(bankAccount: any): Account | null {
    if (!bankAccount) return null;
    
    // Determine account type based on type_char or account_type
    const isGbBased = bankAccount.type_char === 'g' || bankAccount.account_type === 'gbbasedAccount';
    const isNumbered = bankAccount.type_char === 'n' || bankAccount.account_type === 'numberAccount';
    
    const currency = bankAccount.transactioncurrency;
    
    return {
        id: bankAccount.id,
        name: isGbBased ? 'London Account' : isNumbered ? 'Singapore Account' : 'Main Account',
        type: isGbBased ? 'gb_based' : isNumbered ? 'numbered' : 'standard',
        accountNumber: `****${bankAccount.id.slice(-4)}`, // Use last 4 chars of ID
        balance: parseFloat(bankAccount.balance || '0'),
        currency: currency?.currency_code || 'EUR',
        availableCurrencies: currency ? [{
            code: currency.currency_code,
            name: currency.currency_txt,
            symbol: currency.currency_code, // Use code as symbol
            balance: parseFloat(bankAccount.balance || '0')
        }] : [],
        chartData: { labels: [], values: [] },
        lastUpdated: new Date(bankAccount.created_at * 1000), // Convert Unix timestamp
        status: 'active', // All accounts appear to be active
    };
}

export function adaptBankAccountToBalance(bankAccount: any): CurrencyBalance | null {
    if (!bankAccount || !bankAccount.transactioncurrency) return null;
    
    const currency = bankAccount.transactioncurrency;
    
    return {
        id: `${bankAccount.id}-${currency.currency_code}`,
        accountId: bankAccount.id,
        currency: {
            code: currency.currency_code,
            name: currency.currency_txt,
            symbol: currency.currency_code, // Use code as symbol since symbol not provided
            decimal: 2, // Default to 2 decimal places
        },
        balance: parseFloat(bankAccount.balance || '0'),
        available: parseFloat(bankAccount.available_balance || '0'),
        pending: 0, // Not provided in the data
    };
}

export function adaptTransactionData(transaction: any): Transaction | null {
    if (!transaction) return null;
    
    const type = transaction.type === 'deposit' ? 'Funds' : 
                 transaction.type === 'external_transfer' ? 'Transfer' : 
                 'Exchange';
    
    const action = transaction.type === 'deposit' ? 'Deposit' :
                   transaction.type === 'external_transfer' ? 'Transfer' :
                   transaction.type === 'withdrawal' ? 'Withdrawal' :
                   'Exchange';
    
    return {
        id: transaction.id,
        accountId: transaction.from_account?.id || transaction.to_account?.id || '',
        orderDate: new Date(transaction.created_at),
        accountType: 'numbered', // Default, should be determined from account
        type: type as 'Funds' | 'Transfer' | 'Exchange',
        action: action as any,
        amount: parseFloat(transaction.amount || '0'),
        currency: transaction.currency?.iso || 'EUR',
        remarks: transaction.description,
        orderStatus: transaction.status === 'completed' ? 'Completed' : 
                    transaction.status === 'pending' ? 'Pending' :
                    transaction.status === 'processing' ? 'Processing' : 
                    'Cancelled',
        balance: 0, // This would need to be calculated
        recipient: transaction.beneficiary ? 
            `${transaction.beneficiary.firstname} ${transaction.beneficiary.lastname}` : 
            transaction.to_account?.accountnumber,
        description: transaction.description,
        reference: transaction.reference,
        beneficiary: transaction.beneficiary ? adaptBeneficiaryData(transaction.beneficiary) || undefined : undefined,
    };
}

export function adaptCurrencyData(currency: any): CurrencyInfo | null {
    if (!currency) return null;
    
    return {
        code: currency.iso,
        name: currency.name,
        symbol: currency.symbol || currency.iso,
        decimal: currency.decimals || 2,
    };
}

export function adaptBeneficiaryData(beneficiary: any): Beneficiary | null {
    if (!beneficiary) return null;
    
    return {
        id: beneficiary.id,
        name: `${beneficiary.firstname} ${beneficiary.lastname}`.trim(),
        accountNumber: beneficiary.bank_accountnumber,
        iban: beneficiary.bank_iban,
        swiftCode: beneficiary.bank_swiftcode,
        bankName: beneficiary.bank_name,
        address: beneficiary.personal_address ? {
            street: beneficiary.personal_address.line1,
            city: beneficiary.personal_address.city,
            state: beneficiary.personal_address.state,
            country: beneficiary.personal_address.country?.iso || '',
            postalCode: beneficiary.personal_address.zipcode,
        } : undefined,
    };
}