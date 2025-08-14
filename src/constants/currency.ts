export const CURRENCY_FLAGS: Record<string, string> = {
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  USD: '🇺🇸',
  CHF: '🇨🇭',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  SGD: '🇸🇬',
  HKD: '🇭🇰',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  CHF: 'Fr',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  HKD: 'HK$',
};

export const CURRENCY_DECIMALS: Record<string, number> = {
  EUR: 2,
  GBP: 2,
  USD: 2,
  CHF: 2,
  JPY: 0,
  AUD: 2,
  CAD: 2,
  SGD: 2,
  HKD: 2,
};

// Exchange rates relative to EUR (for mock data only)
export const MOCK_EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.16,
  CHF: 0.95,
  JPY: 0.0062,
  AUD: 0.59,
  CAD: 0.68,
  SGD: 0.68,
  HKD: 0.12,
};