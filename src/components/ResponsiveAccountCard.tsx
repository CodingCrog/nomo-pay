import React from 'react';
import type { Account } from '../types';
import { Wifi } from 'lucide-react';
import { useBreakpoint } from '../hooks';
import { formatCurrency } from '../utils';

interface ResponsiveAccountCardProps {
  account: Account;
  onClick?: () => void;
  variant?: 'full' | 'compact';
}

export const ResponsiveAccountCard: React.FC<ResponsiveAccountCardProps> = ({ 
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
        background: 'linear-gradient(135deg, #F4C430 0%, #DAA520 50%, #B8860B 100%)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      }}
      onClick={onClick}
    >
      {/* Card Background Pattern & Metallic Shine */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-200/30 blur-3xl transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-orange-300/30 blur-2xl transform -translate-x-24 translate-y-24" />
      </div>
      {/* Metallic shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-100/20 to-transparent"></div>


      {/* Content */}
      <div className="relative z-10 p-4 sm:p-5 md:p-6 h-full flex flex-col">
        {/* Top Row - Chip and Contactless */}
        <div className="flex justify-between items-start mb-auto">
          <div className="flex items-center gap-3">
            {/* EMV Chip */}
            <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 border border-yellow-500/30">
              <div className="w-full h-full rounded grid grid-cols-3 grid-rows-3 gap-px p-1">
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
                <div className="bg-yellow-400/50 rounded-sm"></div>
              </div>
            </div>
            {/* Contactless Icon */}
            <Wifi className="w-5 h-5 text-gray-800/60 rotate-90" />
          </div>
          
          <div className="text-right">
            <p className="text-gray-800/80 text-xs font-bold uppercase tracking-wider">
              NOMOPAY
            </p>
            <p className="text-gray-700/60 text-xs font-medium">
              GOLD
            </p>
          </div>
        </div>

        {/* Middle Section - Cardholder info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-1">
            <p className="text-gray-700/60 text-[10px] uppercase tracking-wider">
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
            <p className="text-gray-700/60 text-[10px] uppercase tracking-wider">
              Balance
            </p>
            <p className="text-white text-xl sm:text-2xl font-bold font-heading">
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-gray-700/60 text-[10px] uppercase tracking-wider">
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