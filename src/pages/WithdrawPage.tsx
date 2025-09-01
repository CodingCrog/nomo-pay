import React from 'react';
import { PlaceholderPage } from '../shared/components/PlaceholderPage';
import { ArrowUpRight } from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  return (
    <PlaceholderPage 
      title="Withdraw" 
      description="Withdraw funds from your account to external accounts."
      icon={ArrowUpRight}
    />
  );
};