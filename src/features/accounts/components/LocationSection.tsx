import React from 'react';
import { LocationCard } from './LocationCard';
import { CurrencyBalance } from '../../../components/CurrencyBalance';
import { useTheme } from '../../../context/ThemeContext';
import type { CurrencyBalance as CurrencyBalanceType } from '../../../types';

interface LocationSectionProps {
  location: 'london' | 'singapore';
  balances: CurrencyBalanceType[];
  onLocationClick?: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ 
  location, 
  balances,
  onLocationClick 
}) => {
  const { colors } = useTheme();
  
  return (
    <section className={location === 'singapore' ? 'pb-20' : 'mb-8'}>
      <LocationCard location={location} onClick={onLocationClick} />
      
      <div className="space-y-3">
        {balances.length > 0 ? (
          balances.map((balance) => (
            <div key={balance.id}>
              <CurrencyBalance balance={balance} location={location} />
            </div>
          ))
        ) : (
          <p className="text-center py-4" style={{ color: colors.foreground3 }}>
            No currencies available
          </p>
        )}
      </div>
    </section>
  );
};