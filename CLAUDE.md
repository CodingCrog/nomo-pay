# NomoPay Frontend

Modern banking application built with React, TypeScript, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

## Key Features

- Two account types: GB Based Account and Numbered Account
- Multi-currency support (EUR, GBP, USD, etc.)
- Real-time balance charts
- Mobile-first responsive design
- Dark mode support

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── types/           # TypeScript interfaces
├── data/            # Mock data
└── styles/          # Global styles
```

## Components

### AccountCard
Displays account information with gradient background and mini chart.
```tsx
<AccountCard account={account} onClick={handleClick} />
```

### CurrencyBalance
Shows individual currency balance with flag icon.
```tsx
<CurrencyBalance balance={balance} onClick={handleClick} />
```

### ActionButton
Reusable button with icon support.
```tsx
<ActionButton icon={Send} label="Send" variant="primary" />
```

## API Integration

Replace mock data in `src/data/mockData.ts` with actual API calls:

```typescript
// src/services/api.ts
export const fetchAccounts = async (): Promise<Account[]> => {
  const response = await axios.get('/api/accounts');
  return response.data;
};
```

## Mock Data Structure

### Account
```typescript
{
  id: string;
  name: string;
  accountNumber: string;
  type: 'numbered' | 'gb_based';
  balance: number;
  currency: string;
  availableCurrencies: Currency[];
  chartData: ChartData;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'frozen';
}
```

### CurrencyBalance
```typescript
{
  id: string;
  accountId: string;
  currency: CurrencyInfo;
  balance: number;
  available: number;
  pending: number;
}
```

## Styling

- Purple gradient theme (#7c3aed primary)
- Glass morphism effects
- Smooth animations and transitions
- Mobile-optimized with bottom navigation

## Available Routes

- `/` - Dashboard with account cards
- `/accounts` - Account overview
- `/accounts/:accountId` - Specific account details
- `/transactions` - Transaction history (placeholder)
- `/profile` - User profile (placeholder)

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Customization

### Theme Colors
Edit `tailwind.config.js` to change the purple theme:
```javascript
colors: {
  primary: {
    // Customize shades 50-900
  }
}
```

### Add New Currency
Update `mockCurrencies` in `src/data/mockData.ts`:
```typescript
{ code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimal: 2 }
```

## Next Steps

1. Implement remaining pages (Transfer, Exchange, etc.)
2. Add authentication flow
3. Connect to real banking API
4. Add transaction history
5. Implement real-time updates
6. Add push notifications
7. Enhance security features