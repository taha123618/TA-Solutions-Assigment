import axios from 'axios';
import type { CurrenciesResponse, ConversionResult } from '../types/currency';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/currency`
  : 'http://localhost:3000/api/currency';

export async function fetchCurrenciesApi(): Promise<CurrenciesResponse> {
  const response = await axios.get<CurrenciesResponse>(`${API_BASE}/currencies`);
  return response.data;
}

export async function convertCurrencyApi(
  amount: number,
  from: string,
  to: string,
  date?: string
): Promise<ConversionResult> {
  const params: Record<string, string | number> = {
    amount,
    from,
    to,
  };
  if (date) {
    params.date = date;
  }

  const response = await axios.get<ConversionResult>(`${API_BASE}/convert`, { params });
  return response.data;
}
