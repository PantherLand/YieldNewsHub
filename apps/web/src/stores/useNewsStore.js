import { create } from 'zustand';
import { DEFAULT_FILTERS } from '../config/index.js';

export const useNewsStore = create((set, get) => ({
  // Data
  news: [],
  pendingNews: [],
  hasPendingNewsUpdate: false,
  selectedNewsFromRoute: null,

  // Filters
  minScore: DEFAULT_FILTERS.minScore,

  // Actions
  setNews: (news) => set({ news, pendingNews: [], hasPendingNewsUpdate: false }),
  setPendingNews: (pendingNews) => set({ pendingNews, hasPendingNewsUpdate: pendingNews.length > 0 }),
  setMinScore: (score) => set({ minScore: score }),
  setSelectedNewsFromRoute: (item) => set({ selectedNewsFromRoute: item }),

  applyPendingNews: () => {
    const { pendingNews } = get();
    if (!pendingNews.length) return;
    set({ news: pendingNews, pendingNews: [], hasPendingNewsUpdate: false });
  },

  // Computed
  getSelectedNewsItem: (selectedNewsId) => {
    const { news, selectedNewsFromRoute } = get();
    if (!selectedNewsId) return null;
    return news.find((item) => String(item.id) === String(selectedNewsId)) || selectedNewsFromRoute;
  },
}));

export default useNewsStore;
