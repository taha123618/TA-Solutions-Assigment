import { useQuery } from '@tanstack/react-query';
import { fetchCurrenciesApi } from '../api/currencyApi';

export function useCurrenciesQuery() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrenciesApi,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    retry: 2,
  });
}
