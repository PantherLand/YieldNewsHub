import { create } from 'zustand';
import { DEFAULT_FILTERS, SORT_DIRECTIONS } from '../config/index.js';

export const useApyStore = create((set, get) => ({
  // Data
  apy: [],

  // Filters
  apyFilter: DEFAULT_FILTERS.apyFilter,
  minTvl: DEFAULT_FILTERS.minTvl,
  minApy: DEFAULT_FILTERS.minApy,
  selectedChain: DEFAULT_FILTERS.selectedChain,

  // Sorting
  sortBy: DEFAULT_FILTERS.sortBy,
  apySortDirection: SORT_DIRECTIONS.apy,
  tvlSortDirection: SORT_DIRECTIONS.tvl,

  // Actions
  setApy: (apy) => set({ apy }),
  setApyFilter: (filter) => set({ apyFilter: filter }),
  setMinTvl: (value) => set({ minTvl: Math.max(0, value) }),
  setMinApy: (value) => set({ minApy: Math.max(0, value) }),
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setSortBy: (sortBy) => set({ sortBy }),

  toggleApySort: () => {
    const { sortBy, apySortDirection } = get();
    if (sortBy !== 'apy') {
      set({ sortBy: 'apy' });
      return;
    }
    set({ apySortDirection: apySortDirection === 'asc' ? 'desc' : 'asc' });
  },

  toggleTvlSort: () => {
    const { sortBy, tvlSortDirection } = get();
    if (sortBy !== 'tvl') {
      set({ sortBy: 'tvl' });
      return;
    }
    set({ tvlSortDirection: tvlSortDirection === 'asc' ? 'desc' : 'asc' });
  },

  // Computed (use selectors in components)
  getAvailableChains: () => {
    const { apy } = get();
    const chains = new Set();
    apy.forEach((item) => {
      if (item.chain && item.chain.toLowerCase() !== 'cefi') {
        chains.add(item.chain);
      }
    });
    return Array.from(chains).sort();
  },

  getFilteredApy: () => {
    const { apy, apyFilter, selectedChain, minTvl, minApy, sortBy, apySortDirection, tvlSortDirection } = get();
    let result = apy;

    // Apply type filter
    if (apyFilter === 'cex') {
      result = result.filter((x) => String(x.chain || '').toLowerCase() === 'cefi');
    } else if (apyFilter === 'dex') {
      result = result.filter((x) => String(x.chain || '').toLowerCase() !== 'cefi');
    }

    // Apply chain filter (only for DEX)
    if (apyFilter === 'dex' && selectedChain !== 'all') {
      result = result.filter((x) => x.chain === selectedChain);
    }

    // Apply TVL filter
    if (minTvl > 0) {
      result = result.filter((x) => (x.tvlUsd || 0) >= minTvl * 1_000_000);
    }

    // Apply APY filter
    if (minApy > 0) {
      result = result.filter((x) => (x.apy || 0) >= minApy);
    }

    // Sort
    const sorted = [...result].sort((a, b) => {
      if (sortBy === 'tvl') {
        const at = Number(a.tvlUsd ?? -Infinity);
        const bt = Number(b.tvlUsd ?? -Infinity);
        if (at !== bt) return tvlSortDirection === 'asc' ? at - bt : bt - at;
        return Number(b.apy ?? -Infinity) - Number(a.apy ?? -Infinity);
      }
      const aa = Number(a.apy ?? -Infinity);
      const ba = Number(b.apy ?? -Infinity);
      if (aa !== ba) return apySortDirection === 'asc' ? aa - ba : ba - aa;
      return Number(b.tvlUsd ?? -Infinity) - Number(a.tvlUsd ?? -Infinity);
    });

    return sorted;
  },
}));

export default useApyStore;
