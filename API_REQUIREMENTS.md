# NomoPay Frontend API Implementation Requirements

## Executive Summary

This document outlines the requirements for completing the NomoPay frontend API integration. While the infrastructure (GraphQL, Socket.IO, data loaders) is in place, most user-facing features remain unimplemented. This document serves as a comprehensive guide for implementing all missing functionality.

## Current State Analysis

### ✅ Implemented Infrastructure

1. **Core Setup**
   - Apollo Client configured
   - Socket.IO integration via `nsw-frontend-core-lib`
   - Data loaders with real-time updates
   - QR authentication for web browsers
   - Basic routing structure

2. **Working Queries**
   - `getNpaIdentity` - User identity data
   - `getNpaIdentityBankAccounts` - Bank accounts
   - `getNpaIdentityBankTransactions` - Transaction history
   - `getNpaTransactionCurrencies` - Available currencies
   - `getNpaBeneficiaries` - Beneficiary list

3. **Defined But Unused**
   - `isLoggedIn` - Authentication status
   - `getUserSettings` - User preferences
   - All mutations (deposit, transfer, beneficiary)

### ❌ Missing Implementations

1. **All functional pages are placeholders**
2. **No mutations are connected to UI**
3. **Critical mutations not yet defined**
4. **No error handling or loading states**
5. **No form validation**

## Priority Implementation Tasks

### Phase 1: Core Banking Operations (Critical)

#### 1.1 Transfer Page Implementation
**File:** `src/pages/TransferPage.tsx`

**Requirements:**
- Create form with fields:
  - Source account selector
  - Beneficiary selector (with option to add new)
  - Amount input with currency selector
  - Description/reference fields
  - Transfer type (standard/express)
- Implement `mutationCreateExternalTransfer`
- Add form validation:
  - Minimum/maximum amounts
  - Available balance check
  - Beneficiary validation
- Show transfer preview before confirmation
- Success/failure notifications

**API Calls Needed:**
```typescript
// Use existing mutation
mutationCreateExternalTransfer(
  amount: String!,
  transactioncurrency_id: String!,
  identitybankaccount_id: String!,
  beneficiary_id: String!,
  description: String,
  reference: String
)
```

#### 1.2 Deposit Page Implementation
**File:** `src/pages/DepositPage.tsx`

**Requirements:**
- Deposit method selector (bank transfer, card, crypto)
- Amount input with currency selector
- Account selector for destination
- Payment method details form
- Deposit instructions display
- Transaction status tracking

**API Calls Needed:**
```typescript
// Use existing mutation
mutationCreateDeposit(
  amount: String!,
  transactioncurrency_id: String!,
  transactionmethod_id: String!,
  identitybankaccount_id: String!
)

// Add new query for payment methods
query getPaymentMethods {
  npa_payment_methods {
    id
    name
    type
    fees
    min_amount
    max_amount
    processing_time
  }
}
```

#### 1.3 Withdrawal Page Implementation
**File:** `src/pages/WithdrawPage.tsx`

**Requirements:**
- Source account selector
- Withdrawal method selector
- Destination details (bank account/card)
- Amount input with fee calculation
- Withdrawal limits display
- Two-factor authentication if required

**New Mutation Needed:**
```typescript
mutation createWithdrawal(
  $amount: String!,
  $transactioncurrency_id: String!,
  $identitybankaccount_id: String!,
  $withdrawal_method: String!,
  $destination_details: JSON
) {
  create_npa_withdrawal(
    amount: $amount,
    transactioncurrency_id: $transactioncurrency_id,
    identitybankaccount_id: $identitybankaccount_id,
    withdrawal_method: $withdrawal_method,
    destination_details: $destination_details
  )
}
```

### Phase 2: Account Management

#### 2.1 Beneficiaries Page
**File:** `src/pages/BeneficiariesPage.tsx`

**Requirements:**
- List view with search/filter
- Add new beneficiary form
- Edit existing beneficiary
- Delete with confirmation
- Beneficiary validation (IBAN, SWIFT)
- Recent transactions per beneficiary

**Features to Implement:**
- CRUD operations using `mutationCreateNpaBeneficiary`
- Add update and delete mutations
- Implement search functionality
- Add beneficiary categories/tags

#### 2.2 Exchange Page
**File:** `src/pages/ExchangePage.tsx`

**Requirements:**
- Currency pair selector
- Live exchange rate display
- Amount calculator (from/to)
- Fee transparency
- Exchange preview
- Transaction history for exchanges

**New APIs Needed:**
```typescript
// Query for exchange rates
query getExchangeRates($from: String!, $to: String!) {
  npa_exchange_rate(from: $from, to: $to) {
    rate
    fee
    timestamp
    min_amount
    max_amount
  }
}

// Mutation for currency exchange
mutation createCurrencyExchange(
  $from_account_id: String!,
  $to_account_id: String!,
  $from_amount: String!,
  $from_currency: String!,
  $to_currency: String!
) {
  create_npa_exchange(...)
}
```

#### 2.3 Receive Page
**File:** `src/pages/ReceivePage.tsx`

**Requirements:**
- Display account details (IBAN, SWIFT, etc.)
- QR code generation for account details
- Share functionality
- Multiple format support (domestic/international)
- Copy to clipboard for all fields

### Phase 3: Enhanced Features

#### 3.1 Internal Transfers
**New Feature**

**Requirements:**
- Transfer between user's own accounts
- Instant processing
- No fees
- Currency conversion if needed

**New Mutation:**
```typescript
mutation createInternalTransfer(
  $from_account_id: String!,
  $to_account_id: String!,
  $amount: String!,
  $currency: String!
) {
  create_npa_internal_transfer(...)
}
```

#### 3.2 Recurring Payments
**New Feature**

**Requirements:**
- Schedule recurring transfers
- Frequency options (daily/weekly/monthly)
- Start/end dates
- Amount and beneficiary management
- Notification preferences

#### 3.3 Transaction Management
**Enhancement**

**Requirements:**
- Cancel pending transactions
- Transaction search and filters
- Export functionality (PDF/CSV)
- Transaction categories
- Notes and tags

**New APIs:**
```typescript
mutation cancelTransaction($transaction_id: String!) {
  cancel_npa_transaction(transaction_id: $transaction_id)
}

query searchTransactions(
  $account_id: String,
  $date_from: DateTime,
  $date_to: DateTime,
  $min_amount: Float,
  $max_amount: Float,
  $status: String,
  $type: String
) {
  search_npa_transactions(...)
}
```

### Phase 4: User Settings & Security

#### 4.1 Settings Page
**File:** `src/pages/SettingsPage.tsx`

**Requirements:**
- Profile management
- Security settings (2FA, passwords)
- Notification preferences
- Display preferences (theme, language)
- Account preferences

**APIs Needed:**
```typescript
mutation updateUserSettings(
  $language: String,
  $currency: String,
  $theme: String,
  $notifications: JSON
) {
  update_user_settings(...)
}

mutation enableTwoFactor($method: String!) {
  enable_two_factor(method: $method)
}
```

#### 4.2 Analytics Page
**File:** `src/pages/AnalyticsPage.tsx`

**Requirements:**
- Spending analysis by category
- Income vs expenses
- Currency breakdown
- Monthly/yearly trends
- Export reports

**New Query:**
```typescript
query getAnalytics(
  $account_id: String,
  $period: String!,
  $group_by: String
) {
  npa_analytics(...)
}
```

## Technical Implementation Guidelines

### 1. Error Handling Pattern

Every API call should follow this pattern:

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await mutate({
      variables: { ... }
    });
    
    // Handle success
    showNotification('Success!');
    // Navigate or update state
    
  } catch (err) {
    setError(err.message);
    showNotification('Error: ' + err.message, 'error');
  } finally {
    setLoading(false);
  }
};
```

### 2. Form Validation

Implement validation before API calls:

```typescript
const validateTransfer = (data: TransferData): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (data.amount > availableBalance) {
    errors.amount = 'Insufficient funds';
  }
  
  if (!data.beneficiary_id) {
    errors.beneficiary = 'Please select a beneficiary';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};
```

### 3. Loading States

Use consistent loading indicators:

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      <span className="ml-3">Processing...</span>
    </div>
  );
}
```

### 4. Real-time Updates

Leverage Socket.IO for real-time updates:

```typescript
useEffect(() => {
  const handleBalanceUpdate = (data: any) => {
    // Update local state with new balance
    refetch();
  };
  
  onEvent('balance_updated', handleBalanceUpdate);
  
  return () => {
    offEvent('balance_updated', handleBalanceUpdate);
  };
}, []);
```

## Testing Requirements

### Unit Tests
- Form validation logic
- Data transformation functions
- Error handling

### Integration Tests
- API call workflows
- Socket.IO events
- Data loader updates

### E2E Tests
- Complete user workflows (deposit, transfer, withdraw)
- Error scenarios
- Edge cases (network issues, timeouts)

## Success Criteria

### Functional Requirements
- [ ] All placeholder pages replaced with functional implementations
- [ ] All existing mutations connected to UI
- [ ] New mutations created and implemented for missing features
- [ ] Real-time updates working via Socket.IO
- [ ] Proper error handling throughout

### Non-Functional Requirements
- [ ] Response time < 2 seconds for all operations
- [ ] Graceful degradation when backend unavailable
- [ ] Mobile-responsive on all pages
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Loading states for all async operations

### Security Requirements
- [ ] Input validation on all forms
- [ ] XSS prevention
- [ ] Secure storage of sensitive data
- [ ] Proper authentication flow
- [ ] Rate limiting awareness

## Implementation Order

1. **Week 1-2:** Core banking operations (Transfer, Deposit, Withdraw)
2. **Week 3:** Beneficiaries and Exchange
3. **Week 4:** Internal transfers and recurring payments
4. **Week 5:** Settings and security features
5. **Week 6:** Analytics and reporting
6. **Week 7:** Testing and bug fixes
7. **Week 8:** Documentation and deployment

## Notes for Implementation

1. **Always check for existing mock data patterns** in `src/data/` to maintain consistency
2. **Use TypeScript interfaces** from `src/types/` for type safety
3. **Follow existing UI patterns** for consistency
4. **Test with both real and mock data** to ensure fallback works
5. **Document any new GraphQL queries/mutations** in this file
6. **Update CLAUDE.md** with any new patterns or conventions

## Appendix: GraphQL Schema Updates Needed

### New Queries
```graphql
type Query {
  # Payment and withdrawal methods
  npa_payment_methods: [PaymentMethod]
  npa_withdrawal_methods: [WithdrawalMethod]
  
  # Exchange rates
  npa_exchange_rate(from: String!, to: String!): ExchangeRate
  
  # Analytics
  npa_analytics(account_id: String, period: String!, group_by: String): Analytics
  
  # Transaction search
  search_npa_transactions(filters: TransactionFilters): [Transaction]
  
  # Recurring payments
  npa_recurring_payments: [RecurringPayment]
}
```

### New Mutations
```graphql
type Mutation {
  # Withdrawals
  create_npa_withdrawal(input: WithdrawalInput): Transaction
  
  # Currency exchange
  create_npa_exchange(input: ExchangeInput): Transaction
  
  # Internal transfers
  create_npa_internal_transfer(input: InternalTransferInput): Transaction
  
  # Transaction management
  cancel_npa_transaction(transaction_id: String!): Boolean
  
  # Recurring payments
  create_npa_recurring_payment(input: RecurringPaymentInput): RecurringPayment
  update_npa_recurring_payment(id: String!, input: RecurringPaymentInput): RecurringPayment
  delete_npa_recurring_payment(id: String!): Boolean
  
  # User settings
  update_user_settings(input: UserSettingsInput): UserSettings
  enable_two_factor(method: String!): TwoFactorSetup
  
  # Beneficiary management
  update_npa_beneficiary(id: String!, input: BeneficiaryInput): Beneficiary
  delete_npa_beneficiary(id: String!): Boolean
}
```

---

*Last Updated: [Current Date]*
*Version: 1.0*
*Author: Claude (AI Assistant)*