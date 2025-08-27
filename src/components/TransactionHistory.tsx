import React, { useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { ArrowLeft, Send, Download, RefreshCw, UserPlus, ArrowUpDown, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction } from '../types';
import { TransactionItem } from './TransactionItem';
import { ActionButton } from './ActionButton';
import { useTheme } from '../context/ThemeContext';
import { mockAccounts, mockCurrencyBalances } from '../data/mockData';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currencyCode: string;
  accountName: string;
  accountId?: string;
  onBack?: () => void;
}

const currencyFlags: Record<string, string> = {
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  USD: '🇺🇸',
  CHF: '🇨🇭',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  SGD: '🇸🇬',
  HKD: '🇭🇰',
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  currencyCode,
  accountName,
  accountId,
  onBack 
}) => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [activeCurrencyIndex, setActiveCurrencyIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Get the current account
  const account = mockAccounts.find(acc => acc.id === accountId);
  const isGBAccount = account?.type === 'gb_based';
  
  // Get all currency balances for this account with non-zero balances
  const accountBalances = mockCurrencyBalances.filter(
    (balance) => balance.accountId === accountId && balance.balance > 0
  ).sort((a, b) => b.balance - a.balance); // Sort by balance descending
  
  // Set initial currency index based on currencyCode
  React.useEffect(() => {
    const index = accountBalances.findIndex(b => b.currency.code === currencyCode);
    if (index !== -1) {
      setActiveCurrencyIndex(index);
    }
  }, [currencyCode]);
  
  const activeBalance = accountBalances[activeCurrencyIndex];
  const activeCurrencyCode = activeBalance?.currency.code || currencyCode;
  
  // Swipe handlers
  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsDragging(true);
      setDragOffset(eventData.deltaX);
    },
    onSwipedLeft: () => {
      setIsDragging(false);
      setDragOffset(0);
      if (activeCurrencyIndex < accountBalances.length - 1) {
        setActiveCurrencyIndex(prev => prev + 1);
      }
    },
    onSwipedRight: () => {
      setIsDragging(false);
      setDragOffset(0);
      if (activeCurrencyIndex > 0) {
        setActiveCurrencyIndex(prev => prev - 1);
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
  
  // Filter transactions by account and active currency
  const filteredTransactions = transactions
    .filter(t => t.accountId === accountId && t.currency === activeCurrencyCode)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const dateKey = format(date, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
  
  const formatDateHeader = (date: Date) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) {
      return 'Today';
    } else if (isYesterday(dateObj)) {
      return 'Yesterday';
    } else {
      return format(dateObj, 'dd MMMM yyyy');
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
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
              {account?.name || accountName}
            </p>
          </div>
        </div>
      </div>
      
      {/* Currency Cards with Swipe */}
      <div className="px-4 mb-4">
        <div 
          {...handlers}
          className="relative h-36 cursor-grab active:cursor-grabbing select-none"
        >
          <AnimatePresence mode="popLayout">
            {accountBalances.map((balance, index) => {
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
                    zIndex: accountBalances.length - Math.abs(offset)
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 25,
                    mass: 0.8,
                    opacity: { duration: 0.4, ease: "easeInOut" }
                  }}
                  onClick={() => {
                    if (index !== activeCurrencyIndex) {
                      setActiveCurrencyIndex(index);
                    }
                  }}
                >
                  {/* Currency Card */}
                  <div className="relative rounded-xl overflow-hidden h-36" 
                       style={{ 
                         background: isGBAccount 
                           ? `linear-gradient(135deg, ${isActive ? '#1e3c72' : '#1e3c7280'} 0%, ${isActive ? '#2a5298' : '#2a529880'} 100%)`
                           : `linear-gradient(135deg, ${isActive ? '#d32f2f' : '#d32f2f80'} 0%, ${isActive ? '#f57c00' : '#f57c0080'} 100%)`,
                         boxShadow: isActive ? '0 6px 24px rgba(0, 0, 0, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                         transform: `translateZ(${isActive ? '10px' : '0'})`,
                         filter: isActive ? 'none' : 'saturate(0.7)'
                       }}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice">
                        {isGBAccount ? (
                          <>
                            {/* London Eye - Centered */}
                            <g transform="translate(200, 50) scale(0.7)">
                              {/* Main wheel */}
                              <circle cx="0" cy="0" r="35" stroke="white" strokeWidth="2" fill="none" opacity="0.4"/>
                              {/* Inner circle */}
                              <circle cx="0" cy="0" r="30" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
                              {/* Hub */}
                              <circle cx="0" cy="0" r="4" fill="white" opacity="0.5"/>
                              {/* Spokes */}
                              <g opacity="0.3">
                                <line x1="0" y1="0" x2="0" y2="-35" stroke="white" strokeWidth="1.5"/>
                                <line x1="0" y1="0" x2="25" y2="-25" stroke="white" strokeWidth="1.5"/>
                                <line x1="0" y1="0" x2="35" y2="0" stroke="white" strokeWidth="1.5"/>
                                <line x1="0" y1="0" x2="25" y2="25" stroke="white" strokeWidth="1.5"/>
                                <line x1="0" y1="0" x2="0" y2="35" stroke="white" strokeWidth="1.5"/>
                                <line x1="0" y1="0" x2="-25" y2="25" stroke="white" strokeWidth="1.5"/>
                                <line x1="0" y1="0" x2="-35" y2="0" stroke="white" strokeWidth="1.5"/>
                                <line x1="0" y1="0" x2="-25" y2="-25" stroke="white" strokeWidth="1.5"/>
                              </g>
                              {/* Capsules */}
                              <rect x="-3" y="-38" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              <rect x="22" y="-28" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              <rect x="32" y="-3" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              <rect x="22" y="22" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              <rect x="-3" y="32" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              <rect x="-28" y="22" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              <rect x="-38" y="-3" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              <rect x="-28" y="-28" width="6" height="4" rx="1" fill="white" opacity="0.4"/>
                              {/* Support structure */}
                              <line x1="0" y1="35" x2="-15" y2="50" stroke="white" strokeWidth="2" opacity="0.3"/>
                              <line x1="0" y1="35" x2="15" y2="50" stroke="white" strokeWidth="2" opacity="0.3"/>
                            </g>
                          </>
                        ) : (
                          <>
                            {/* Gardens by the Bay Supertrees - Centered */}
                            <g transform="translate(200, 20) scale(1)">
                              {/* Supertree 1 - Large */}
                              <g transform="translate(0, 0)">
                                {/* Trunk */}
                                <path d="M-3,60 L-2,30 L2,30 L3,60" fill="white" opacity="0.4"/>
                                {/* Canopy structure */}
                                <ellipse cx="0" cy="25" rx="15" ry="8" fill="white" opacity="0.4"/>
                                <ellipse cx="0" cy="20" rx="12" ry="6" fill="white" opacity="0.3"/>
                                <ellipse cx="0" cy="15" rx="8" ry="4" fill="white" opacity="0.3"/>
                                {/* Branch details */}
                                <path d="M0,30 L-10,25 M0,30 L10,25 M0,28 L-8,23 M0,28 L8,23" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                                {/* Garden elements */}
                                <circle cx="-8" cy="22" r="2" fill="white" opacity="0.2"/>
                                <circle cx="8" cy="22" r="2" fill="white" opacity="0.2"/>
                                <circle cx="0" cy="18" r="2" fill="white" opacity="0.2"/>
                              </g>
                            </g>
                          </>
                        )}
                      </svg>
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-center px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white font-heading">
                            {isGBAccount ? 'London' : 'Singapore'}
                          </h3>
                          <div className="mt-2">
                            <p className="text-2xl font-semibold text-white">
                              {balance.currency.symbol}{balance.balance.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-sm text-white/60 mt-1">
                              {balance.currency.name}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="text-4xl">
                            {currencyFlags[balance.currency.code] || '💱'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Card Indicators */}
        {accountBalances.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {accountBalances.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCurrencyIndex(index)}
                className="rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === activeCurrencyIndex ? colors.primary : colors.foreground3,
                  width: index === activeCurrencyIndex ? '20px' : '6px',
                  height: '6px',
                  opacity: index === activeCurrencyIndex ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {isGBAccount ? (
            <>
              <ActionButton
                icon={ArrowUpDown}
                label="Internal Transfer"
                onClick={() => navigate('/internal-transfer')}
                variant="primary"
                className="text-sm"
              />
              <ActionButton
                icon={Send}
                label="Transfer"
                onClick={() => navigate('/transfer')}
                variant="secondary"
              />
              <ActionButton
                icon={RefreshCw}
                label="Exchange"
                onClick={() => navigate('/exchange')}
                variant="outline"
              />
              <ActionButton
                icon={Upload}
                label="Crypto Top-Up"
                onClick={() => navigate('/crypto-topup')}
                variant="outline"
              />
              <ActionButton
                icon={UserPlus}
                label="Beneficiary List"
                onClick={() => navigate('/beneficiaries')}
                variant="outline"
                className="col-span-2"
              />
            </>
          ) : (
            <>
              <ActionButton
                icon={Send}
                label="Send"
                onClick={() => navigate('/transfer')}
                variant="primary"
              />
              <ActionButton
                icon={Download}
                label="Receive"
                onClick={() => navigate('/receive')}
                variant="secondary"
              />
              <ActionButton
                icon={RefreshCw}
                label="Exchange"
                onClick={() => navigate('/exchange')}
                variant="outline"
              />
              <ActionButton
                icon={UserPlus}
                label="Beneficiaries"
                onClick={() => navigate('/beneficiaries')}
                variant="outline"
              />
            </>
          )}
        </div>
      </div>
      
      {/* Transaction List */}
      <div className="px-4 pb-4 relative z-10">
        {Object.entries(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
            <div key={dateKey} className="mb-6">
              <h2 
                className="text-xs font-medium mb-3 px-1"
                style={{ color: colors.foreground3 }}
              >
                {formatDateHeader(new Date(dayTransactions[0].date))}
              </h2>
              <div className="space-y-2">
                {dayTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => console.log('Transaction clicked:', transaction)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p style={{ color: colors.foreground3 }}>
              No transactions found for {activeCurrencyCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};