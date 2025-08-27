export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface TransferData {
  sourceAccountId: string;
  beneficiaryId: string;
  amount: number;
  currency: string;
  description?: string;
  reference?: string;
}

export interface DepositData {
  amount: number;
  currency: string;
  accountId: string;
  paymentMethodId: string;
}

export interface BeneficiaryData {
  firstname: string;
  lastname: string;
  email: string;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  address: {
    line1: string;
    city: string;
    country: string;
    zipcode: string;
  };
}

// Validation functions
export const validateAmount = (amount: number, min: number = 0.01, max?: number): string | null => {
  if (!amount || amount <= 0) {
    return 'Amount must be greater than 0';
  }
  if (amount < min) {
    return `Amount must be at least ${min}`;
  }
  if (max && amount > max) {
    return `Amount cannot exceed ${max}`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const validateIBAN = (iban: string): string | null => {
  if (!iban) return null; // IBAN might be optional
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (!ibanRegex.test(cleanIban)) {
    return 'Invalid IBAN format';
  }
  return null;
};

export const validateSWIFT = (swift: string): string | null => {
  if (!swift) return null; // SWIFT might be optional
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  const cleanSwift = swift.replace(/\s/g, '').toUpperCase();
  if (!swiftRegex.test(cleanSwift)) {
    return 'Invalid SWIFT/BIC code format';
  }
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

// Composite validation functions
export const validateTransfer = (
  data: TransferData,
  availableBalance: number
): ValidationResult => {
  const errors: Record<string, string> = {};

  const sourceError = validateRequired(data.sourceAccountId, 'Source account');
  if (sourceError) errors.sourceAccountId = sourceError;

  const beneficiaryError = validateRequired(data.beneficiaryId, 'Beneficiary');
  if (beneficiaryError) errors.beneficiaryId = beneficiaryError;

  const amountError = validateAmount(data.amount);
  if (amountError) {
    errors.amount = amountError;
  } else if (data.amount > availableBalance) {
    errors.amount = 'Insufficient funds';
  }

  const currencyError = validateRequired(data.currency, 'Currency');
  if (currencyError) errors.currency = currencyError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateDeposit = (data: DepositData): ValidationResult => {
  const errors: Record<string, string> = {};

  const amountError = validateAmount(data.amount);
  if (amountError) errors.amount = amountError;

  const currencyError = validateRequired(data.currency, 'Currency');
  if (currencyError) errors.currency = currencyError;

  const accountError = validateRequired(data.accountId, 'Destination account');
  if (accountError) errors.accountId = accountError;

  const methodError = validateRequired(data.paymentMethodId, 'Payment method');
  if (methodError) errors.paymentMethodId = methodError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBeneficiary = (data: BeneficiaryData): ValidationResult => {
  const errors: Record<string, string> = {};

  const firstnameError = validateRequired(data.firstname, 'First name');
  if (firstnameError) errors.firstname = firstnameError;

  const lastnameError = validateRequired(data.lastname, 'Last name');
  if (lastnameError) errors.lastname = lastnameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (data.iban) {
    const ibanError = validateIBAN(data.iban);
    if (ibanError) errors.iban = ibanError;
  }

  if (data.swiftCode) {
    const swiftError = validateSWIFT(data.swiftCode);
    if (swiftError) errors.swiftCode = swiftError;
  }

  if (!data.iban && !data.accountNumber) {
    errors.accountNumber = 'Either IBAN or Account Number is required';
  }

  const addressLine1Error = validateRequired(data.address?.line1, 'Address');
  if (addressLine1Error) errors['address.line1'] = addressLine1Error;

  const cityError = validateRequired(data.address?.city, 'City');
  if (cityError) errors['address.city'] = cityError;

  const countryError = validateRequired(data.address?.country, 'Country');
  if (countryError) errors['address.country'] = countryError;

  const zipcodeError = validateRequired(data.address?.zipcode, 'Postal code');
  if (zipcodeError) errors['address.zipcode'] = zipcodeError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format utilities
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatIBAN = (iban: string): string => {
  return iban.replace(/(.{4})/g, '$1 ').trim();
};

export const formatAccountNumber = (accountNumber: string): string => {
  return accountNumber.replace(/(.{4})/g, '$1 ').trim();
};