import React from 'react';
import { PlaceholderPage } from '../shared/components/PlaceholderPage';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <PlaceholderPage 
      title="Settings" 
      description="Manage your app preferences and security settings."
      icon={Settings}
    />
  );
};