import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, UserPlus, AlertCircle } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { mutationCreateExternalTransfer } from '../api/mutations';
import { useAccounts, useBalances, useBeneficiaries, useCurrencies } from '../api/client';
import { validateTransfer, formatCurrency } from '../utils/validation';
import { LoadingSpinner, LoadingOverlay } from '../components/LoadingSpinner';
import { notificationManager } from '../utils/notificationManager';
import { useTheme } from '../context/ThemeContext';
import type { SimpleBeneficiary } from '../types';
import { TransferPageDebug } from '../components/TransferPageDebug';

export const TransferPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  // API hooks
  const { data: accounts, loading: accountsLoading } = useAccounts();
  const { data: beneficiaries, loading: beneficiariesLoading } = useBeneficiaries();
  const { data: currencies = [] } = useCurrencies();
  
  // Debug logging
  console.log('TransferPage - Accounts:', accounts);
  console.log('TransferPage - Beneficiaries:', beneficiaries);
  console.log('TransferPage - Currencies:', currencies);
  
  // Use accounts from API
  const allAccounts = accounts;
  
  // Form state
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
  const [description, setDescription] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get balances for selected account
  const { data: balances } = useBalances(selectedAccountId);
  const accountBalances = balances;
  
  // Find selected currency balance
  const selectedBalance = accountBalances.find(b => b.currency.code === selectedCurrency);
  const availableBalance = selectedBalance?.available || 0;
  
  // Mutation
  const [createTransfer, { loading: transferLoading }] = useMutation(mutationCreateExternalTransfer, {
    onCompleted: () => {
      notificationManager.success('Transfer Successful', `Your transfer of ${formatCurrency(parseFloat(amount), selectedCurrency)} has been sent.`);
      navigate('/');
    },
    onError: (error) => {
      notificationManager.error('Transfer Failed', error.message);
    }
  });
  
  // Mock beneficiaries if no API data
  const mockBeneficiaries: Beneficiary[] = [
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      bankName: 'Example Bank',
      accountNumber: 'GB12XXXX12345678',
      iban: 'GB12XXXX12345678',
      swiftCode: 'EXMPGB2L'
    },
    {
      id: '2',
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane.smith@example.com',
      bankName: 'Another Bank',
      accountNumber: 'DE89370400440532013000',
      iban: 'DE89370400440532013000',
      swiftCode: 'DEUTDEFF'
    }
  ];
  
  const allBeneficiaries = beneficiaries.length > 0 ? beneficiaries : mockBeneficiaries;
  
  // Validation
  const handleValidation = (): boolean => {
    const validation = validateTransfer({
      sourceAccountId: selectedAccountId,
      beneficiaryId: selectedBeneficiaryId,
      amount: parseFloat(amount) || 0,
      currency: selectedCurrency,
      description,
      reference
    }, availableBalance);
    
    setErrors(validation.errors);
    return validation.isValid;
  };
  
  // Preview transfer
  const handlePreview = () => {
    if (handleValidation()) {
      setShowPreview(true);
    }
  };
  
  // Execute transfer
  const handleTransfer = async () => {
    if (!handleValidation()) return;
    
    try {
      // Find the currency ID (in real app, this would come from the currencies query)
      const currencyId = currencies?.find((c: any) => c.code === selectedCurrency)?.id || '1';
      
      await createTransfer({
        variables: {
          amount: parseFloat(amount),
          transactioncurrency_id: currencyId,
          bankaccount_id: selectedAccountId,
          beneficiary_id: selectedBeneficiaryId
        }
      });
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };
  
  const selectedAccount = allAccounts.find(a => a.id === selectedAccountId);
  const selectedBeneficiary = allBeneficiaries.find(b => b.id === selectedBeneficiaryId);
  
  const isLoading = accountsLoading || beneficiariesLoading || transferLoading;
  
  return (
    <div className="min-h-screen pb-20 lg:pb-0" style={{ backgroundColor: colors.background1 }}>
      <TransferPageDebug />
      <div className="sticky top-0 z-10 backdrop-blur-md" style={{ backgroundColor: `${colors.background2}CC` }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.text1 }} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: colors.text1 }}>Transfer Money</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto p-4">
        {!showPreview ? (
          <div className="space-y-6">
            {/* Source Account */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
                From Account
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className={`w-full p-3 rounded-lg border ${errors.sourceAccountId ? 'border-red-500' : ''}`}
                style={{ 
                  backgroundColor: colors.background2, 
                  borderColor: errors.sourceAccountId ? undefined : colors.border,
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
              {errors.sourceAccountId && (
                <p className="mt-1 text-sm text-red-500">{errors.sourceAccountId}</p>
              )}
              {selectedAccount && selectedBalance && (
                <p className="mt-2 text-sm" style={{ color: colors.text2 }}>
                  Available: {formatCurrency(availableBalance, selectedCurrency)}
                </p>
              )}
            </div>
            
            {/* Beneficiary */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
                To Beneficiary
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedBeneficiaryId}
                  onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                  className={`flex-1 p-3 rounded-lg border ${errors.beneficiaryId ? 'border-red-500' : ''}`}
                  style={{ 
                    backgroundColor: colors.background2, 
                    borderColor: errors.beneficiaryId ? undefined : colors.border,
                    color: colors.text1
                  }}
                >
                  <option value="">Select a beneficiary</option>
                  {allBeneficiaries.map(beneficiary => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.firstname} {beneficiary.lastname} - {beneficiary.bankName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => navigate('/beneficiaries')}
                  className="p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
              {errors.beneficiaryId && (
                <p className="mt-1 text-sm text-red-500">{errors.beneficiaryId}</p>
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
                  {accountBalances.length > 0 ? (
                    accountBalances.map((balance, index) => (
                      <option key={`${balance.currency.code}-${index}`} value={balance.currency.code}>
                        {balance.currency.code}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                    </>
                  )}
                </select>
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment for..."
                className="w-full p-3 rounded-lg border"
                style={{ 
                  backgroundColor: colors.background2, 
                  borderColor: colors.border,
                  color: colors.text1
                }}
              />
            </div>
            
            {/* Reference */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
                Reference (Optional)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Invoice #123"
                className="w-full p-3 rounded-lg border"
                style={{ 
                  backgroundColor: colors.background2, 
                  borderColor: colors.border,
                  color: colors.text1
                }}
              />
            </div>
            
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
                onClick={handlePreview}
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Preview Transfer'}
              </button>
            </div>
          </div>
        ) : (
          // Preview Screen
          <div className="space-y-6 relative">
            <LoadingOverlay isLoading={transferLoading} text="Processing transfer..." />
            
            <div className="rounded-lg p-6" style={{ backgroundColor: colors.background2 }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text1 }}>
                Transfer Preview
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span style={{ color: colors.text2 }}>From:</span>
                  <span style={{ color: colors.text1 }}>{selectedAccount?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: colors.text2 }}>To:</span>
                  <span style={{ color: colors.text1 }}>
                    {selectedBeneficiary?.firstname} {selectedBeneficiary?.lastname}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: colors.text2 }}>Amount:</span>
                  <span className="text-xl font-semibold" style={{ color: colors.text1 }}>
                    {formatCurrency(parseFloat(amount), selectedCurrency)}
                  </span>
                </div>
                
                {description && (
                  <div className="flex justify-between">
                    <span style={{ color: colors.text2 }}>Description:</span>
                    <span style={{ color: colors.text1 }}>{description}</span>
                  </div>
                )}
                
                {reference && (
                  <div className="flex justify-between">
                    <span style={{ color: colors.text2 }}>Reference:</span>
                    <span style={{ color: colors.text1 }}>{reference}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                  <div className="flex justify-between">
                    <span style={{ color: colors.text2 }}>Transfer Fee:</span>
                    <span style={{ color: colors.text1 }}>Free</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span style={{ color: colors.text2 }}>Total:</span>
                    <span className="text-xl font-semibold" style={{ color: colors.text1 }}>
                      {formatCurrency(parseFloat(amount), selectedCurrency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Please review your transfer details carefully. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                disabled={transferLoading}
                className="flex-1 py-3 rounded-lg border"
                style={{ 
                  borderColor: colors.border,
                  color: colors.text1
                }}
              >
                Back
              </button>
              <button
                onClick={handleTransfer}
                disabled={transferLoading}
                className="flex-1 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {transferLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Confirm Transfer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};