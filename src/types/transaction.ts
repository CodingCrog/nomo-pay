export interface Transaction {
  id: string;
  accountId: string;
  orderDate: Date;
  accountType: 'numbered' | 'gb_based';
  type: 'Funds' | 'Transfer' | 'Exchange';
  action: 'Fee' | 'Exchange' | 'Deposit' | 'Withdrawal' | 'Transfer' | 'Claim';
  amount: number;
  currency: string;
  remarks?: string;
  orderStatus: 'Processing' | 'Completed' | 'Cancelled' | 'Pending';
  balance: number;
  recipient?: string;
  description?: string;
  reference?: string;
  beneficiary?: Beneficiary;
  metadata?: Record<string, unknown>;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  bankName?: string;
  address?: Address;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId?: string;
  beneficiaryId?: string;
  amount: number;
  currency: string;
  description?: string;
  reference?: string;
}