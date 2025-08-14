import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface TransactionHeaderProps {
  accountName: string;
  onBack: () => void;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({ 
  accountName, 
  onBack 
}) => {
  const { colors } = useTheme();
  
  return (
    <div 
      className="sticky top-0 z-20 backdrop-blur-lg"
      style={{ backgroundColor: `${colors.background1}E6` }}
    >
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: colors.surface,
            color: colors.foreground1
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: colors.foreground1 }}>
            Transaction History
          </h1>
          <p className="text-sm" style={{ color: colors.foreground3 }}>
            {accountName}
          </p>
        </div>
      </div>
    </div>
  );
};