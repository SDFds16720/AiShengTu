import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryItem } from '@/types';

interface HistoryState {
  history: HistoryItem[];
  maxItems: number;

  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      maxItems: 50,

      addToHistory: (item) => {
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          };

          const newHistory = [newItem, ...state.history].slice(0, state.maxItems);
          return { history: newHistory };
        });
      },

      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter(item => item.id !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'image-generation-history',
    }
  )
);
