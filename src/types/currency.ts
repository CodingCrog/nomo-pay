export interface CurrencyBalance {
  id: string;
  accountId: string;
  currency: CurrencyInfo;
  balance: number;
  available: number;
  pending: number;
  lastTransaction?: import('./transaction').Transaction;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  decimal: number;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

