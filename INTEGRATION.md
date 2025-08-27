# NomoPay Backend Integration

This document describes how NomoPay connects to the backend API for real-time data.

## Overview

NomoPay is a self-contained React application that connects to a GraphQL backend via Socket.IO for real-time data updates. The app can work with both real backend data and fallback to mock data when the backend is unavailable.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://192.168.0.134:9015
VITE_FORCE_DEBUG=true
```

- `VITE_BACKEND_URL`: The URL of your backend server
- `VITE_FORCE_DEBUG`: Forces the app to use the configured backend URL

## Architecture

### Data Flow

1. **Socket.IO Connection**: Established automatically when the app starts via `nsw-frontend-core-lib`
2. **GraphQL Queries**: Sent through Socket.IO for real-time updates
3. **Data Loaders**: Automatically cache and update data based on Socket.IO events
4. **React Hooks**: Provide easy access to data in components

### Key Components

- `/src/api/queries.ts` - GraphQL query definitions
- `/src/api/mutations.ts` - GraphQL mutation definitions
- `/src/api/loaders.ts` - Data loader configuration with Socket.IO integration
- `/src/api/client.ts` - API client and React hooks
- `/src/api/adapters.ts` - Data transformation from GraphQL to app types
- `/src/context/DataProvider.tsx` - Initializes connections and provides data context
- `/src/hooks/useApiData.ts` - Custom hooks for accessing data

## Usage

### Using Real Data in Components

```typescript
import { useAccounts, useBalances, useTransactions } from '../hooks/useApiData';

function MyComponent() {
  const { data: accounts, loading, error } = useAccounts();
  const { data: balances } = useBalances(accountId);
  const { data: transactions } = useTransactions(accountId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  
  return (
    <div>
      {accounts.map(account => (
        <div key={account.id}>{account.name}</div>
      ))}
    </div>
  );
}
```

### Available Hooks

- `useAccounts()` - Fetch all accounts
- `useBalances(accountId?)` - Fetch balances for an account
- `useTransactions(accountId?)` - Fetch transactions
- `useCurrencies()` - Fetch available currencies
- `useBeneficiaries()` - Fetch beneficiaries
- `useAccountWithBalances(accountId)` - Combined account and balance data
- `useDashboardData()` - Dashboard summary data

## Data Types

The app uses TypeScript interfaces defined in `/src/types/`:
- `Account` - Bank account information
- `CurrencyBalance` - Balance for a specific currency
- `Transaction` - Transaction details
- `CurrencyInfo` - Currency metadata
- `Beneficiary` - Beneficiary information

## Fallback to Mock Data

When the backend is unavailable, components automatically fall back to mock data:

```typescript
const account = realAccount || mockAccounts.find(acc => acc.id === accountId);
const balances = realBalances.length > 0 ? realBalances : mockBalances;
```

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Backend Requirements

The backend must provide:
- GraphQL API via Socket.IO on the configured port
- Authentication handling (if required)
- Real-time updates via Socket.IO events

## Troubleshooting

### Loader Already Defined Error
The loaders use unique namespaces (`nomopay_*`) to prevent conflicts. If you see this error, check that loader names are unique.

### Connection Issues
1. Verify the backend URL in `.env`
2. Check if the backend server is running
3. Ensure no firewall blocks the connection
4. Check browser console for Socket.IO connection errors

### Data Not Loading
1. Check browser DevTools Network tab for Socket.IO activity
2. Verify GraphQL queries match backend schema
3. Check console for any error messages
4. Ensure loaders are properly initialized

## Dependencies

Key dependencies included:
- `@apollo/client` - GraphQL client
- `socket.io-client` - WebSocket connection
- `nsw-frontend-core-lib` - Core library for Socket.IO/GraphQL integration
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `tailwindcss` - Styling