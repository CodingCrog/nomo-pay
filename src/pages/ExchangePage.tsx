import React from 'react';
import { PlaceholderPage } from '../shared/components/PlaceholderPage';
import { ArrowLeftRight } from 'lucide-react';

export const ExchangePage: React.FC = () => {
  return (
    <PlaceholderPage 
      title="Exchange" 
      description="Convert between different currencies at competitive rates."
      icon={ArrowLeftRight}
    />
  );
};