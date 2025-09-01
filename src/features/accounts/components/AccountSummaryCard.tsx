import React from 'react';
import { AccountCard } from '../../../shared/components/AccountCard';
import type { Account } from '../../../types';

interface AccountSummaryCardProps {
  accounts: Account[];
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ accounts }) => {
  // Check if we have accounts
  if (!accounts || accounts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No accounts available
      </div>
    );
  }
  
  // Create a combined account object for the Nomo Pay card
  const nomoPayAccount = {
    ...accounts[0], // Use first account as template
    name: 'Nomo Pay',
    balance: accounts.reduce((sum, acc) => sum + acc.balance, 0) // Combined balance
  };
  
  return (
    <div>
      <AccountCard account={nomoPayAccount} />
    </div>
  );
};