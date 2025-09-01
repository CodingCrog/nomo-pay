import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { mutationCreateDeposit } from '../api/mutations';
import { useAccounts, useCurrencies, usePaymentMethods } from '../api/client';
import { validateDeposit, formatCurrency } from '../utils/validation';
import { LoadingSpinner, LoadingOverlay } from '../components/LoadingSpinner';
import { notificationManager } from '../utils/notificationManager';
import { useTheme } from '../context/ThemeContext';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'card' | 'crypto';
  fees: number;
  min_amount: number;
  max_amount: number;
  processing_time: string;
}

export const DepositPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  // API hooks
  const { data: accounts, loading: accountsLoading } = useAccounts();
  const { data: currencies } = useCurrencies();
  const { data: paymentMethods } = usePaymentMethods();
  
  // Use accounts from API
  const allAccounts = accounts;
  const allCurrencies = currencies;
  
  // Mock payment methods if no API data
  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      fees: 0,
      min_amount: 10,
      max_amount: 50000,
      processing_time: '1-2 business days'
    },
    {
      id: '2',
      name: 'Debit/Credit Card',
      type: 'card',
      fees: 2.5,
      min_amount: 5,
      max_amount: 5000,
      processing_time: 'Instant'
    },
    {
      id: '3',
      name: 'Crypto Deposit',
      type: 'crypto',
      fees: 0,
      min_amount: 20,
      max_amount: 100000,
      processing_time: '10-30 minutes'
    }
  ];
  
  const allPaymentMethods = paymentMethods.length > 0 ? paymentMethods : mockPaymentMethods;
  
  // Form state
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
  const [showInstructions, setShowInstructions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const selectedMethod = allPaymentMethods.find(m => m.id === selectedMethodId);
  const selectedAccount = allAccounts.find(a => a.id === selectedAccountId);
  
  // Mutation
  const [createDeposit, { loading: depositLoading }] = useMutation(mutationCreateDeposit, {
    onCompleted: () => {
      notificationManager.success(
        'Deposit Initiated', 
        `Your deposit of ${formatCurrency(parseFloat(amount), selectedCurrency)} has been initiated.`
      );
      setShowInstructions(true);
    },
    onError: (error) => {
      notificationManager.error('Deposit Failed', error.message);
    }
  });
  
  // Validation
  const handleValidation = (): boolean => {
    const validation = validateDeposit({
      amount: parseFloat(amount) || 0,
      currency: selectedCurrency,
      accountId: selectedAccountId,
      paymentMethodId: selectedMethodId
    });
    
    // Additional validation for payment method limits
    if (selectedMethod && validation.isValid) {
      const amountNum = parseFloat(amount);
      if (amountNum < selectedMethod.min_amount) {
        validation.errors.amount = `Minimum deposit is ${formatCurrency(selectedMethod.min_amount, selectedCurrency)}`;
        validation.isValid = false;
      }
      if (amountNum > selectedMethod.max_amount) {
        validation.errors.amount = `Maximum deposit is ${formatCurrency(selectedMethod.max_amount, selectedCurrency)}`;
        validation.isValid = false;
      }
    }
    
    setErrors(validation.errors);
    return validation.isValid;
  };
  
  // Submit deposit
  const handleDeposit = async () => {
    if (!handleValidation()) return;
    
    try {
      // Find the currency ID (in real app, this would come from the currencies query)
      // const currencyId = currencies.find(c => c.code === selectedCurrency)?.id || '1';
      
      await createDeposit({
        variables: {
          amount: parseFloat(amount),
          transactionmethod_id: selectedMethodId,
          bankaccount_id: selectedAccountId
        }
      });
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };
  
  const calculateFees = () => {
    if (!selectedMethod || !amount) return 0;
    const amountNum = parseFloat(amount);
    return selectedMethod.type === 'card' ? amountNum * (selectedMethod.fees / 100) : 0;
  };
  
  const totalAmount = parseFloat(amount || '0') + calculateFees();
  
  const isLoading = accountsLoading || depositLoading;
  
  // Payment method icons
  const getMethodIcon = (type: string) => {
    switch(type) {
      case 'bank_transfer':
        return <Building2 className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'crypto':
        return <Wallet className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };
  
  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ backgroundColor: colors.background1 }}>
      <div className="sticky top-0 z-10 backdrop-blur-md" style={{ backgroundColor: `${colors.background2}CC` }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.text1 }} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: colors.text1 }}>Deposit Funds</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto p-4">
        {!showInstructions ? (
          <div className="space-y-6 relative">
            <LoadingOverlay isLoading={depositLoading} text="Processing deposit..." />
            
            {/* Destination Account */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
                Deposit To Account
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className={`w-full p-3 rounded-lg border ${errors.accountId ? 'border-red-500' : ''}`}
                style={{ 
                  backgroundColor: colors.background2, 
                  borderColor: errors.accountId ? undefined : colors.border,
                  color: colors.text1
                }}
              >
                <option value="">Select an account</option>
                {allAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {account.accountNumber}
                  </option>
                ))}
              </select>
              {errors.accountId && (
                <p className="mt-1 text-sm text-red-500">{errors.accountId}</p>
              )}
            </div>
            
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
                Payment Method
              </label>
              <div className="space-y-2">
                {allPaymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`w-full p-4 rounded-lg border transition-all ${
                      selectedMethodId === method.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                    style={{ 
                      backgroundColor: selectedMethodId === method.id ? undefined : colors.background2,
                      borderColor: selectedMethodId === method.id ? undefined : colors.border,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3" style={{ color: colors.text1 }}>
                          {getMethodIcon(method.type)}
                        </div>
                        <div className="text-left">
                          <div className="font-medium" style={{ color: colors.text1 }}>
                            {method.name}
                          </div>
                          <div className="text-sm" style={{ color: colors.text2 }}>
                            {method.processing_time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm" style={{ color: colors.text2 }}>
                          {method.fees > 0 ? `${method.fees}% fee` : 'No fees'}
                        </div>
                        <div className="text-xs" style={{ color: colors.text2 }}>
                          {formatCurrency(method.min_amount, 'EUR')} - {formatCurrency(method.max_amount, 'EUR')}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.paymentMethodId && (
                <p className="mt-1 text-sm text-red-500">{errors.paymentMethodId}</p>
              )}
            </div>
            
            {/* Amount and Currency */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
                Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`flex-1 p-3 rounded-lg border ${errors.amount ? 'border-red-500' : ''}`}
                  style={{ 
                    backgroundColor: colors.background2, 
                    borderColor: errors.amount ? undefined : colors.border,
                    color: colors.text1
                  }}
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.background2, 
                    borderColor: colors.border,
                    color: colors.text1
                  }}
                >
                  {allCurrencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
              
              {selectedMethod && amount && parseFloat(amount) > 0 && (
                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.background2 }}>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: colors.text2 }}>Deposit amount:</span>
                      <span style={{ color: colors.text1 }}>
                        {formatCurrency(parseFloat(amount), selectedCurrency)}
                      </span>
                    </div>
                    {calculateFees() > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: colors.text2 }}>Processing fee:</span>
                        <span style={{ color: colors.text1 }}>
                          {formatCurrency(calculateFees(), selectedCurrency)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t" style={{ borderColor: colors.border }}>
                      <span style={{ color: colors.text1 }}>Total:</span>
                      <span style={{ color: colors.text1 }}>
                        {formatCurrency(totalAmount, selectedCurrency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Info Box */}
            {selectedMethod && (
              <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Your deposit will be processed within {selectedMethod.processing_time}. 
                      You will receive a confirmation once the funds are available in your account.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 rounded-lg border"
                style={{ 
                  borderColor: colors.border,
                  color: colors.text1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Continue'}
              </button>
            </div>
          </div>
        ) : (
          // Instructions Screen
          <div className="space-y-6">
            <div className="rounded-lg p-6" style={{ backgroundColor: colors.background2 }}>
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h2 className="text-xl font-semibold" style={{ color: colors.text1 }}>
                  Deposit Initiated
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm" style={{ color: colors.text2 }}>Account:</p>
                  <p className="font-medium" style={{ color: colors.text1 }}>
                    {selectedAccount?.name} ({selectedAccount?.accountNumber})
                  </p>
                </div>
                
                <div>
                  <p className="text-sm" style={{ color: colors.text2 }}>Amount:</p>
                  <p className="text-2xl font-bold" style={{ color: colors.text1 }}>
                    {formatCurrency(totalAmount, selectedCurrency)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm" style={{ color: colors.text2 }}>Method:</p>
                  <p className="font-medium" style={{ color: colors.text1 }}>{selectedMethod?.name}</p>
                </div>
                
                <div>
                  <p className="text-sm" style={{ color: colors.text2 }}>Processing Time:</p>
                  <p className="font-medium" style={{ color: colors.text1 }}>{selectedMethod?.processing_time}</p>
                </div>
              </div>
            </div>
            
            {selectedMethod?.type === 'bank_transfer' && (
              <div className="rounded-lg p-6" style={{ backgroundColor: colors.background2 }}>
                <h3 className="font-semibold mb-4" style={{ color: colors.text1 }}>
                  Bank Transfer Instructions
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm" style={{ color: colors.text2 }}>Bank Name:</p>
                    <p className="font-mono" style={{ color: colors.text1 }}>NomoPay Bank</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text2 }}>Account Name:</p>
                    <p className="font-mono" style={{ color: colors.text1 }}>NomoPay Holdings</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text2 }}>IBAN:</p>
                    <p className="font-mono" style={{ color: colors.text1 }}>GB82 WEST 1234 5698 7654 32</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text2 }}>SWIFT/BIC:</p>
                    <p className="font-mono" style={{ color: colors.text1 }}>WESTGB2L</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text2 }}>Reference:</p>
                    <p className="font-mono text-purple-600">DEP-{Date.now()}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Please use the exact reference number above when making the transfer
                  </p>
                </div>
              </div>
            )}
            
            {selectedMethod?.type === 'card' && (
              <div className="rounded-lg p-6" style={{ backgroundColor: colors.background2 }}>
                <h3 className="font-semibold mb-4" style={{ color: colors.text1 }}>
                  Card Payment
                </h3>
                <p style={{ color: colors.text2 }}>
                  You will be redirected to our secure payment processor to complete the transaction.
                </p>
                <button className="mt-4 w-full py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                  Proceed to Payment
                </button>
              </div>
            )}
            
            {selectedMethod?.type === 'crypto' && (
              <div className="rounded-lg p-6" style={{ backgroundColor: colors.background2 }}>
                <h3 className="font-semibold mb-4" style={{ color: colors.text1 }}>
                  Crypto Deposit Address
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm" style={{ color: colors.text2 }}>Network:</p>
                    <p className="font-medium" style={{ color: colors.text1 }}>Ethereum (ERC-20)</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: colors.text2 }}>Deposit Address:</p>
                    <p className="font-mono text-xs break-all" style={{ color: colors.text1 }}>
                      0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Only send {selectedCurrency} to this address. Sending other tokens may result in loss of funds.
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};