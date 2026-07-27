import { useMutation } from '@tanstack/react-query';
import { convertCurrencyApi } from '../api/currencyApi';
import { useHistoryStore } from '../store/useHistoryStore';

export interface ConvertParams {
  amount: number;
  from: string;
  to: string;
  date?: string;
}

export function useConvertMutation() {
  const addHistoryItem = useHistoryStore((state) => state.addHistoryItem);

  return useMutation({
    mutationFn: ({ amount, from, to, date }: ConvertParams) =>
      convertCurrencyApi(amount, from, to, date),
    onSuccess: (data) => {
      addHistoryItem(data);
    },
  });
}
