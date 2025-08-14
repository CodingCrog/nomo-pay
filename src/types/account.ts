export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  type: 'numbered' | 'gb_based';
  balance: number;
  currency: string;
  availableCurrencies: Currency[];
  chartData: ChartData;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'frozen';
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  balance: number;
  exchangeRate?: number;
}