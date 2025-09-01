export interface Transaction {
  id: string;
  accountId: string;
  date: Date;  // Primary date field from backend
  orderDate?: Date; // Keep for backward compatibility
  accountType?: 'numbered' | 'gb_based';
  type: 'Funds' | 'Transfer' | 'Exchange';
  action?: 'Fee' | 'Exchange' | 'Deposit' | 'Withdrawal' | 'Transfer' | 'Claim';
  amount: number;
  currency: string;
  remarks?: string;
  status: 'processing' | 'completed' | 'cancelled' | 'pending' | 'failed';
  orderStatus?: 'Processing' | 'Completed' | 'Cancelled' | 'Pending'; // Keep for backward compatibility
  balance?: number;
  recipient?: string;
  description: string;  // Made required as backend always provides it
  reference?: string;
  beneficiary?: {
    name: string;
    account?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface SimpleBeneficiary {
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