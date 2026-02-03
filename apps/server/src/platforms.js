// Simple platform metadata mapping used by the API response.
// logoKey refers to local SVG in apps/web/public/logos/
// logoUrl is used as fallback when no local logo exists

export const PLATFORM_META = {
  // CEX platforms
  binance: {
    name: 'Binance',
    logoKey: 'binance',
    homeUrl: 'https://www.binance.com/en/earn',
  },
  okx: {
    name: 'OKX',
    logoKey: 'okx',
    homeUrl: 'https://www.okx.com/earn',
  },
  bybit: {
    name: 'Bybit',
    logoKey: 'bybit',
    homeUrl: 'https://www.bybit.com/en/earn/',
  },

  // DeFi protocols - Lending (using DefiLlama CDN for reliable logos)
  aave: {
    name: 'Aave',
    logoKey: 'aave',
    logoUrl: 'https://icons.llama.fi/aave.jpg',
    homeUrl: 'https://app.aave.com/',
  },
  compound: {
    name: 'Compound',
    logoKey: 'compound',
    logoUrl: 'https://icons.llama.fi/compound.jpg',
    homeUrl: 'https://app.compound.finance/',
  },
  morpho: {
    name: 'Morpho',
    logoKey: 'morpho',
    logoUrl: 'https://icons.llama.fi/morpho.jpg',
    homeUrl: 'https://app.morpho.org/',
  },
  spark: {
    name: 'Spark',
    logoKey: 'spark',
    logoUrl: 'https://icons.llama.fi/spark.jpg',
    homeUrl: 'https://app.spark.fi/',
  },
  euler: {
    name: 'Euler',
    logoKey: 'euler',
    logoUrl: 'https://icons.llama.fi/euler.jpg',
    homeUrl: 'https://app.euler.finance/',
  },

  // DeFi protocols - DEX / Yield (using DefiLlama CDN for reliable logos)
  curve: {
    name: 'Curve',
    logoKey: 'curve',
    logoUrl: 'https://icons.llama.fi/curve.jpg',
    homeUrl: 'https://curve.fi/',
  },
  yearn: {
    name: 'Yearn',
    logoKey: 'yearn',
    logoUrl: 'https://icons.llama.fi/yearn-finance.jpg',
    homeUrl: 'https://yearn.fi/',
  },
  convex: {
    name: 'Convex',
    logoKey: 'convex',
    logoUrl: 'https://icons.llama.fi/convex-finance.jpg',
    homeUrl: 'https://www.convexfinance.com/',
  },
  pendle: {
    name: 'Pendle',
    logoKey: 'pendle',
    logoUrl: 'https://icons.llama.fi/pendle.jpg',
    homeUrl: 'https://app.pendle.finance/',
  },

  // Data aggregator
  defillama: {
    name: 'DeFiLlama',
    logoUrl: 'https://defillama.com/favicon.ico',
    homeUrl: 'https://defillama.com/yields',
  },
};

// Chain metadata for displaying chain info and logos (using DefiLlama CDN)
export const CHAIN_META = {
  Ethereum: {
    name: 'Ethereum',
    logoKey: 'ethereum',
    logoUrl: 'https://icons.llama.fi/chains/rsz_ethereum.jpg',
    color: '#627EEA',
  },
  Arbitrum: {
    name: 'Arbitrum',
    logoKey: 'arbitrum',
    logoUrl: 'https://icons.llama.fi/chains/rsz_arbitrum.jpg',
    color: '#28A0F0',
  },
  Optimism: {
    name: 'Optimism',
    logoKey: 'optimism',
    logoUrl: 'https://icons.llama.fi/chains/rsz_optimism.jpg',
    color: '#FF0420',
  },
  Polygon: {
    name: 'Polygon',
    logoKey: 'polygon',
    logoUrl: 'https://icons.llama.fi/chains/rsz_polygon.jpg',
    color: '#8247E5',
  },
  Base: {
    name: 'Base',
    logoKey: 'base',
    logoUrl: 'https://icons.llama.fi/chains/rsz_base.jpg',
    color: '#0052FF',
  },
  Avalanche: {
    name: 'Avalanche',
    logoKey: 'avalanche',
    logoUrl: 'https://icons.llama.fi/chains/rsz_avalanche.jpg',
    color: '#E84142',
  },
  BSC: {
    name: 'BNB Chain',
    logoKey: 'bnb',
    logoUrl: 'https://icons.llama.fi/chains/rsz_bsc.jpg',
    color: '#F0B90B',
  },
};

export function normalizePlatformKey(provider = '') {
  const p = String(provider || '').toLowerCase();

  // CEX
  if (p.includes('binance')) return 'binance';
  if (p.includes('okx')) return 'okx';
  if (p.includes('bybit')) return 'bybit';

  // DeFi projects
  if (p.includes('aave')) return 'aave';
  if (p.includes('compound')) return 'compound';
  if (p.includes('morpho')) return 'morpho';
  if (p.includes('spark')) return 'spark';
  if (p.includes('euler')) return 'euler';
  if (p.includes('curve')) return 'curve';
  if (p.includes('yearn')) return 'yearn';
  if (p.includes('convex')) return 'convex';
  if (p.includes('pendle')) return 'pendle';

  return null;
}

export function getChainMeta(chain = '') {
  return CHAIN_META[chain] || null;
}
