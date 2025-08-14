import React from 'react';
import { Settings } from 'lucide-react';
import { LondonEyeIcon, SupertreesIcon } from '../../../assets/icons';

interface LocationCardProps {
  location: 'london' | 'singapore';
  onClick?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  const config = {
    london: {
      flag: '🇬🇧',
      title: 'London',
      gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      shadow: '0 4px 12px rgba(30, 60, 114, 0.3)',
      Icon: LondonEyeIcon,
    },
    singapore: {
      flag: '🇸🇬',
      title: 'Singapore',
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 100%)',
      shadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
      Icon: SupertreesIcon,
    },
  };
  
  const { flag, title, gradient, shadow, Icon } = config[location];
  
  return (
    <div 
      className="relative mb-4 rounded-xl overflow-hidden h-24 cursor-pointer"
      style={{ 
        background: gradient,
        boxShadow: shadow
      }}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <Icon />
      </div>
      
      <div className="relative z-10 h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <span className="text-3xl">{flag}</span>
          <div>
            <h3 className="text-2xl font-bold text-white font-heading">{title}</h3>
            <p className="text-white/70 text-sm">Account</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`${title} settings clicked`);
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <Settings size={18} className="text-white/70" />
        </button>
      </div>
    </div>
  );
};