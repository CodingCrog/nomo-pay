import { gql } from '@apollo/client';

const gqlPropsCountry = `
    id
    name
    iso
`;

const gqlPropsV1Account = `
    id
    created_at
    user_name
    is_vooone
    member_key
    details {
        id
        email
        phone
        iban
        info_personal {
            firstname
            lastname
            date_of_birth
            nationality_country {
                ${gqlPropsCountry}
            }
        }
        info_address {
            city
            state
            residence_country {
                ${gqlPropsCountry}                
            }
            zipcode
            street
            building_number
        }
    }
`;

const gqlPropsNpaIdentity = `
    id
    created_at
    v1_account {
        ${gqlPropsV1Account}
    }
`;

const gqlPropsCurrency = `
    id
    is_active
    currency_code
    currency_txt
`;

const gqlPropsNpaBankAccount = `
    id
    created_at
    type_char
    account_type
    transactioncurrency {
        ${gqlPropsCurrency}
    }
    balance
    available_balance
`;

const _gqlPropsBeneficiaryAddress = `
    id
    created_at
    address_line1
    address_line2
    address_country_code
    address_city
    address_state
    address_zipcode
    is_current
    beneficiary_id
`;

const gqlPropsBeneficiary = `
    id
    created_at
    accountholder_txt
    accountnumber_txt
    routingnumber_txt
    regular_bankname_txt
    regular_bankswiftcode_txt
    regular_bankaddress_line1
    regular_bankaddress_line2
    regular_bankaddress_zipcode
    regular_bankaddress_city
    regular_bankaddress_state
    regular_bankaddress_country
    intermediate_bankname_txt
    intermediate_bankswiftcode_txt
    intermediate_bankaddress_line1
    intermediate_bankaddress_line2
    intermediate_bankaddress_zipcode
    intermediate_bankaddress_city
    intermediate_bankaddress_state
    intermediate_bankaddress_country
    beneficiary_bankname_txt
    beneficiary_bankaccountnumber_txt
    beneficiary_bankswiftcode_txt
    beneficiary_bankiban_txt
    beneficiary_bankbic_txt
    beneficiary_banksortbranchcode_txt
    beneficiary_bankaddress_line1
    beneficiary_bankaddress_line2
    beneficiary_bankaddress_zipcode
    beneficiary_bankaddress_city
    beneficiary_bankaddress_state
    beneficiary_bankaddress_country
    firstname_txt
    middlename_txt
    lastname_txt
    email_txt
    addresses {
        id
        created_at
        address_line1
        address_line2
        address_country_code
        address_city
        address_state
        address_zipcode
        is_current
        beneficiary_id
    }
`;

const gqlPropsIdentityDocument = `
    id
    created_at
    file_name
    file_url
    mime_type
    identitybanktransaction_id
`;

const gqlPropsBankTransaction = `
    id
    created_at
    updated_at
    settled_at
    status_txt
    request_amount
    settle_amount
    fee_amount
    reference_code
    type_char
    type_txt
    identitybankaccount {
        ${gqlPropsNpaBankAccount}
    }
    transactioncurrency {
        ${gqlPropsCurrency}
    }
    beneficiary {
        ${gqlPropsBeneficiary}
    }
    documents {
        ${gqlPropsIdentityDocument}
    }
`;

const gqlPropsTxMethod = `
    id 
    is_active  
    is_local   
    is_intl
    type_char  
    account_type
    method_code
    method_txt 
    transactioncurrency_id
`;

export const isLoggedIn = gql`
    {
        is_logged_in
    }
`;

export const getNpaIdentity = gql`
    {
        npa_identity {
            ${gqlPropsNpaIdentity}
        }
    }
`;

export const getNpaIdentityBankAccounts = gql`
    {
        npa_identity_bankaccounts {
            ${gqlPropsNpaBankAccount}
        }
    }
`;

export const getNpaIdentityBankTransactions = gql`
    {
        npa_identity_banktransactions {
            ${gqlPropsBankTransaction}
        }
    }
`;

export const getNpaTransactionCurrencies = gql`
    {
        npa_transactioncurrencies {
            ${gqlPropsCurrency}
        }
    }
`;

export const getNpaTransactionMethods = gql`
    {
        npa_transactionmethods {
            ${gqlPropsTxMethod}
        }
    }
`;

export const getNpaBeneficiaries = gql`
    {
        npa_identity {
            beneficiaries {
                ${gqlPropsBeneficiary}
            }
        }
    }
`;

// Alternative direct query for beneficiaries if available
export const getNpaBeneficiariesDirect = gql`
    {
        npa_beneficiaries {
            ${gqlPropsBeneficiary}
        }
    }
`;

export const getUserSettings = gql`
    {
        user_settings
    }
`;

export const getVerifiedEmails = gql`
    {
        nomo_me {
            verified_emails
        }
    }
`;

export const getClaimableIdentities = gql`
    {
        claimable_identities {
            ${gqlPropsNpaIdentity}
        }
    }
`;