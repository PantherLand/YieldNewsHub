// Simple platform metadata mapping used by the API response.
// Logos use Simple Icons CDN when available.

export const PLATFORM_META = {
  binance: {
    name: 'Binance',
    logoUrl: 'https://cdn.simpleicons.org/binance',
    homeUrl: 'https://www.binance.com/',
  },
  okx: {
    name: 'OKX',
    logoUrl: 'https://cdn.simpleicons.org/okx',
    homeUrl: 'https://www.okx.com/',
  },
  bybit: {
    name: 'Bybit',
    logoUrl: 'https://cdn.simpleicons.org/bybit',
    homeUrl: 'https://www.bybit.com/',
  },
  defillama: {
    name: 'DeFiLlama',
    logoUrl: 'https://defillama.com/favicon.ico',
    homeUrl: 'https://defillama.com/',
  },
};

export function normalizePlatformKey(provider = '') {
  const p = String(provider || '').toLowerCase();
  if (p.includes('binance')) return 'binance';
  if (p.includes('okx')) return 'okx';
  if (p.includes('bybit')) return 'bybit';
  return null;
}
