import React from 'react';
import { AccountCard } from '../../../components/AccountCard';
import type { Account } from '../../../types';

interface AccountSummaryCardProps {
  accounts: Account[];
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ accounts }) => {
  // Create a combined account object for the Nomo Pay card
  const nomoPayAccount = {
    ...accounts[0], // Use first account as template
    name: 'Nomo Pay',
    balance: accounts.reduce((sum, acc) => sum + acc.balance, 0) // Combined balance
  };
  
  return (
    <div className="mb-8">
      <AccountCard account={nomoPayAccount} />
    </div>
  );
};