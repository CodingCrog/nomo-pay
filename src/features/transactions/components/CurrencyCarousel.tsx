import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { LondonEyeIcon, SupertreesIcon } from '../../../assets/icons';
import { CURRENCY_FLAGS } from '../../../constants';
import { formatCurrency } from '../../../utils';
import type { CurrencyBalance } from '../../../types';

interface CurrencyCarouselProps {
  balances: CurrencyBalance[];
  activeCurrencyCode: string;
  isGBAccount: boolean;
  onCurrencyChange: (index: number) => void;
}

export const CurrencyCarousel: React.FC<CurrencyCarouselProps> = ({
  balances,
  activeCurrencyCode,
  isGBAccount,
  onCurrencyChange,
}) => {
  const [activeCurrencyIndex, setActiveCurrencyIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const index = balances.findIndex(b => b.currency.code === activeCurrencyCode);
    if (index !== -1) {
      setActiveCurrencyIndex(index);
    }
  }, [activeCurrencyCode, balances]);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsDragging(true);
      setDragOffset(eventData.deltaX);
    },
    onSwipedLeft: () => {
      setIsDragging(false);
      setDragOffset(0);
      if (activeCurrencyIndex < balances.length - 1) {
        const newIndex = activeCurrencyIndex + 1;
        setActiveCurrencyIndex(newIndex);
        onCurrencyChange(newIndex);
      }
    },
    onSwipedRight: () => {
      setIsDragging(false);
      setDragOffset(0);
      if (activeCurrencyIndex > 0) {
        const newIndex = activeCurrencyIndex - 1;
        setActiveCurrencyIndex(newIndex);
        onCurrencyChange(newIndex);
      }
    },
    onTouchEndOrOnMouseUp: () => {
      setIsDragging(false);
      setDragOffset(0);
    },
    trackMouse: true,
    trackTouch: true,
    delta: 10,
    preventScrollOnSwipe: true,
    swipeDuration: 250,
  });

  const handleCardClick = (index: number) => {
    if (index !== activeCurrencyIndex) {
      setActiveCurrencyIndex(index);
      onCurrencyChange(index);
    }
  };

  return (
    <div className="px-4 mb-4">
      <div {...handlers} className="relative h-36 cursor-grab active:cursor-grabbing select-none">
        <AnimatePresence mode="popLayout">
          {balances.map((balance, index) => {
            const offset = index - activeCurrencyIndex;
            const isActive = index === activeCurrencyIndex;
            
            return (
              <motion.div
                key={balance.id}
                className="absolute top-0 left-0 w-full"
                style={{ touchAction: 'pan-y' }}
                initial={{ x: 300, scale: 0.95, opacity: 0 }}
                animate={{ 
                  x: isDragging && isActive ? dragOffset : offset * 20,
                  y: Math.abs(offset) * 5,
                  scale: isActive ? 1 : 0.95,
                  opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.8,
                  zIndex: balances.length - Math.abs(offset)
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  mass: 0.8,
                  opacity: { duration: 0.4, ease: "easeInOut" }
                }}
                onClick={() => handleCardClick(index)}
              >
                <CurrencyCard 
                  balance={balance}
                  isActive={isActive}
                  isGBAccount={isGBAccount}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Card Indicators */}
      {balances.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {balances.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className="rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === activeCurrencyIndex ? '#7c3aed' : '#999',
                width: index === activeCurrencyIndex ? '20px' : '6px',
                height: '6px',
                opacity: index === activeCurrencyIndex ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CurrencyCardProps {
  balance: CurrencyBalance;
  isActive: boolean;
  isGBAccount: boolean;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({ balance, isActive, isGBAccount }) => {
  const gradient = isGBAccount 
    ? `linear-gradient(135deg, ${isActive ? '#1e3c72' : '#1e3c7280'} 0%, ${isActive ? '#2a5298' : '#2a529880'} 100%)`
    : `linear-gradient(135deg, ${isActive ? '#d32f2f' : '#d32f2f80'} 0%, ${isActive ? '#f57c00' : '#f57c0080'} 100%)`;
  
  const Icon = isGBAccount ? LondonEyeIcon : SupertreesIcon;
  
  return (
    <div 
      className="relative rounded-xl overflow-hidden h-36" 
      style={{ 
        background: gradient,
        boxShadow: isActive ? '0 6px 24px rgba(0, 0, 0, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: `translateZ(${isActive ? '10px' : '0'})`,
        filter: isActive ? 'none' : 'saturate(0.7)'
      }}
    >
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <Icon />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white font-heading">
              {isGBAccount ? 'London' : 'Singapore'}
            </h3>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-white">
                {formatCurrency(balance.balance, balance.currency.code)}
              </p>
              <p className="text-sm text-white/60 mt-1">
                {balance.currency.name}
              </p>
            </div>
          </div>
          <div className="ml-4">
            <span className="text-4xl">
              {CURRENCY_FLAGS[balance.currency.code] || '💱'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};