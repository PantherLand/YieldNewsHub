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

  // DeFi protocols - Lending
  aave: {
    name: 'Aave',
    logoKey: 'aave',
    logoUrl: 'https://cryptologos.cc/logos/aave-aave-logo.svg',
    homeUrl: 'https://app.aave.com/',
  },
  compound: {
    name: 'Compound',
    logoKey: 'compound',
    logoUrl: 'https://cryptologos.cc/logos/compound-comp-logo.svg',
    homeUrl: 'https://app.compound.finance/',
  },
  morpho: {
    name: 'Morpho',
    logoKey: 'morpho',
    logoUrl: 'https://cdn.morpho.org/assets/logos/morpho.svg',
    homeUrl: 'https://app.morpho.org/',
  },
  spark: {
    name: 'Spark',
    logoKey: 'spark',
    logoUrl: 'https://app.spark.fi/spark-logo.svg',
    homeUrl: 'https://app.spark.fi/',
  },
  euler: {
    name: 'Euler',
    logoKey: 'euler',
    logoUrl: 'https://www.euler.finance/logo192.png',
    homeUrl: 'https://app.euler.finance/',
  },

  // DeFi protocols - DEX / Yield
  curve: {
    name: 'Curve',
    logoKey: 'curve',
    logoUrl: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg',
    homeUrl: 'https://curve.fi/',
  },
  yearn: {
    name: 'Yearn',
    logoKey: 'yearn',
    logoUrl: 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.svg',
    homeUrl: 'https://yearn.fi/',
  },
  convex: {
    name: 'Convex',
    logoKey: 'convex',
    logoUrl: 'https://www.convexfinance.com/static/icons/svg/convex.svg',
    homeUrl: 'https://www.convexfinance.com/',
  },
  pendle: {
    name: 'Pendle',
    logoKey: 'pendle',
    logoUrl: 'https://app.pendle.finance/favicon.png',
    homeUrl: 'https://app.pendle.finance/',
  },

  // Data aggregator
  defillama: {
    name: 'DeFiLlama',
    logoUrl: 'https://defillama.com/favicon.ico',
    homeUrl: 'https://defillama.com/yields',
  },
};

// Chain metadata for displaying chain info and logos
export const CHAIN_META = {
  Ethereum: {
    name: 'Ethereum',
    logoKey: 'ethereum',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    color: '#627EEA',
  },
  Arbitrum: {
    name: 'Arbitrum',
    logoKey: 'arbitrum',
    logoUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg',
    color: '#28A0F0',
  },
  Optimism: {
    name: 'Optimism',
    logoKey: 'optimism',
    logoUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg',
    color: '#FF0420',
  },
  Polygon: {
    name: 'Polygon',
    logoKey: 'polygon',
    logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    color: '#8247E5',
  },
  Base: {
    name: 'Base',
    logoKey: 'base',
    logoUrl: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/Base_Symbol_Blue.svg',
    color: '#0052FF',
  },
  Avalanche: {
    name: 'Avalanche',
    logoKey: 'avalanche',
    logoUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
    color: '#E84142',
  },
  BSC: {
    name: 'BNB Chain',
    logoKey: 'bnb',
    logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
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
