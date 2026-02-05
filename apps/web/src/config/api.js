export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

export const ENDPOINTS = {
  apy: '/api/apy',
  news: '/api/news',
  newsDetail: (id) => `/api/news/${encodeURIComponent(id)}`,
  telegram: '/api/integrations/telegram',
  telegramTest: '/api/integrations/telegram/test',
};

// Polling intervals
export const POLLING_INTERVALS = {
  news: 60_000, // 1 minute
};
