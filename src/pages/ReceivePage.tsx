import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Share2, QrCode, CheckCircle, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAccounts } from '../core/api/client';
import { useIdentity } from '../hooks/useIdentity';
import { useTheme } from '../context/ThemeContext';
import { notificationManager } from '../utils/notificationManager';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Account, Currency } from '../types';

interface AccountDetails {
  label: string;
  value: string;
  copyable: boolean;
}

export const ReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { data: identity } = useIdentity();
  const { data: accounts, loading: accountsLoading } = useAccounts();
  
  // Use accounts from API
  const allAccounts = accounts;
  
  const [selectedAccountId, setSelectedAccountId] = useState<string>(allAccounts[0]?.id || '');
  const [selectedFormat, setSelectedFormat] = useState<'domestic' | 'international'>('international');
  const [showQRCode, setShowQRCode] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const selectedAccount = allAccounts.find((a: Account) => a.id === selectedAccountId);
  
  // Mock account details - in production, these would come from the backend
  const getAccountDetails = (account: Account | undefined): AccountDetails[] => {
    if (!account) return [];
    
    const baseDetails: AccountDetails[] = [
      {
        label: 'Account Name',
        value: identity ? `${identity.firstname} ${identity.lastname}` : 'John Doe',
        copyable: true
      },
      {
        label: 'Account Number',
        value: account.accountNumber,
        copyable: true
      },
      {
        label: 'Account Type',
        value: account.type === 'gb_based' ? 'GB Based Account' : 'Numbered Account',
        copyable: false
      }
    ];
    
    if (selectedFormat === 'international') {
      return [
        ...baseDetails,
        {
          label: 'IBAN',
          value: account.type === 'gb_based' 
            ? `GB82 NOMO ${account.accountNumber.replace(/\s/g, '').slice(0, 14)}` 
            : `CH93 0076 ${account.accountNumber.replace(/\s/g, '').slice(0, 14)}`,
          copyable: true
        },
        {
          label: 'SWIFT/BIC Code',
          value: account.type === 'gb_based' ? 'NOMOGB2L' : 'NOMOCH2A',
          copyable: true
        },
        {
          label: 'Bank Name',
          value: 'NomoPay International Bank',
          copyable: true
        },
        {
          label: 'Bank Address',
          value: account.type === 'gb_based' 
            ? '123 Financial Street, London, EC1A 1BB, United Kingdom'
            : 'Bahnhofstrasse 1, 8001 Zürich, Switzerland',
          copyable: true
        }
      ];
    } else {
      // Domestic format
      if (account.type === 'gb_based') {
        return [
          ...baseDetails,
          {
            label: 'Sort Code',
            value: '04-00-75',
            copyable: true
          },
          {
            label: 'Bank Name',
            value: 'NomoPay UK',
            copyable: true
          }
        ];
      } else {
        return [
          ...baseDetails,
          {
            label: 'Clearing Number',
            value: '760',
            copyable: true
          },
          {
            label: 'Bank Name',
            value: 'NomoPay Switzerland',
            copyable: true
          }
        ];
      }
    }
  };
  
  const accountDetails = getAccountDetails(selectedAccount);
  
  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      notificationManager.success('Copied!', `${label} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      notificationManager.error('Copy Failed', 'Unable to copy to clipboard');
    }
  };
  
  const handleShare = async () => {
    const details = accountDetails
      .map((d: AccountDetails) => `${d.label}: ${d.value}`)
      .join('\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Account Details',
          text: details
        });
      } catch {
        console.log('Share failed');
      }
    } else {
      // Fallback: copy all details to clipboard
      handleCopy(details, 'All account details');
    }
  };
  
  const generateQRData = () => {
    const details = accountDetails
      .filter((d: AccountDetails) => d.copyable)
      .map((d: AccountDetails) => `${d.label}: ${d.value}`)
      .join('\n');
    return details;
  };
  
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `nomopay-account-${selectedAccount?.accountNumber}.png`;
      a.click();
    }
  };
  
  if (accountsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background1 }}>
        <LoadingSpinner size="large" text="Loading account details..." />
      </div>
    );
  }
  
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
            <h1 className="text-xl font-semibold" style={{ color: colors.text1 }}>Receive Money</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Show QR Code"
            >
              <QrCode className="w-5 h-5" style={{ color: colors.text1 }} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Share"
            >
              <Share2 className="w-5 h-5" style={{ color: colors.text1 }} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto p-4">
        <div className="space-y-6">
          {/* Account Selector */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
              Select Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full p-3 rounded-lg border"
              style={{ 
                backgroundColor: colors.background2, 
                borderColor: colors.border,
                color: colors.text1
              }}
            >
              {allAccounts.map((account: Account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.accountNumber}
                </option>
              ))}
            </select>
          </div>
          
          {/* Format Selector */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text2 }}>
              Details Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedFormat('international')}
                className={`p-3 rounded-lg border transition-all ${
                  selectedFormat === 'international' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
                style={{ 
                  backgroundColor: selectedFormat === 'international' ? undefined : colors.background2,
                  borderColor: selectedFormat === 'international' ? undefined : colors.border,
                  color: colors.text1
                }}
              >
                International (SWIFT)
              </button>
              <button
                onClick={() => setSelectedFormat('domestic')}
                className={`p-3 rounded-lg border transition-all ${
                  selectedFormat === 'domestic' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
                style={{ 
                  backgroundColor: selectedFormat === 'domestic' ? undefined : colors.background2,
                  borderColor: selectedFormat === 'domestic' ? undefined : colors.border,
                  color: colors.text1
                }}
              >
                Domestic
              </button>
            </div>
          </div>
          
          {/* QR Code Display */}
          {showQRCode && (
            <div className="rounded-lg p-6 text-center" style={{ backgroundColor: colors.background2 }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text1 }}>
                QR Code for Account Details
              </h3>
              <div className="inline-block p-4 bg-white rounded-lg">
                <QRCodeSVG
                  id="qr-code"
                  value={generateQRData()}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="mt-4 text-sm" style={{ color: colors.text2 }}>
                Scan this code to get all account details
              </p>
              <button
                onClick={downloadQRCode}
                className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </button>
            </div>
          )}
          
          {/* Account Details */}
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: colors.background2 }}>
            <div className="p-4 border-b" style={{ borderColor: colors.border }}>
              <h3 className="font-semibold" style={{ color: colors.text1 }}>
                Account Details for Receiving Payments
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {accountDetails.map((detail: AccountDetails, index: number) => (
                <div key={index}>
                  <label className="text-sm" style={{ color: colors.text2 }}>
                    {detail.label}
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <div 
                      className="font-mono text-sm flex-1 break-all" 
                      style={{ color: colors.text1 }}
                    >
                      {detail.value}
                    </div>
                    {detail.copyable && (
                      <button
                        onClick={() => handleCopy(detail.value, detail.label)}
                        className="ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={`Copy ${detail.label}`}
                      >
                        {copiedField === detail.label ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" style={{ color: colors.text2 }} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              How to receive payments:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Share these account details with the sender</li>
              <li>For international transfers, use IBAN and SWIFT code</li>
              <li>For domestic transfers, use the account number and sort code</li>
              <li>Include your full name as it appears on the account</li>
              <li>Payments typically arrive within 1-3 business days</li>
            </ol>
          </div>
          
          {/* Supported Currencies */}
          {selectedAccount && selectedAccount.availableCurrencies.length > 0 && (
            <div className="rounded-lg p-4" style={{ backgroundColor: colors.background2 }}>
              <h4 className="font-medium mb-3" style={{ color: colors.text1 }}>
                Supported Currencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAccount.availableCurrencies.map((currency: Currency) => (
                  <span
                    key={currency.code}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: colors.background1,
                      color: colors.text1,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {currency.code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};