export interface BeneficiaryFormData {
  // Required fields
  transactioncurrency_id: string;
  email: string;
  firstname: string;
  lastname: string;
  personal_address_line1: string;
  personal_address_countrycode: string;
  personal_address_city: string;
  personal_address_zipcode: string;
  beneficiary_bank_address_line1: string;
  beneficiary_bank_address_countrycode: string;
  beneficiary_bank_address_city: string;
  beneficiary_bank_address_zipcode: string;
  
  // Optional fields
  middlename?: string;
  personal_address_line2?: string;
  personal_address_state?: string;
  beneficiary_bank_name?: string;
  beneficiary_bank_accountnumber?: string;
  beneficiary_bank_swiftcode?: string;
  beneficiary_bank_iban?: string;
  beneficiary_bank_bic?: string;
  beneficiary_bank_sortbranchcode?: string;
  beneficiary_bank_method?: string;  // Made optional since backend doesn't accept it
  beneficiary_bank_address_line2?: string;
  beneficiary_bank_address_state?: string;
  intermediate_bank_name?: string;
  intermediate_bank_swiftcode?: string;
  intermediate_bank_address_line1?: string;
  intermediate_bank_address_line2?: string;
  intermediate_bank_address_countrycode?: string;
  intermediate_bank_address_city?: string;
  intermediate_bank_address_state?: string;
  intermediate_bank_address_zipcode?: string;
  
  // Local fields
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StoredBeneficiary extends BeneficiaryFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BANK_METHODS = [
  { value: 'SWIFT', label: 'SWIFT Transfer' },
  { value: 'ACH', label: 'ACH Transfer' },
  { value: 'WIRE', label: 'Wire Transfer' },
  { value: 'SEPA', label: 'SEPA Transfer' },
  { value: 'LOCAL', label: 'Local Transfer' }
];

export const REQUIRED_FIELDS = [
  'transactioncurrency_id',
  'email',
  'firstname',
  'lastname',
  'personal_address_line1',
  'personal_address_countrycode',
  'personal_address_city',
  'personal_address_zipcode',
  'beneficiary_bank_address_line1',
  'beneficiary_bank_address_countrycode',
  'beneficiary_bank_address_city',
  'beneficiary_bank_address_zipcode'
] as const;