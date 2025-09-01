// Beneficiary validation utilities

export const BENEFICIARY_REQUIRED_FIELDS = [
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
];

// Convert empty strings to null for optional fields
export function normalizeOptionalFields(data: any): any {
  const normalized = { ...data };
  
  // Remove beneficiary_bank_method field as backend doesn't accept it
  delete normalized.beneficiary_bank_method;
  
  // List of optional fields that should be null when empty
  const optionalFields = [
    'middlename',
    'personal_address_line2',
    'personal_address_state',
    'beneficiary_bank_name',
    'beneficiary_bank_accountnumber',
    'beneficiary_bank_swiftcode',
    'beneficiary_bank_iban',
    'beneficiary_bank_bic',
    'beneficiary_bank_sortbranchcode',
    'beneficiary_bank_address_line2',
    'beneficiary_bank_address_state',
    'intermediate_bank_name',
    'intermediate_bank_swiftcode',
    'intermediate_bank_address_line1',
    'intermediate_bank_address_line2',
    'intermediate_bank_address_countrycode',
    'intermediate_bank_address_city',
    'intermediate_bank_address_state',
    'intermediate_bank_address_zipcode'
  ];
  
  optionalFields.forEach(field => {
    if (normalized[field] === '' || normalized[field] === undefined) {
      normalized[field] = null;
    }
  });
  
  return normalized;
}

// Validate beneficiary data before submission
export function validateBeneficiaryData(data: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Check required fields
  BENEFICIARY_REQUIRED_FIELDS.forEach(field => {
    if (!data[field]) {
      const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      errors[field] = `${fieldLabel} is required`;
    }
  });
  
  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  // IBAN validation (basic)
  if (data.beneficiary_bank_iban && !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(data.beneficiary_bank_iban)) {
    errors.beneficiary_bank_iban = 'Invalid IBAN format';
  }
  
  // SWIFT/BIC validation (basic)
  if (data.beneficiary_bank_swiftcode && !/^[A-Z]{6}[A-Z0-9]{2,5}$/.test(data.beneficiary_bank_swiftcode)) {
    errors.beneficiary_bank_swiftcode = 'Invalid SWIFT/BIC format';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}