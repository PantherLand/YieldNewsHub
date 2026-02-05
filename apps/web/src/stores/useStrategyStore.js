import { create } from 'zustand';

export const useStrategyStore = create((set) => ({
  // Data
  strategies: [],
  strategiesLoading: false,

  // Actions
  setStrategies: (strategies) => set({ strategies }),
  setStrategiesLoading: (loading) => set({ strategiesLoading: loading }),
}));

export default useStrategyStore;
