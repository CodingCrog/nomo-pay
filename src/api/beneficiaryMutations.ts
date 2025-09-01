import { gql } from '@apollo/client';

export const mutationCreateNpaBeneficiary = gql`
  mutation CreateNpaBeneficiary(
    $transactioncurrency_id: String!
    $email: String!
    $firstname: String!
    $middlename: String
    $lastname: String!
    $personal_address_line1: String!
    $personal_address_line2: String
    $personal_address_countrycode: String!
    $personal_address_city: String!
    $personal_address_state: String
    $personal_address_zipcode: String!
    $beneficiary_bank_name: String
    $beneficiary_bank_accountnumber: String
    $beneficiary_bank_swiftcode: String
    $beneficiary_bank_iban: String
    $beneficiary_bank_bic: String
    $beneficiary_bank_sortbranchcode: String
    $beneficiary_bank_address_line1: String!
    $beneficiary_bank_address_line2: String
    $beneficiary_bank_address_countrycode: String!
    $beneficiary_bank_address_city: String!
    $beneficiary_bank_address_state: String
    $beneficiary_bank_address_zipcode: String!
    $intermediate_bank_name: String
    $intermediate_bank_swiftcode: String
    $intermediate_bank_address_line1: String
    $intermediate_bank_address_line2: String
    $intermediate_bank_address_countrycode: String
    $intermediate_bank_address_city: String
    $intermediate_bank_address_state: String
    $intermediate_bank_address_zipcode: String
  ) {
    create_npa_beneficiary(
      transactioncurrency_id: $transactioncurrency_id
      email: $email
      firstname: $firstname
      middlename: $middlename
      lastname: $lastname
      personal_address_line1: $personal_address_line1
      personal_address_line2: $personal_address_line2
      personal_address_countrycode: $personal_address_countrycode
      personal_address_city: $personal_address_city
      personal_address_state: $personal_address_state
      personal_address_zipcode: $personal_address_zipcode
      beneficiary_bank_name: $beneficiary_bank_name
      beneficiary_bank_accountnumber: $beneficiary_bank_accountnumber
      beneficiary_bank_swiftcode: $beneficiary_bank_swiftcode
      beneficiary_bank_iban: $beneficiary_bank_iban
      beneficiary_bank_bic: $beneficiary_bank_bic
      beneficiary_bank_sortbranchcode: $beneficiary_bank_sortbranchcode
      beneficiary_bank_address_line1: $beneficiary_bank_address_line1
      beneficiary_bank_address_line2: $beneficiary_bank_address_line2
      beneficiary_bank_address_countrycode: $beneficiary_bank_address_countrycode
      beneficiary_bank_address_city: $beneficiary_bank_address_city
      beneficiary_bank_address_state: $beneficiary_bank_address_state
      beneficiary_bank_address_zipcode: $beneficiary_bank_address_zipcode
      intermediate_bank_name: $intermediate_bank_name
      intermediate_bank_swiftcode: $intermediate_bank_swiftcode
      intermediate_bank_address_line1: $intermediate_bank_address_line1
      intermediate_bank_address_line2: $intermediate_bank_address_line2
      intermediate_bank_address_countrycode: $intermediate_bank_address_countrycode
      intermediate_bank_address_city: $intermediate_bank_address_city
      intermediate_bank_address_state: $intermediate_bank_address_state
      intermediate_bank_address_zipcode: $intermediate_bank_address_zipcode
    ) {
      result
      error
    }
  }
`;

export const mutationUpdateNpaBeneficiary = gql`
  mutation UpdateNpaBeneficiary(
    $id: String!
    $transactioncurrency_id: String!
    $email: String!
    $firstname: String!
    $middlename: String
    $lastname: String!
    $personal_address_line1: String!
    $personal_address_line2: String
    $personal_address_countrycode: String!
    $personal_address_city: String!
    $personal_address_state: String
    $personal_address_zipcode: String!
    $beneficiary_bank_name: String
    $beneficiary_bank_accountnumber: String
    $beneficiary_bank_swiftcode: String
    $beneficiary_bank_iban: String
    $beneficiary_bank_bic: String
    $beneficiary_bank_sortbranchcode: String
    $beneficiary_bank_address_line1: String!
    $beneficiary_bank_address_line2: String
    $beneficiary_bank_address_countrycode: String!
    $beneficiary_bank_address_city: String!
    $beneficiary_bank_address_state: String
    $beneficiary_bank_address_zipcode: String!
    $intermediate_bank_name: String
    $intermediate_bank_swiftcode: String
    $intermediate_bank_address_line1: String
    $intermediate_bank_address_line2: String
    $intermediate_bank_address_countrycode: String
    $intermediate_bank_address_city: String
    $intermediate_bank_address_state: String
    $intermediate_bank_address_zipcode: String
  ) {
    update_npa_beneficiary(
      id: $id
      transactioncurrency_id: $transactioncurrency_id
      email: $email
      firstname: $firstname
      middlename: $middlename
      lastname: $lastname
      personal_address_line1: $personal_address_line1
      personal_address_line2: $personal_address_line2
      personal_address_countrycode: $personal_address_countrycode
      personal_address_city: $personal_address_city
      personal_address_state: $personal_address_state
      personal_address_zipcode: $personal_address_zipcode
      beneficiary_bank_name: $beneficiary_bank_name
      beneficiary_bank_accountnumber: $beneficiary_bank_accountnumber
      beneficiary_bank_swiftcode: $beneficiary_bank_swiftcode
      beneficiary_bank_iban: $beneficiary_bank_iban
      beneficiary_bank_bic: $beneficiary_bank_bic
      beneficiary_bank_sortbranchcode: $beneficiary_bank_sortbranchcode
      beneficiary_bank_address_line1: $beneficiary_bank_address_line1
      beneficiary_bank_address_line2: $beneficiary_bank_address_line2
      beneficiary_bank_address_countrycode: $beneficiary_bank_address_countrycode
      beneficiary_bank_address_city: $beneficiary_bank_address_city
      beneficiary_bank_address_state: $beneficiary_bank_address_state
      beneficiary_bank_address_zipcode: $beneficiary_bank_address_zipcode
      intermediate_bank_name: $intermediate_bank_name
      intermediate_bank_swiftcode: $intermediate_bank_swiftcode
      intermediate_bank_address_line1: $intermediate_bank_address_line1
      intermediate_bank_address_line2: $intermediate_bank_address_line2
      intermediate_bank_address_countrycode: $intermediate_bank_address_countrycode
      intermediate_bank_address_city: $intermediate_bank_address_city
      intermediate_bank_address_state: $intermediate_bank_address_state
      intermediate_bank_address_zipcode: $intermediate_bank_address_zipcode
    ) {
      result
      error
    }
  }
`;

export const mutationDeleteNpaBeneficiary = gql`
  mutation DeleteNpaBeneficiary($id: String!) {
    delete_npa_beneficiary(id: $id) {
      result
      error
    }
  }
`;