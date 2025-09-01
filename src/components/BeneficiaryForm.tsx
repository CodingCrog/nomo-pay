import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { BeneficiaryFormData } from '../types';
import { REQUIRED_FIELDS } from '../types';
import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../core/api/loaders';
import { useTheme } from '../context/ThemeContext';

interface BeneficiaryFormProps {
  onSave: (data: BeneficiaryFormData) => void;
  onCancel: () => void;
  initialData?: Partial<BeneficiaryFormData>;
}

export const BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({ onSave, onCancel, initialData }) => {
  const { colors } = useTheme();
  // Use the data loader directly to get raw currency data with IDs
  const currencies = useDataLoader(GQL_LOADERS.get_npa_currencies).get() || [];
  
  // Debug currencies
  console.log('BeneficiaryForm - currencies from data loader:', currencies);
  
  const [formData, setFormData] = useState<Partial<BeneficiaryFormData>>({
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showIntermediateBank, setShowIntermediateBank] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    REQUIRED_FIELDS.forEach(field => {
      if (!formData[field as keyof BeneficiaryFormData]) {
        const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        newErrors[field] = `${fieldLabel} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // IBAN validation (basic)
    if (formData.beneficiary_bank_iban && !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(formData.beneficiary_bank_iban)) {
      newErrors.beneficiary_bank_iban = 'Invalid IBAN format';
    }

    // SWIFT/BIC validation (basic)
    if (formData.beneficiary_bank_swiftcode && !/^[A-Z]{6}[A-Z0-9]{2,5}$/.test(formData.beneficiary_bank_swiftcode)) {
      newErrors.beneficiary_bank_swiftcode = 'Invalid SWIFT/BIC format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData as BeneficiaryFormData);
    }
  };

  const renderInput = (
    field: string,
    label: string,
    required: boolean = false,
    type: string = 'text',
    placeholder?: string
  ) => (
    <div>
      <label 
        htmlFor={field} 
        className="block text-sm font-medium mb-1"
        style={{ color: colors.foreground1 }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={field}
        type={type}
        value={String(formData[field as keyof BeneficiaryFormData] || '')}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
          errors[field] ? 'border-red-500' : ''
        }`}
        style={{
          backgroundColor: colors.background2,
          borderColor: errors[field] ? undefined : colors.secondary + '40',
          color: colors.foreground1
        }}
      />
      {errors[field] && (
        <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl"
        style={{ backgroundColor: colors.surface }}
      >
        <div 
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.secondary + '20'
          }}
        >
          <h2 className="text-xl font-semibold" style={{ color: colors.foreground1 }}>
            {initialData ? 'Edit Beneficiary' : 'Add New Beneficiary'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.background2 }}
          >
            <X size={20} style={{ color: colors.foreground2 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.foreground1 }}>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('firstname', 'First Name', true)}
              {renderInput('middlename', 'Middle Name')}
              {renderInput('lastname', 'Last Name', true)}
              {renderInput('email', 'Email', true, 'email')}
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.foreground1 }}>
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.transactioncurrency_id || ''}
                  onChange={(e) => handleChange('transactioncurrency_id', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{
                    backgroundColor: colors.background2,
                    borderColor: errors.transactioncurrency_id ? '#ef4444' : colors.secondary + '40',
                    color: colors.foreground1
                  }}
                >
                  <option value="">Select Currency</option>
                  {currencies.map((currency: any, index: number) => (
                    <option key={currency.id || index} value={currency.id}>
                      {currency.currency_code} - {currency.currency_txt}
                    </option>
                  ))}
                </select>
                {errors.transactioncurrency_id && (
                  <p className="mt-1 text-xs text-red-500">{errors.transactioncurrency_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Address */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.foreground1 }}>
              Personal Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('personal_address_line1', 'Address Line 1', true)}
              {renderInput('personal_address_line2', 'Address Line 2')}
              {renderInput('personal_address_city', 'City', true)}
              {renderInput('personal_address_state', 'State/Province')}
              {renderInput('personal_address_countrycode', 'Country Code', true, 'text', 'e.g., US, GB, CH')}
              {renderInput('personal_address_zipcode', 'ZIP/Postal Code', true)}
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.foreground1 }}>
              Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('beneficiary_bank_name', 'Bank Name')}
              {renderInput('beneficiary_bank_accountnumber', 'Account Number')}
              {renderInput('beneficiary_bank_iban', 'IBAN')}
              {renderInput('beneficiary_bank_swiftcode', 'SWIFT/BIC Code')}
              {renderInput('beneficiary_bank_bic', 'BIC')}
              {renderInput('beneficiary_bank_sortbranchcode', 'Sort/Branch Code')}
            </div>
          </div>

          {/* Bank Address */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: colors.foreground1 }}>
              Bank Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('beneficiary_bank_address_line1', 'Address Line 1', true)}
              {renderInput('beneficiary_bank_address_line2', 'Address Line 2')}
              {renderInput('beneficiary_bank_address_city', 'City', true)}
              {renderInput('beneficiary_bank_address_state', 'State/Province')}
              {renderInput('beneficiary_bank_address_countrycode', 'Country Code', true, 'text', 'e.g., US, GB, CH')}
              {renderInput('beneficiary_bank_address_zipcode', 'ZIP/Postal Code', true)}
            </div>
          </div>

          {/* Intermediate Bank (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={{ color: colors.foreground1 }}>
                Intermediate Bank (Optional)
              </h3>
              <button
                type="button"
                onClick={() => setShowIntermediateBank(!showIntermediateBank)}
                className="text-sm px-3 py-1 rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.primary + '20',
                  color: colors.primary
                }}
              >
                {showIntermediateBank ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showIntermediateBank && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('intermediate_bank_name', 'Bank Name')}
                {renderInput('intermediate_bank_swiftcode', 'SWIFT/BIC Code')}
                {renderInput('intermediate_bank_address_line1', 'Address Line 1')}
                {renderInput('intermediate_bank_address_line2', 'Address Line 2')}
                {renderInput('intermediate_bank_address_city', 'City')}
                {renderInput('intermediate_bank_address_state', 'State/Province')}
                {renderInput('intermediate_bank_address_countrycode', 'Country Code')}
                {renderInput('intermediate_bank_address_zipcode', 'ZIP/Postal Code')}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: colors.secondary + '20' }}>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: colors.background2,
                color: colors.foreground2
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              <Save size={18} />
              {initialData ? 'Update' : 'Save'} Beneficiary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};