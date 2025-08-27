# Transfer Page Fixes Summary

## Issues Fixed

### 1. ❌ Import Error - mockBalances
**Problem**: Import was using `mockBalances` but file exports `mockCurrencyBalances`
**Fix**: Changed import to use correct export name

### 2. ❌ Duplicate Key Warning
**Problem**: Multiple currencies with same code caused React warning
**Fix**: Added index to key to make them unique: `key="${balance.currency.code}-${index}"`

### 3. ❌ Empty Transfer Page
**Root Cause**: Theme context was missing required color properties
**Fix**: Added missing properties to ThemeColors interface and both color schemes:
- `text1`: Primary text color
- `text2`: Secondary text color  
- `border`: Border color

### 4. ❌ Wrong Mutation Structure
**Problem**: Mutation parameters didn't match backend expectations from npay-fe
**Fixes Applied**:
- Changed `create_npa_external_transfer` to `create_external_transfer`
- Changed parameter `identitybankaccount_id` to `bankaccount_id`
- Changed amount from `String` to `Float`
- Removed description and reference parameters (not in npay-fe version)
- Added `result` and `error` return fields to all mutations

## Updated Files

### `/src/api/mutations.ts`
```typescript
// Before:
mutation(
  $identitybankaccount_id: String!,
  $amount: String!,
  $description: String,
  $reference: String,
) {
  create_npa_external_transfer(...)
}

// After:
mutation (
  $bankaccount_id: String!,
  $amount: Float!,
) {
  create_external_transfer(...) {
    result
    error
  }
}
```

### `/src/context/ThemeContext.tsx`
Added missing color properties that Transfer page was trying to use:
```typescript
interface ThemeColors {
  // ... existing colors
  text1: string;  // Added
  text2: string;  // Added
  border: string; // Added
}
```

### `/src/pages/TransferPage.tsx`
- Fixed import: `mockCurrencyBalances` instead of `mockBalances`
- Fixed duplicate keys in currency selector
- Added fallback currencies when no account selected
- Updated mutation variables to match backend
- Removed references to non-existent theme properties

## Result

✅ Transfer page now renders without errors
✅ No more duplicate key warnings
✅ Mutation structure matches backend expectations
✅ Theme properties are properly defined
✅ Page handles both API data and mock data fallback

## Testing Notes

The Transfer page should now:
1. Load without console errors
2. Show account and beneficiary dropdowns
3. Display currency options (default EUR, GBP, USD when no account selected)
4. Submit transfers with correct mutation parameters
5. Work in both light and dark themes