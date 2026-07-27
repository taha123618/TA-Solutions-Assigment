import { create } from 'zustand';
import type { ConversionHistoryItem } from '../types/currency';

interface ConverterState {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  isHistorical: boolean;
  historicalDate: string;
  setAmount: (amount: string) => void;
  setFromCurrency: (code: string) => void;
  setToCurrency: (code: string) => void;
  setIsHistorical: (val: boolean) => void;
  setHistoricalDate: (date: string) => void;
  swapCurrencies: () => void;
  applyPreset: (item: ConversionHistoryItem) => void;
}

const getYesterdayStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const useConverterStore = create<ConverterState>((set) => ({
  amount: '100',
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  isHistorical: false,
  historicalDate: getYesterdayStr(),

  setAmount: (amount) => set({ amount }),
  setFromCurrency: (fromCurrency) => set({ fromCurrency }),
  setToCurrency: (toCurrency) => set({ toCurrency }),
  setIsHistorical: (isHistorical) => set({ isHistorical }),
  setHistoricalDate: (historicalDate) => set({ historicalDate }),

  swapCurrencies: () =>
    set((state) => ({
      fromCurrency: state.toCurrency,
      toCurrency: state.fromCurrency,
    })),

  applyPreset: (item) =>
    set({
      amount: item.amount.toString(),
      fromCurrency: item.from,
      toCurrency: item.to,
      isHistorical: item.isHistorical,
      historicalDate: item.isHistorical && item.date ? item.date : getYesterdayStr(),
    }),
}));
