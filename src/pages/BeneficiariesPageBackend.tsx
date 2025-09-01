import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { coreLibQuery, useDataLoader } from 'nsw-frontend-core-lib';
import { BeneficiaryForm } from '../components/BeneficiaryForm';
import { BeneficiaryList } from '../components/BeneficiaryList';
import { GQL_LOADERS } from '../core/api/loaders';
import { mutationCreateNpaBeneficiary, mutationUpdateNpaBeneficiary, mutationDeleteNpaBeneficiary } from '../core/api/beneficiaryMutations';
import type { BeneficiaryFormData, StoredBeneficiary } from '../types';
import { useTheme } from '../context/ThemeContext';
import { notificationManager } from '../utils/notificationManager';
import { normalizeOptionalFields } from '../utils/beneficiaryValidation';

export const BeneficiariesPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<StoredBeneficiary | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Load beneficiaries from backend using data loader
  const beneficiariesData = useDataLoader(GQL_LOADERS.get_npa_beneficiaries).get();
  
  // Load currencies for the form
  const currenciesData = useDataLoader(GQL_LOADERS.get_npa_currencies).get();
  
  // Debug logging
  console.log('Raw beneficiaries data from backend:', beneficiariesData);
  console.log('Currencies data:', currenciesData);
  
  // Transform backend data to our format
  const beneficiaries: StoredBeneficiary[] = React.useMemo(() => {
    console.log('BeneficiariesPageBackend - transforming data');
    console.log('- beneficiariesData type:', typeof beneficiariesData);
    console.log('- beneficiariesData isArray:', Array.isArray(beneficiariesData));
    console.log('- beneficiariesData:', beneficiariesData);
    
    if (!beneficiariesData || !Array.isArray(beneficiariesData)) {
      console.log('No beneficiaries data or not an array:', beneficiariesData);
      return [];
    }
    
    console.log('Mapping', beneficiariesData.length, 'beneficiaries');
    return beneficiariesData.map((b: any) => {
      // Get the current address from the addresses array
      const currentAddress = b.addresses?.find((addr: any) => addr.is_current) || b.addresses?.[0] || {};
      
      console.log('Mapping beneficiary:', b);
      console.log('Current address:', currentAddress);
      
      return {
        id: b.id,
        firstname: b.firstname_txt || '',
        lastname: b.lastname_txt || '',
        middlename: b.middlename_txt || '',
        email: b.email_txt || '',
        transactioncurrency_id: b.transactioncurrency?.id || b.transactioncurrency_id || '',
        // Use address fields from the addresses array
        personal_address_line1: currentAddress.address_line1 || '',
        personal_address_line2: currentAddress.address_line2 || '',
        personal_address_countrycode: currentAddress.address_country_code || '',
        personal_address_city: currentAddress.address_city || '',
        personal_address_state: currentAddress.address_state || '',
        personal_address_zipcode: currentAddress.address_zipcode || '',
        // Bank details come directly from the beneficiary object
        beneficiary_bank_name: b.beneficiary_bankname_txt || '',
        beneficiary_bank_accountnumber: b.beneficiary_bankaccountnumber_txt || '',
        beneficiary_bank_swiftcode: b.beneficiary_bankswiftcode_txt || '',
        beneficiary_bank_iban: b.beneficiary_bankiban_txt || '',
        beneficiary_bank_bic: b.beneficiary_bankbic_txt || '',
        beneficiary_bank_sortbranchcode: b.beneficiary_banksortbranchcode_txt || '',
        beneficiary_bank_address_line1: b.beneficiary_bankaddress_line1 || '',
        beneficiary_bank_address_line2: b.beneficiary_bankaddress_line2 || '',
        beneficiary_bank_address_countrycode: b.beneficiary_bankaddress_country || '',
        beneficiary_bank_address_city: b.beneficiary_bankaddress_city || '',
        beneficiary_bank_address_state: b.beneficiary_bankaddress_state || '',
        beneficiary_bank_address_zipcode: b.beneficiary_bankaddress_zipcode || '',
        // Intermediate bank details
        intermediate_bank_name: b.intermediate_bankname_txt || '',
        intermediate_bank_swiftcode: b.intermediate_bankswiftcode_txt || '',
        intermediate_bank_address_line1: b.intermediate_bankaddress_line1 || '',
        intermediate_bank_address_line2: b.intermediate_bankaddress_line2 || '',
        intermediate_bank_address_countrycode: b.intermediate_bankaddress_country || '',
        intermediate_bank_address_city: b.intermediate_bankaddress_city || '',
        intermediate_bank_address_state: b.intermediate_bankaddress_state || '',
        intermediate_bank_address_zipcode: b.intermediate_bankaddress_zipcode || '',
        createdAt: new Date(b.created_at * 1000),
        updatedAt: new Date(b.created_at * 1000)
      };
    });
  }, [beneficiariesData]);
  
  console.log('BeneficiariesPageBackend - Final beneficiaries:', beneficiaries);

  const handleSaveBeneficiary = async (data: BeneficiaryFormData) => {
    try {
      setIsCreating(true);
      
      // Remove beneficiary_bank_method from data immediately
      const { beneficiary_bank_method: _, ...formDataWithoutMethod } = data as any;
      
      // Currency ID is already provided from the form
      const currencyId = formDataWithoutMethod.transactioncurrency_id;
      
      // Prepare variables - use null for empty optional fields
      const normalizedData = normalizeOptionalFields(formDataWithoutMethod);
      
      // Create clean variables object without beneficiary_bank_method
      const { beneficiary_bank_method, ...cleanData } = normalizedData as any;
      
      const variables = {
        ...cleanData,
        transactioncurrency_id: currencyId
      };
      
      // Remove any undefined or unwanted fields
      Object.keys(variables).forEach(key => {
        if (key === 'beneficiary_bank_method' || key.includes('bank_method')) {
          delete variables[key as keyof typeof variables];
        }
      });
      
      console.log('Final variables being sent:', variables);
      console.log('Variables keys:', Object.keys(variables));
      
      let result;
      
      if (editingBeneficiary) {
        // Try to use update mutation for editing
        try {
          result = await coreLibQuery({
            query: mutationUpdateNpaBeneficiary,
            variables: {
              id: editingBeneficiary.id,
              ...variables
            }
          });
          
          if (result?.data?.update_npa_beneficiary?.error) {
            throw new Error(result.data.update_npa_beneficiary.error);
          }
        } catch (updateError: any) {
          // If update mutation is not available, fallback to delete and recreate
          console.log('Update mutation failed, falling back to delete and recreate:', updateError);
          
          // Delete the existing beneficiary
          await coreLibQuery({
            query: mutationDeleteNpaBeneficiary,
            variables: { id: editingBeneficiary.id }
          });
          
          // Create a new one with updated data
          result = await coreLibQuery({
            query: mutationCreateNpaBeneficiary,
            variables
          });
          
          if (result?.data?.create_npa_beneficiary?.error) {
            throw new Error(result.data.create_npa_beneficiary.error);
          }
        }
      } else {
        // Use create mutation for new beneficiaries
        result = await coreLibQuery({
          query: mutationCreateNpaBeneficiary,
          variables
        });
        
        if (result?.data?.create_npa_beneficiary?.error) {
          throw new Error(result.data.create_npa_beneficiary.error);
        }
      }
      
      notificationManager.success(editingBeneficiary ? 'Beneficiary updated successfully' : 'Beneficiary added successfully');
      setShowForm(false);
      setEditingBeneficiary(null);
      
      // Reload beneficiaries data
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving beneficiary:', error);
      notificationManager.error(error.message || 'Failed to save beneficiary');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditBeneficiary = (beneficiary: StoredBeneficiary) => {
    setEditingBeneficiary(beneficiary);
    setShowForm(true);
  };

  const handleDeleteBeneficiary = async (id: string) => {
    if (!confirm('Are you sure you want to delete this beneficiary?')) return;
    
    try {
      setIsDeleting(true);
      
      const result = await coreLibQuery({
        query: mutationDeleteNpaBeneficiary,
        variables: { id }
      });

      if (result?.data?.delete_npa_beneficiary?.error) {
        throw new Error(result.data.delete_npa_beneficiary.error);
      }
      
      notificationManager.success('Beneficiary deleted successfully');
      
      // Reload beneficiaries data
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting beneficiary:', error);
      notificationManager.error(error.message || 'Failed to delete beneficiary');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10" style={{ backgroundColor: colors.background1 }}>
      {/* Header */}
      <div 
        className="sticky top-0 z-40 border-b"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.secondary + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ backgroundColor: colors.background2 }}
              >
                <ArrowLeft size={20} style={{ color: colors.foreground2 }} />
              </button>
              <div className="flex items-center gap-2">
                <Users size={24} style={{ color: colors.primary }} />
                <h1 className="text-xl font-semibold" style={{ color: colors.foreground1 }}>
                  Beneficiaries
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Add Beneficiary */}
              <button
                onClick={() => {
                  setEditingBeneficiary(null);
                  setShowForm(true);
                }}
                disabled={isCreating || isDeleting}
                className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white'
                }}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Beneficiary</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Beneficiary List */}
        <BeneficiaryList
          beneficiaries={beneficiaries}
          onEdit={handleEditBeneficiary}
          onDelete={handleDeleteBeneficiary}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <BeneficiaryForm
          onSave={handleSaveBeneficiary}
          onCancel={() => {
            setShowForm(false);
            setEditingBeneficiary(null);
          }}
          initialData={editingBeneficiary || undefined}
        />
      )}
    </div>
  );
};