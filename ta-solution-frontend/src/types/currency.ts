export interface CurrencyMetadata {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

export interface CurrenciesResponse {
  data: Record<string, CurrencyMetadata>;
  isFallback: boolean;
}

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  date: string;
  result: number;
  rate: number;
  timestamp: string;
  isHistorical: boolean;
  isFallback?: boolean;
}

export interface ConversionHistoryItem {
  id: string;
  amount: number;
  from: string;
  to: string;
  date: string;
  result: number;
  rate: number;
  timestamp: string;
  isHistorical: boolean;
}
