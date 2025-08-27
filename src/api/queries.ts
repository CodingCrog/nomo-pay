import { gql } from '@apollo/client';

const gqlPropsCountry = `
    id
    name
    iso
`;

const gqlPropsNpaIdentity = `
    id
    created_at
    v1_account {
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
    }
`;

const gqlPropsNpaBankAccount = `
    id
    created_at
    type_char
    account_type
    transactioncurrency {
        id
        is_active
        currency_code
        currency_txt
    }
    balance
    available_balance
`;

const gqlPropsNpaTransaction = `
    id
    created_at
    updated_at
    amount
    currency {
        id
        iso
        name
        symbol
        decimals
    }
    type
    status
    description
    reference
    from_account {
        id
        accountnumber
    }
    to_account {
        id
        accountnumber
    }
    beneficiary {
        id
        firstname
        lastname
        email
    }
`;

export const getNpaIdentity = gql`
    query {
        npa_identity {
            ${gqlPropsNpaIdentity}
        }
    }
`;

export const getNpaIdentityBankAccounts = gql`
    query {
        npa_identity_bankaccounts {
            ${gqlPropsNpaBankAccount}
        }
    }
`;

export const getNpaIdentityBankTransactions = gql`
    query {
        npa_identity_banktransactions {
            ${gqlPropsNpaTransaction}
        }
    }
`;

export const getNpaTransactionCurrencies = gql`
    query {
        npa_transactioncurrencies {
            id
            iso
            name
            symbol
            decimals
            min_amount
            max_amount
        }
    }
`;

export const getNpaBeneficiaries = gql`
    query {
        npa_identity {
            beneficiaries {
                id
                firstname
                middlename
                lastname
                email
                bank_name
                bank_accountnumber
                bank_swiftcode
                bank_iban
                personal_address {
                    line1
                    line2
                    city
                    state
                    country {
                        ${gqlPropsCountry}
                    }
                    zipcode
                }
            }
        }
    }
`;

export const isLoggedIn = gql`
    query {
        is_logged_in
    }
`;

export const getUserSettings = gql`
    query {
        user_settings {
            id
            language
            currency
            theme
        }
    }
`;