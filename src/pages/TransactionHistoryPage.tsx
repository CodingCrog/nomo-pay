import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TransactionHistory } from '../components/TransactionHistory';
import { useTransactions } from '../api/client';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const TransactionHistoryPage: React.FC = () => {
  const { accountId, currencyCode } = useParams<{ accountId: string; currencyCode: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const accountName = location.state?.accountName || 'Account';
  
  // Use real transactions from backend
  const { data: transactions, loading } = useTransactions(accountId);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // Filter transactions by currency if specified
  const filteredTransactions = currencyCode 
    ? transactions.filter(t => t.currency === currencyCode)
    : transactions;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <TransactionHistory
      transactions={filteredTransactions}
      currencyCode={currencyCode || 'EUR'}
      accountName={accountName}
      accountId={accountId}
      onBack={handleBack}
    />
  );
};