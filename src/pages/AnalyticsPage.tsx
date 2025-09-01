import React from 'react';
import { PlaceholderPage } from '../shared/components/PlaceholderPage';
import { TrendingUp } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <PlaceholderPage 
      title="Analytics" 
      description="View detailed insights and trends about your finances."
      icon={TrendingUp}
    />
  );
};