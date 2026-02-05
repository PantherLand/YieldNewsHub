const TAB_ROUTE_MAP = {
  apy: '/apy',
  strategy: '/strategy',
  news: '/news',
  settings: '/settings',
};

function normalizePath(pathname = '') {
  return pathname.replace(/\/+$/, '') || '/';
}

function safeDecode(segment = '') {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function parseAppRoute(pathname = '') {
  const normalizedPath = normalizePath(pathname);
  const lowerPath = normalizedPath.toLowerCase();

  if (lowerPath === '/strategy' || lowerPath.startsWith('/strategy/')) {
    return { tab: 'strategy', newsId: null };
  }

  if (lowerPath === '/settings' || lowerPath.startsWith('/settings/')) {
    return { tab: 'settings', newsId: null };
  }

  if (lowerPath === '/news' || lowerPath.startsWith('/news/')) {
    const newsId = normalizedPath.startsWith('/news/')
      ? safeDecode(normalizedPath.slice('/news/'.length) || '')
      : null;
    return { tab: 'news', newsId: newsId || null };
  }

  if (lowerPath === '/apy' || lowerPath.startsWith('/apy/')) {
    return { tab: 'apy', newsId: null };
  }

  return { tab: 'apy', newsId: null };
}

export function getRouteFromTab(tabId) {
  return TAB_ROUTE_MAP[tabId] || TAB_ROUTE_MAP.apy;
}

export function getNewsDetailRoute(newsId) {
  if (!newsId) return TAB_ROUTE_MAP.news;
  return `${TAB_ROUTE_MAP.news}/${encodeURIComponent(String(newsId))}`;
}
