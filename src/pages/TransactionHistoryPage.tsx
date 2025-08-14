import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TransactionHistory } from '../components/TransactionHistory';
import { mockTransactions } from '../data/mockData';

export const TransactionHistoryPage: React.FC = () => {
  const { accountId, currencyCode } = useParams<{ accountId: string; currencyCode: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const accountName = location.state?.accountName || 'Account';
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const accountTransactions = mockTransactions.filter(
    t => t.accountId === accountId
  );

  return (
    <TransactionHistory
      transactions={accountTransactions}
      currencyCode={currencyCode || 'EUR'}
      accountName={accountName}
      accountId={accountId}
      onBack={handleBack}
    />
  );
};