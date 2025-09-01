// Import from the nsw-frontend-core-lib
import { defineLoader } from "nsw-frontend-core-lib";
import {
    getNpaIdentity,
    getNpaIdentityBankAccounts,
    getNpaIdentityBankTransactions,
    getNpaTransactionCurrencies,
    getNpaBeneficiaries,
    getUserSettings,
    isLoggedIn,
    getNpaTransactionMethods
} from "./queries";

export const GQL_LOADERS = {
    is_logged_in: 'nomopay_is_logged_in',
    get_user_settings: 'nomopay_get_user_settings',
    get_npa_identity: 'nomopay_get_npa_identity',
    get_npa_identity_bankaccounts: 'nomopay_get_npa_identity_bankaccounts',
    get_npa_identity_banktransactions: 'nomopay_get_npa_identity_banktransactions',
    get_npa_currencies: 'nomopay_get_npa_currencies',
    get_npa_beneficiaries: 'get_npa_beneficiaries', // Use same name as npay-fe
    get_npa_payment_methods: 'nomopay_get_npa_payment_methods',
};

const SOCKET_RELOAD_MESSAGES = {
    npaidentity_changed: 'npaidentity_changed',
    npaidentitybankaccount_changed: 'npaidentitybankaccount_changed',
    npaidentitybanktransaction_changed: 'npaidentitybanktransaction_changed',
    npabeneficiary_changed: 'npabeneficiary_changed',
};

// Track if loaders have been initialized to prevent duplicate registration
let loadersInitialized = false;

// Force reinitialize for beneficiaries fix
loadersInitialized = false;

console.log('Initializing NomoPay loaders...');

if (!loadersInitialized) {
    try {
        console.log('Defining loader:', GQL_LOADERS.is_logged_in);
        defineLoader(GQL_LOADERS.is_logged_in, isLoggedIn);
        
        defineLoader(GQL_LOADERS.get_user_settings, getUserSettings, {
            clean_fct: (data: any) => data?.user_settings
        });
        
        defineLoader(GQL_LOADERS.get_npa_identity, getNpaIdentity, {
            clean_fct: (data: any) => data?.npa_identity,
            socket_reload_message: SOCKET_RELOAD_MESSAGES.npaidentity_changed,
        });
        
        defineLoader(GQL_LOADERS.get_npa_identity_bankaccounts, getNpaIdentityBankAccounts, {
            clean_fct: (data: any) => data?.npa_identity_bankaccounts,
            socket_reload_message: SOCKET_RELOAD_MESSAGES.npaidentitybankaccount_changed,
        });
        
        defineLoader(GQL_LOADERS.get_npa_identity_banktransactions, getNpaIdentityBankTransactions, {
            clean_fct: (data: any) => {
                console.log('Transactions loader raw data received:', data);
                const transactions = data?.npa_identity_banktransactions || 
                                   data?.npa_banktransactions || 
                                   data?.npa_identity?.banktransactions || 
                                   [];
                console.log('Cleaned transactions:', transactions);
                return transactions;
            },
            socket_reload_message: SOCKET_RELOAD_MESSAGES.npaidentitybanktransaction_changed,
        });
        
        defineLoader(GQL_LOADERS.get_npa_currencies, getNpaTransactionCurrencies, {
            clean_fct: (data: any) => data?.npa_transactioncurrencies,
        });
        
        // Define beneficiaries loader with both possible data structures
        console.log('Defining beneficiaries loader with query:', getNpaBeneficiaries);
        console.log('Query content:', getNpaBeneficiaries.loc?.source?.body);
        defineLoader(GQL_LOADERS.get_npa_beneficiaries, getNpaBeneficiaries, {
            clean_fct: (data: any) => {
                console.log('Beneficiaries loader data received:', data);
                console.log('Data keys:', data ? Object.keys(data) : 'null');
                console.log('Full data structure:', JSON.stringify(data, null, 2));
                // Use the correct path: npa_identity.beneficiaries
                const beneficiaries = data?.npa_identity?.beneficiaries || [];
                console.log('Cleaned beneficiaries:', beneficiaries);
                return beneficiaries;
            },
            socket_reload_message: SOCKET_RELOAD_MESSAGES.npabeneficiary_changed,
        });
        
        defineLoader(GQL_LOADERS.get_npa_payment_methods, getNpaTransactionMethods, {
            clean_fct: (data: any) => data?.npa_transactionmethods,
        });
        
        loadersInitialized = true;
    } catch (error) {
        console.error('Error initializing loaders:', error);
    }
}