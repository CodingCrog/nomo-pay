import { useDataLoader } from 'nsw-frontend-core-lib';
import { GQL_LOADERS } from '../core/api/loaders';

export interface Identity {
  id: string;
  email: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  date_of_birth?: string;
  phone_number?: string;
  username?: string;
  member_key?: string;
  personal_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: {
      id: string;
      name: string;
      iso: string;
    };
    zipcode: string;
  };
}

export function useIdentity() {
  try {
    const rawIdentity = useDataLoader(GQL_LOADERS.get_npa_identity).get();
    
    if (!rawIdentity) {
      return {
        data: null,
        loading: false,
        error: null
      };
    }
    
    // Transform the v1_account structure to our Identity interface
    const v1Account = rawIdentity.v1_account;
    if (!v1Account || !v1Account.details) {
      return {
        data: null,
        loading: false,
        error: null
      };
    }
    
    const details = v1Account.details;
    const personalInfo = details.info_personal || {};
    const addressInfo = details.info_address || {};
    
    const identity: Identity = {
      id: rawIdentity.id,
      email: details.email || '',
      firstname: personalInfo.firstname || '',
      lastname: personalInfo.lastname || '',
      date_of_birth: personalInfo.date_of_birth || undefined,
      phone_number: details.phone || undefined,
      username: v1Account.user_name || undefined,
      member_key: v1Account.member_key || undefined,
      personal_address: addressInfo.city ? {
        line1: addressInfo.street || '',
        line2: addressInfo.building_number || undefined,
        city: addressInfo.city || '',
        state: addressInfo.state || '',
        country: addressInfo.residence_country || {
          id: '',
          name: '',
          iso: ''
        },
        zipcode: addressInfo.zipcode || ''
      } : undefined
    };
    
    return {
      data: identity,
      loading: false,
      error: null
    };
  } catch (error) {
    console.log('Error loading identity:', error);
    return {
      data: null,
      loading: false,
      error: error
    };
  }
}