import type { Transaction } from '../types';

const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate sample transactions for testing
  const transactionTemplates = [
    { type: 'Transfer', action: 'Transfer', remarks: 'Payment to supplier', amount: -150.00 },
    { type: 'Funds', action: 'Claim', remarks: 'Monthly claim', amount: 417.50 },
    { type: 'Funds', action: 'Fee', remarks: 'Fee Exchange', amount: -5.20 },
    { type: 'Funds', action: 'Exchange', remarks: 'Exchange Rate: Pending', amount: -10.00 },
    { type: 'Funds', action: 'Deposit', remarks: 'Deposit Fund (SWIFT)', amount: 1000.00 },
    { type: 'Transfer', action: 'Transfer', remarks: 'Internal transfer', amount: -200.00 },
    { type: 'Funds', action: 'Claim', remarks: 'Recurring claim', amount: 325.00 },
  ];
  
  // Generate transactions for both accounts
  ['1', '2'].forEach(accountId => {
    const currencies = accountId === '1' ? ['EUR', 'GBP'] : ['EUR', 'USD', 'GBP'];
    
    currencies.forEach(currency => {
      transactionTemplates.forEach((template, index) => {
        const daysAgo = Math.floor(Math.random() * 30);
        const orderDate = new Date(now);
        orderDate.setDate(orderDate.getDate() - daysAgo);
        orderDate.setHours(Math.floor(Math.random() * 24));
        orderDate.setMinutes(Math.floor(Math.random() * 60));
        
        transactions.push({
          id: `${accountId}-${currency}-${index}`,
          accountId,
          orderDate,
          accountType: accountId === '1' ? 'gb_based' : 'numbered',
          type: template.type as 'Transfer' | 'Funds' | 'Exchange',
          action: template.action as 'Fee' | 'Exchange' | 'Deposit' | 'Withdrawal' | 'Transfer' | 'Claim',
          amount: template.amount * (Math.random() * 2 + 0.5), // Add some variation
          currency,
          remarks: template.remarks,
          orderStatus: Math.random() > 0.1 ? 'Completed' : 'Processing',
          balance: Math.random() * 5000 + 1000,
          recipient: template.type === 'Transfer' ? `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}` : undefined,
        });
      });
    });
  });
  
  return transactions.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
};

export const mockTransactions: Transaction[] = generateTransactions();