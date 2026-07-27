import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ConversionHistoryItem, ConversionResult } from '../types/currency';

interface HistoryState {
  history: ConversionHistoryItem[];
  addHistoryItem: (result: ConversionResult) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],

      addHistoryItem: (result: ConversionResult) => {
        const newItem: ConversionHistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          amount: result.amount,
          from: result.from,
          to: result.to,
          date: result.date,
          result: result.result,
          rate: result.rate,
          timestamp: result.timestamp || new Date().toISOString(),
          isHistorical: result.isHistorical,
        };

        set((state) => ({
          history: [newItem, ...state.history],
        }));
      },

      deleteHistoryItem: (id: string) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'currency_conversion_history_v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
