import React, { useState } from 'react';
import { Edit2, Trash2, Mail, MapPin, Building, Search } from 'lucide-react';
import type { StoredBeneficiary } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../api/loaders';

interface BeneficiaryListProps {
  beneficiaries: StoredBeneficiary[];
  onEdit: (beneficiary: StoredBeneficiary) => void;
  onDelete: (id: string) => void;
  onSelect?: (beneficiary: StoredBeneficiary) => void;
  selectable?: boolean;
}

export const BeneficiaryList: React.FC<BeneficiaryListProps> = ({
  beneficiaries,
  onEdit,
  onDelete,
  onSelect,
  selectable = false
}) => {
  const { colors } = useTheme();
  // Use the data loader directly to get raw currency data with IDs
  const currencies = useDataLoader(GQL_LOADERS.get_npa_currencies).get() || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  
  // Debug logging
  console.log('BeneficiaryList received beneficiaries:', beneficiaries);
  console.log('Number of beneficiaries:', beneficiaries?.length || 0);

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesSearch = searchQuery === '' || 
      `${b.firstname} ${b.middlename || ''} ${b.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Match currency by ID
    const matchesCurrency = selectedCurrency === '' || 
      b.transactioncurrency_id === selectedCurrency;
    
    return matchesSearch && matchesCurrency;
  });

  const getCurrencyName = (currencyId: string) => {
    // Find currency by ID
    const currency = currencies.find((c: any) => c.id === currencyId);
    return currency ? currency.currency_code : currencyId;
  };

  const formatAddress = (beneficiary: StoredBeneficiary) => {
    const parts = [
      beneficiary.personal_address_city,
      beneficiary.personal_address_state,
      beneficiary.personal_address_countrycode
    ].filter(Boolean);
    return parts.join(', ');
  };

  const formatBankInfo = (beneficiary: StoredBeneficiary) => {
    if (beneficiary.beneficiary_bank_iban) return `IBAN: ${beneficiary.beneficiary_bank_iban}`;
    if (beneficiary.beneficiary_bank_accountnumber) return `Acc: ${beneficiary.beneficiary_bank_accountnumber}`;
    if (beneficiary.beneficiary_bank_swiftcode) return `SWIFT: ${beneficiary.beneficiary_bank_swiftcode}`;
    return 'No bank details';
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete beneficiary "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
        <div className="flex-1 relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: colors.foreground3 }}
          />
          <input
            type="text"
            placeholder="Search beneficiaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
            style={{
              backgroundColor: colors.background2,
              borderColor: colors.secondary + '40',
              color: colors.foreground1
            }}
          />
        </div>
        
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: colors.background2,
            borderColor: colors.secondary + '40',
            color: colors.foreground1
          }}
        >
          <option value="">All Currencies</option>
          {currencies.map((currency: any, index: number) => (
            <option key={currency.id || index} value={currency.id}>
              {currency.currency_code} - {currency.currency_txt}
            </option>
          ))}
        </select>
      </div>

      {/* Beneficiary List */}
      {filteredBeneficiaries.length === 0 ? (
        <div 
          className="text-center py-12 rounded-lg relative z-20"
          style={{ 
            backgroundColor: colors.surface || '#ffffff',
            color: colors.foreground3 || '#666666',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {beneficiaries.length === 0 ? (
            <div>
              <p className="text-lg mb-2">No beneficiaries added yet</p>
              <p className="text-sm">Click "Add Beneficiary" to create your first beneficiary</p>
            </div>
          ) : (
            <p>No beneficiaries match your search criteria</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative z-20">
          {filteredBeneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className={`p-4 rounded-lg border transition-all relative ${
                selectable ? 'cursor-pointer hover:shadow-lg' : ''
              }`}
              style={{
                backgroundColor: colors.surface || '#ffffff',
                borderColor: colors.secondary + '40',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => selectable && onSelect && onSelect(beneficiary)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: colors.foreground1 }}>
                    {beneficiary.firstname} {beneficiary.middlename} {beneficiary.lastname}
                  </h3>
                  <span 
                    className="inline-block px-2 py-1 text-xs rounded-full mt-1"
                    style={{
                      backgroundColor: colors.primary + '20',
                      color: colors.primary
                    }}
                  >
                    {getCurrencyName(beneficiary.transactioncurrency_id)}
                  </span>
                </div>
                
                {!selectable && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(beneficiary);
                      }}
                      className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: colors.background2 }}
                    >
                      <Edit2 size={16} style={{ color: colors.foreground2 }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(beneficiary.id, `${beneficiary.firstname} ${beneficiary.lastname}`);
                      }}
                      className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#fee2e2' }}
                    >
                      <Trash2 size={16} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm" style={{ color: colors.foreground2 }}>
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span className="truncate">{beneficiary.email}</span>
                </div>
                
                {formatAddress(beneficiary) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="truncate">{formatAddress(beneficiary)}</span>
                  </div>
                )}
                
                {(beneficiary.beneficiary_bank_name || formatBankInfo(beneficiary) !== 'No bank details') && (
                  <div className="flex items-center gap-2">
                    <Building size={14} />
                    <span className="truncate">
                      {beneficiary.beneficiary_bank_name || formatBankInfo(beneficiary)}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t flex justify-end text-xs" style={{ 
                borderColor: colors.secondary + '20',
                color: colors.foreground3
              }}>
                <span>Added: {new Date(beneficiary.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {beneficiaries.length > 0 && (
        <div 
          className="text-center py-2 text-sm"
          style={{ color: colors.foreground3 }}
        >
          Showing {filteredBeneficiaries.length} of {beneficiaries.length} beneficiaries
        </div>
      )}
    </div>
  );
};