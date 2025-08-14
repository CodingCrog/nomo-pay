export const ACCOUNT_TYPES = {
  NUMBERED: 'numbered',
  GB_BASED: 'gb_based',
} as const;

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  FROZEN: 'frozen',
} as const;

export const LOCATION_FLAGS = {
  LONDON: '🇬🇧',
  SINGAPORE: '🇸🇬',
} as const;

export const LOCATION_NAMES = {
  LONDON: 'London',
  SINGAPORE: 'Singapore',
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];
export type AccountStatus = typeof ACCOUNT_STATUS[keyof typeof ACCOUNT_STATUS];