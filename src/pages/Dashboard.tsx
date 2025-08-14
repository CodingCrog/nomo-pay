import React from 'react';
import { mockAccounts, mockCurrencyBalances } from '../data/mockData';
import { ThemeToggle } from '../features/common/components/ThemeToggle';
import { AccountSummaryCard, LocationSection } from '../features/accounts/components';

export const Dashboard: React.FC = () => {
  // Get balances for both accounts
  const londonBalances = mockCurrencyBalances.filter(
    (balance) => balance.accountId === mockAccounts[0].id
  );
  const singaporeBalances = mockCurrencyBalances.filter(
    (balance) => balance.accountId === mockAccounts[1].id
  );

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col">
      <div className="max-w-md mx-auto w-full relative z-10 flex flex-col min-h-screen">
        <div className="p-4">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>

          {/* Single Nomo Pay Card */}
          <AccountSummaryCard accounts={mockAccounts} />

          {/* London Account Section */}
          <LocationSection 
            location="london" 
            balances={londonBalances}
            onLocationClick={() => console.log('London clicked')}
          />

          {/* Singapore Account Section */}
          <LocationSection 
            location="singapore" 
            balances={singaporeBalances}
            onLocationClick={() => console.log('Singapore clicked')}
          />
        </div>
      </div>
    </div>
  );
};