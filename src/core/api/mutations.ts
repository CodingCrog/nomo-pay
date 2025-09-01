import { gql } from '@apollo/client';

// Account-related mutations
export const mutationCreateNpaIdentity = gql`
    mutation(
        $email: String!,
        $first_name: String!,
        $middle_name: String,
        $last_name: String!,
        $date_of_birth: String!,
        $phone_number: String!,
        $address_detail: String,
        $address_detail2: String,
        $address_city: String,
        $address_zipcode: String,
        $address_countystate: String,
        $country_code: String!,
        $nationality: String,
        $is_crypto_use: Boolean,
        $countries_send_funds_to: [String],
        $average_monthly_outgoing: String!,
        $is_political_exposed_person: Boolean!,
        $political_exposed_person_case: String,
    ){
        create_npa_identity(
            email: $email,
            first_name: $first_name,
            middle_name: $middle_name,
            last_name: $last_name,
            date_of_birth: $date_of_birth,
            phone_number: $phone_number,
            address_detail: $address_detail,
            address_detail2: $address_detail2,
            address_city: $address_city,
            address_zipcode: $address_zipcode,
            address_countystate: $address_countystate,
            country_code: $country_code,
            nationality: $nationality,
            is_crypto_use: $is_crypto_use,
            countries_send_funds_to: $countries_send_funds_to,
            average_monthly_outgoing: $average_monthly_outgoing,
            is_political_exposed_person: $is_political_exposed_person,
            political_exposed_person_case: $political_exposed_person_case,
        ) {
            result
            error
        }
    }
`;

export const mutationCreateNpaIdentityBankAccount = gql`
    mutation(
        $account_type: String!,
    ){
        create_npa_identity_bank_account(
            account_type: $account_type,
        ) {
            result
            error
        }
    }
`;

// Transaction mutations
export const mutationCreateDeposit = gql`
    mutation (
        $bankaccount_id: String!,
        $transactionmethod_id: String!,
        $amount: Float!,
    ){
        create_deposit (
            bankaccount_id: $bankaccount_id,
            transactionmethod_id: $transactionmethod_id,
            amount: $amount,
        ){
            result
            error
        }
    }
`;

export const mutationCreateExternalTransfer = gql`
    mutation (
        $bankaccount_id: String!,
        $beneficiary_id: String!,
        $transactioncurrency_id: String!,
        $amount: Float!,
    ){
        create_external_transfer (
            bankaccount_id: $bankaccount_id,
            beneficiary_id: $beneficiary_id,
            transactioncurrency_id: $transactioncurrency_id,
            amount: $amount,
        ){
            result
            error
        }
    }
`;

export const mutationCreateInternalTransfer = gql`
    mutation (
        $bankaccount_id: String!,
        $receiver_identity_id: String!,
        $transactioncurrency_id: String!,
        $amount: Float!,
    ){
        create_internal_transfer (
            bankaccount_id: $bankaccount_id,
            receiver_identity_id: $receiver_identity_id,
            transactioncurrency_id: $transactioncurrency_id,
            amount: $amount,
        ){
            result
            error
        }
    }
`;

// Beneficiary mutations
export const mutationCreateNpaBeneficiary = gql`
    mutation (
        $transactioncurrency_id: String!,
        $email: String!,
        $firstname: String!,
        $middlename: String!,
        $lastname: String!,
        $personal_address_line1: String!,
        $personal_address_line2: String,
        $personal_address_countrycode: String!,
        $personal_address_city: String!,
        $personal_address_state: String,
        $personal_address_zipcode: String!,
        $beneficiary_bank_name: String!,
        $beneficiary_bank_accountnumber: String!,
        $beneficiary_bank_swiftcode: String!,
        $beneficiary_bank_iban: String!,
        $beneficiary_bank_bic: String!,
        $beneficiary_bank_sortbranchcode: String!,
        $beneficiary_bank_method: String!,
        $beneficiary_bank_address_line1: String!,
        $beneficiary_bank_address_line2: String,
        $beneficiary_bank_address_countrycode: String!,
        $beneficiary_bank_address_city: String!,
        $beneficiary_bank_address_state: String,
        $beneficiary_bank_address_zipcode: String!,
        $intermediate_bank_name: String!,
        $intermediate_bank_swiftcode: String!,
        $intermediate_bank_address_line1: String!,
        $intermediate_bank_address_line2: String,
        $intermediate_bank_address_countrycode: String!,
        $intermediate_bank_address_city: String!,
        $intermediate_bank_address_state: String,
        $intermediate_bank_address_zipcode: String!,
    ){
        create_npa_beneficiary (
            transactioncurrency_id: $transactioncurrency_id,
            email: $email,
            firstname: $firstname,
            middlename: $middlename,
            lastname: $lastname,
            personal_address_line1: $personal_address_line1,
            personal_address_line2: $personal_address_line2,
            personal_address_countrycode: $personal_address_countrycode,
            personal_address_city: $personal_address_city,
            personal_address_state: $personal_address_state,
            personal_address_zipcode: $personal_address_zipcode,
            beneficiary_bank_name: $beneficiary_bank_name,
            beneficiary_bank_accountnumber: $beneficiary_bank_accountnumber,
            beneficiary_bank_swiftcode: $beneficiary_bank_swiftcode,
            beneficiary_bank_iban: $beneficiary_bank_iban,
            beneficiary_bank_bic: $beneficiary_bank_bic,
            beneficiary_bank_sortbranchcode: $beneficiary_bank_sortbranchcode,
            beneficiary_bank_method: $beneficiary_bank_method,
            beneficiary_bank_address_line1: $beneficiary_bank_address_line1,
            beneficiary_bank_address_line2: $beneficiary_bank_address_line2,
            beneficiary_bank_address_countrycode: $beneficiary_bank_address_countrycode,
            beneficiary_bank_address_city: $beneficiary_bank_address_city,
            beneficiary_bank_address_state: $beneficiary_bank_address_state,
            beneficiary_bank_address_zipcode: $beneficiary_bank_address_zipcode,
            intermediate_bank_name: $intermediate_bank_name,
            intermediate_bank_swiftcode: $intermediate_bank_swiftcode,
            intermediate_bank_address_line1: $intermediate_bank_address_line1,
            intermediate_bank_address_line2: $intermediate_bank_address_line2,
            intermediate_bank_address_countrycode: $intermediate_bank_address_countrycode,
            intermediate_bank_address_city: $intermediate_bank_address_city,
            intermediate_bank_address_state: $intermediate_bank_address_state,
            intermediate_bank_address_zipcode: $intermediate_bank_address_zipcode,
        ){
            result
            error
        }
    }
`;

export const mutationCreateNpaBeneficiaryAddress = gql`
    mutation (
        $beneficiary_id: String!,
        $personal_address_line1: String!,
        $personal_address_line2: String,
        $personal_address_countrycode: String!,
        $personal_address_city: String!,
        $personal_address_state: String,
        $personal_address_zipcode: String!,
    ){
        create_npa_beneficiary_address (
            beneficiary_id: $beneficiary_id,
            personal_address_line1: $personal_address_line1,
            personal_address_line2: $personal_address_line2,
            personal_address_countrycode: $personal_address_countrycode,
            personal_address_city: $personal_address_city,
            personal_address_state: $personal_address_state,
            personal_address_zipcode: $personal_address_zipcode,
        ){
            result
            error
        }
    }
`;

// FX Conversion mutations
export const mutationCreateFxConversion = gql`
    mutation (
        $source_currency_id: String!,
        $destination_currency_id: String!,
        $source_amount: Float!,
    ){
        create_fx_conversion (
            source_currency_id: $source_currency_id,
            destination_currency_id: $destination_currency_id,
            source_amount: $source_amount,
        ){
            result
            error
        }
    }
`;

export const mutationAcceptOrCancelFxConversion = gql`
    mutation (
        $action: String!,
        $banktransaction_id: String!,
    ){
        accept_or_cancel_fx_conversion (
            action: $action,
            banktransaction_id: $banktransaction_id,
        ){
            result
            error
        }
    }
`;

// Utility mutations
export const mutationRefreshIdentityData = gql`
    mutation {
        refresh_identity_data {
            result
            error
        }
    }
`;

export const mutationMarkDepositAsPaid = gql`
    mutation ($banktransaction_id: String!){
        mark_deposit_as_paid(banktransaction_id: $banktransaction_id){
            result
            error
        }
    }
`;

export const mutationVerifyEmail = gql`
    mutation ($email: String!, $otp: String){
        verify_email(email: $email, otp: $otp){
            result
            error
        }
    }
`;

export const mutationClaimIdentity = gql`
    mutation ($identity_id: String!){
        claim_npa_identity(identity_id: $identity_id){
            result
            error
        }
    }
`;

export const mutationCreateNpaEBoardingSession = gql`
    mutation{
        create_npa_eboarding_session {
            result
            error
        }
    }
`;