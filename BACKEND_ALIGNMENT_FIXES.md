# Backend Alignment Fixes Summary

## Overview
All API calls, queries, mutations, and data adapters have been aligned with the npay-fe backend structure.

## Key Changes Applied

### 1. Query Structure Updates ✅
**File: `/src/api/queries.ts`**
- Aligned all GraphQL fragments with npay-fe structure
- Added proper field mappings for bank accounts, transactions, currencies, and beneficiaries
- Fixed query syntax to match backend expectations

### 2. Mutation Fixes ✅
**File: `/src/api/mutations.ts`**

#### Deposit Mutation
- Changed from `create_npa_deposit` to `create_deposit`
- Updated parameters:
  - `identitybankaccount_id` → `bankaccount_id`
  - `amount: String!` → `amount: Float!`
  - Removed `transactioncurrency_id` (not needed in backend)

#### Transfer Mutation
- Changed from `create_npa_external_transfer` to `create_external_transfer`
- Updated parameters:
  - `identitybankaccount_id` → `bankaccount_id`
  - `amount: String!` → `amount: Float!`

#### Added Missing Mutations
- `mutationAcceptOrCancelFxConversion`
- `mutationMarkDepositAsPaid`
- `mutationVerifyEmail`
- `mutationClaimIdentity`
- `mutationRefreshIdentityData`

### 3. Data Adapter Updates ✅
**File: `/src/api/adapters.ts`**
- Updated all adapters to properly transform backend response fields:
  - `type_char` → `type` (with proper mapping)
  - `currency_code` → currency object
  - `firstname_txt`, `lastname_txt` → proper name fields
  - `status_txt` → status with proper mapping
  - Added error handling for all adapters

### 4. Theme Context Fixes ✅
**File: `/src/context/ThemeContext.tsx`**
- Added missing color properties:
  - `text1`: Primary text color
  - `text2`: Secondary text color
  - `border`: Border color for UI elements

### 5. Page Component Fixes ✅

#### TransferPage
- Fixed import: `mockCurrencyBalances` instead of `mockBalances`
- Fixed duplicate key warnings in currency selector
- Updated mutation variables to match backend

#### DepositPage
- Updated mutation call with correct parameters
- Removed unnecessary currency ID parameter

## Backend Structure Reference

### Bank Account Fields
```
id, created_at, type_char, account_type,
transactioncurrency { currency_code, currency_txt },
balance, available_balance
```

### Transaction Fields
```
id, created_at, updated_at, settled_at, status_txt,
request_amount, settle_amount, fee_amount,
reference_code, type_char, type_txt,
identitybankaccount { ... },
transactioncurrency { ... },
beneficiary { ... }
```

### Beneficiary Fields
```
id, created_at, accountholder_txt, accountnumber_txt,
firstname_txt, middlename_txt, lastname_txt, email_txt,
beneficiary_bank* fields, intermediate_bank* fields
```

## Testing Status

✅ All queries aligned with backend
✅ All mutations updated to match backend
✅ Data adapters properly transform responses
✅ Theme properties complete
✅ Pages rendering without errors

## API Integration Status

### Fully Implemented
- Account fetching and display
- Currency balances
- Transactions list
- Transfer functionality
- Deposit functionality
- Beneficiary management

### Ready for Backend Connection
All components are now properly aligned with the backend GraphQL schema and ready for real API integration. The application will automatically use real data when the backend is connected and falls back to mock data when offline.

## Development Server
Running on: http://localhost:5174/