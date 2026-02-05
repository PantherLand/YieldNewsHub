import { API_BASE, ENDPOINTS } from '../config/index.js';

export async function fetchNewsData(minScore = 6, language = 'en', limit = 80) {
  const response = await fetch(
    `${API_BASE}${ENDPOINTS.news}?limit=${limit}&minScore=${minScore}&language=${language}`
  );
  const json = await response.json();
  return json.data?.items || json.items || [];
}

export async function fetchNewsDetail(newsId) {
  const response = await fetch(`${API_BASE}${ENDPOINTS.newsDetail(newsId)}`);
  const json = await response.json();
  if (!response.ok || !json.success || !json.data?.item) {
    throw new Error(json?.error?.message || 'Failed to load news detail');
  }
  return json.data.item;
}
