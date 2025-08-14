import React from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface LocationCardProps {
  location: 'london' | 'singapore';
  onClick?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  const { colors } = useTheme();
  const config = {
    london: {
      flag: '🇬🇧',
      title: 'London',
    },
    singapore: {
      flag: '🇸🇬',
      title: 'Singapore',
    },
  };
  
  const { flag, title } = config[location];
  
  return (
    <div 
      className="mb-4 flex items-center justify-between cursor-pointer relative px-4"
      onClick={onClick}
      style={{ zIndex: 10 }}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h3 className="text-xl font-bold" style={{ color: colors.foreground1 }}>{title}</h3>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl" style={{ position: 'relative', zIndex: 10 }}>{flag}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
          //TODO:
          }}
          className="p-2 rounded-lg transition-colors duration-200"
          style={{ 
            position: 'relative', 
            zIndex: 10,
            backgroundColor: colors.background1,
            color: colors.foreground3
          }}
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};