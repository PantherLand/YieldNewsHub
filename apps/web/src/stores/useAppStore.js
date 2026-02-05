import { create } from 'zustand';
import { parseAppRoute, getRouteFromTab, getNewsDetailRoute } from '../ui/routes.js';

const getInitialState = () => {
  if (typeof window === 'undefined') return { tab: 'apy', selectedNewsId: null };
  return parseAppRoute(window.location.pathname);
};

export const useAppStore = create((set, get) => ({
  // State
  tab: getInitialState().tab,
  selectedNewsId: getInitialState().selectedNewsId,
  err: '',

  // Actions
  setTab: (tab) => set({ tab }),
  setSelectedNewsId: (id) => set({ selectedNewsId: id }),
  setError: (err) => set({ err }),
  clearError: () => set({ err: '' }),

  // Navigation helpers
  navigateTo: (pathname, { replace = false } = {}) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === pathname) return;
    if (replace) {
      window.history.replaceState({}, '', pathname);
    } else {
      window.history.pushState({}, '', pathname);
    }
  },

  changeTab: (nextTab, { replace = false } = {}) => {
    const { navigateTo } = get();
    set({ tab: nextTab, selectedNewsId: null });
    navigateTo(getRouteFromTab(nextTab), { replace });
    window.scrollTo(0, 0);
  },

  openNewsDetail: (item, { replace = false } = {}) => {
    if (!item?.id) return;
    const { navigateTo } = get();
    set({ tab: 'news', selectedNewsId: item.id });
    navigateTo(getNewsDetailRoute(item.id), { replace });
    window.scrollTo(0, 0);
  },

  syncFromRoute: () => {
    const route = parseAppRoute(window.location.pathname);
    set({ tab: route.tab, selectedNewsId: route.newsId });
  },
}));

export default useAppStore;
