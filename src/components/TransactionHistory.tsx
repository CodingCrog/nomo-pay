import React, { useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { ArrowLeft, Send, Download, RefreshCw, UserPlus, ArrowUpDown, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction } from '../types';
import type { Account } from '../types/account';
import type { CurrencyBalance } from '../types/currency';
import { TransactionItem } from './TransactionItem';
import { ActionButton } from './ActionButton';
import { useTheme } from '../context/ThemeContext';
import { useAccounts, useBalances } from '../core/api/client';

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
  
  // Get account and balances from API
  const { data: accounts } = useAccounts();
  const { data: balances } = useBalances(accountId);
  
  // Get the current account
  const account = accounts.find((acc: Account) => acc.id === accountId);
  const isGBAccount = account?.type === 'gb_based';
  
  // Get all currency balances for this account with non-zero balances
  const accountBalances = balances.filter(
    (balance: CurrencyBalance) => balance.balance > 0
  ).sort((a: CurrencyBalance, b: CurrencyBalance) => b.balance - a.balance); // Sort by balance descending
  
  // Set initial currency index based on currencyCode
  React.useEffect(() => {
    const index = accountBalances.findIndex((b: CurrencyBalance) => b.currency.code === currencyCode);
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
  
  // Debug logging
  console.log('TransactionHistory Debug:');
  console.log('- Account ID:', accountId);
  console.log('- Active Currency Code:', activeCurrencyCode);
  console.log('- All transactions:', transactions);
  console.log('- Transaction accountIds:', transactions.map(t => ({ id: t.id, accountId: t.accountId, currency: t.currency })));
  
  // Filter transactions by account and active currency
  const filteredTransactions = transactions
    .filter(t => {
      const matchesAccount = t.accountId === accountId;
      const matchesCurrency = t.currency === activeCurrencyCode;
      console.log(`Transaction ${t.id}: accountId match=${matchesAccount} (${t.accountId} === ${accountId}), currency match=${matchesCurrency} (${t.currency} === ${activeCurrencyCode})`);
      return matchesAccount && matchesCurrency;
    })
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
        <div className="max-w-2xl mx-auto">
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
      </div>
      
      {/* Currency Cards with Swipe */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div 
          {...handlers}
          className="relative h-36 cursor-grab active:cursor-grabbing select-none"
        >
          <AnimatePresence mode="popLayout">
            {accountBalances.map((balance: CurrencyBalance, index: number) => {
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
                         boxShadow: isActive ? '0 6px 24px rgba(0, 0, 0, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                         transform: `translateZ(${isActive ? '10px' : '0'})`,
                         filter: isActive ? 'none' : 'saturate(0.7)'
                       }}>
                    {/* Background with brown color for wide screens */}
                    <div className="absolute inset-0">
                      {/* Full brown background on desktop */}
                      <div 
                        className="absolute inset-0 hidden lg:block"
                        style={{ backgroundColor: '#966B30' }}
                      />
                      {/* Image - full on mobile, right-aligned on desktop */}
                      <div className="absolute inset-0 lg:left-1/3">
                        <img 
                          src={isGBAccount ? "/images/london_image.png" : "/images/singa_image.png"}
                          alt={isGBAccount ? "London" : "Singapore"} 
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 20%' }}
                        />
                      </div>
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-semibold text-white">
                            {balance.currency.symbol}{balance.balance.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-sm text-white/80">
                            {balance.currency.name}
                          </p>
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
            {accountBalances.map((_: CurrencyBalance, index: number) => (
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
      <div className="max-w-2xl mx-auto px-4 mb-6">
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
      <div className="max-w-2xl mx-auto px-4 pb-4 relative z-10">
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