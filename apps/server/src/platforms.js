// Simple platform metadata mapping used by the API response.
// Logos use Simple Icons CDN when available.

export const PLATFORM_META = {
  binance: {
    name: 'Binance',
    logoUrl: 'https://cdn.simpleicons.org/binance',
    homeUrl: 'https://www.binance.com/en/earn',
  },
  okx: {
    name: 'OKX',
    logoUrl: 'https://cdn.simpleicons.org/okx',
    homeUrl: 'https://www.okx.com/earn',
  },
  bybit: {
    name: 'Bybit',
    logoUrl: 'https://cdn.simpleicons.org/bybit',
    homeUrl: 'https://www.bybit.com/en/earn/',
  },
  defillama: {
    name: 'DeFiLlama',
    logoUrl: 'https://defillama.com/favicon.ico',
    homeUrl: 'https://defillama.com/yields',
  },
  aave: {
    name: 'Aave',
    logoUrl: 'https://cdn.simpleicons.org/aave',
    homeUrl: 'https://app.aave.com/',
  },
  morpho: {
    name: 'Morpho',
    logoUrl: 'https://cdn.simpleicons.org/morpho',
    homeUrl: 'https://app.morpho.org/',
  },
  euler: {
    name: 'Euler',
    logoUrl: 'https://cdn.simpleicons.org/euler',
    homeUrl: 'https://app.euler.finance/',
  },
  yearn: {
    name: 'Yearn',
    logoUrl: 'https://cdn.simpleicons.org/yearnfinance',
    homeUrl: 'https://yearn.fi/',
  },
};

export function normalizePlatformKey(provider = '') {
  const p = String(provider || '').toLowerCase();
  if (p.includes('binance')) return 'binance';
  if (p.includes('okx')) return 'okx';
  if (p.includes('bybit')) return 'bybit';

  // DeFi projects
  if (p.includes('aave')) return 'aave';
  if (p.includes('morpho')) return 'morpho';
  if (p.includes('euler')) return 'euler';
  if (p.includes('yearn')) return 'yearn';

  return null;
}
