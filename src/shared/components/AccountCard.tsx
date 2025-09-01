import React from 'react';
import type { Account } from '../../types';
import { Wifi } from 'lucide-react';
import { useBreakpoint } from '../../hooks';
import { formatCurrency } from '../../utils/formatters';

interface AccountCardProps {
  account: Account;
  onClick?: () => void;
  variant?: 'full' | 'compact';
}

export const AccountCard: React.FC<AccountCardProps> = ({ 
  account, 
  onClick
}) => {
  const breakpoint = useBreakpoint();
  
  // Responsive sizing
  const cardHeight = {
    xs: 'h-48',
    sm: 'h-52',
    md: 'h-56',
    lg: 'h-60',
    xl: 'h-64',
    '2xl': 'h-64',
  }[breakpoint];

  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';

  return (
    <div
      className={`relative ${cardHeight} rounded-2xl overflow-hidden cursor-pointer
        transform transition-all duration-300 
        ${isDesktop ? 'hover:scale-105 hover:shadow-2xl' : 'active:scale-95'}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      }}
      onClick={onClick}
    >
      {/* Background with brown color on left for wide screens */}
      <div className="absolute inset-0">
        {/* Full brown background */}
        <div 
          className="absolute inset-0 hidden lg:block"
          style={{ backgroundColor: '#574123' }}
        />
        {/* Card image - full on mobile, right-aligned on desktop */}
        <div className="absolute inset-0 lg:left-1/3">
          <img 
            src="/images/nomo_card.png" 
            alt="Card Background" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-5 md:p-6 h-full flex flex-col">
        {/* Top Row - Chip and Contactless */}
        <div className="flex justify-between items-start mb-auto">
          <div className="flex items-center gap-3">
            {/* EMV Chip */}
            <div className="w-10 h-8 rounded bg-gradient-to-br from-[#C89565] via-[#A5773A] to-[#8B6330] border border-[#A5773A]/40">
              <div className="w-full h-full rounded grid grid-cols-3 grid-rows-3 gap-px p-1">
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
                <div className="bg-[#B8925F] rounded-sm"></div>
              </div>
            </div>
            {/* Contactless Icon */}
            <Wifi className="w-5 h-5 text-white/70 rotate-90" />
          </div>
          
          <div className="text-right">
            <p className="text-white/90 text-xs font-bold uppercase tracking-wider">
              NOMOPAY
            </p>
            <p className="text-white/70 text-xs font-medium">
              {account.type === 'gb_based' ? 'GOLD' : 'PLATINUM'}
            </p>
          </div>
        </div>

        {/* Middle Section - Cardholder info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-1">
            <p className="text-white/70 text-[10px] uppercase tracking-wider">
              Card Holder
            </p>
            <p className="text-white text-sm font-semibold uppercase font-heading">
              {account.name}
            </p>
          </div>
        </div>

        {/* Bottom Section - Balance and Valid Thru */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/70 text-[10px] uppercase tracking-wider">
              Balance
            </p>
            <p className="text-white text-xl sm:text-2xl font-bold font-heading">
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-white/70 text-[10px] uppercase tracking-wider">
              Valid Thru
            </p>
            <p className="text-white text-sm font-semibold">
              12/28
            </p>
          </div>
        </div>

        {/* Hover overlay for desktop */}
        {isDesktop && (
          <div className="absolute inset-0 bg-gray-900/0 hover:bg-gray-900/5 transition-colors duration-300 rounded-2xl" />
        )}
      </div>
    </div>
  );
};