import React from 'react';
import { useDataContext } from '../context/DataProvider';

export const ConnectionStatus: React.FC = () => {
  const { isConnected } = useDataContext();
  
  return (
    <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${
      isConnected 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }`}>
      {isConnected ? '🟢 Connected to Backend' : '🔴 Using Mock Data'}
    </div>
  );
};