// Map DeFiLlama `project` identifiers to official deposit pages.
// If a project isn't mapped, we fall back to the DeFiLlama pool page.

export const DEFI_PROJECT_LINKS = {
  // Lending protocols
  'aave-v3': 'https://app.aave.com/',
  'compound-v3': 'https://app.compound.finance/',
  'morpho': 'https://app.morpho.org/',
  'spark': 'https://app.spark.fi/',
  'euler-v2': 'https://app.euler.finance/',
  'maple': 'https://app.maple.finance/',
  'maple-finance': 'https://app.maple.finance/',
  'moonwell': 'https://moonwell.fi/',
  'fluid': 'https://fluid.io/',
  'venus': 'https://app.venus.io/',
  'autofinance': 'https://autofarm.network/',
  'autofarm': 'https://autofarm.network/',
  'wasabi': 'https://wasabi.xyz/',
  'wasabi-protocol': 'https://wasabi.xyz/',
  // Additional protocol app links
  'avantis': 'https://www.avantisfi.com/earn',
  'avantisfi': 'https://www.avantisfi.com/earn',
  'goldfinch': 'https://app.goldfinch.finance/earn',
  'goldfinch-protocol': 'https://app.goldfinch.finance/earn',
  // DEX / Yield
  'curve-dex': 'https://curve.fi/',
  'yearn-finance': 'https://yearn.fi/',
  'convex-finance': 'https://www.convexfinance.com/',
  'pendle': 'https://app.pendle.finance/',
};

// Prefer official app URLs for protocols where adapter URLs are often non-actionable.
const FORCE_OFFICIAL_URL_PROJECTS = new Set([
  'maple',
  'maple-finance',
  'moonwell',
  'fluid',
  'autofinance',
  'autofarm',
  'wasabi',
  'wasabi-protocol',
  'avantis',
  'avantisfi',
  'goldfinch',
  'goldfinch-protocol',
]);

// Chain-specific market URLs for protocols that support direct deep linking
const CHAIN_MARKET_URLS = {
  'aave-v3': {
    Ethereum: 'https://app.aave.com/?marketName=proto_mainnet_v3',
    Arbitrum: 'https://app.aave.com/?marketName=proto_arbitrum_v3',
    Optimism: 'https://app.aave.com/?marketName=proto_optimism_v3',
    Polygon: 'https://app.aave.com/?marketName=proto_polygon_v3',
    Base: 'https://app.aave.com/?marketName=proto_base_v3',
    Avalanche: 'https://app.aave.com/?marketName=proto_avalanche_v3',
    BSC: 'https://app.aave.com/?marketName=proto_bnb_v3',
  },
  'compound-v3': {
    Ethereum: 'https://app.compound.finance/',
    Arbitrum: 'https://app.compound.finance/?market=arbitrum-usdc',
    Polygon: 'https://app.compound.finance/?market=polygon-usdc',
    Base: 'https://app.compound.finance/?market=base-usdc',
  },
  'morpho': {
    Ethereum: 'https://app.morpho.org/?network=mainnet',
    Base: 'https://app.morpho.org/?network=base',
  },
  'spark': {
    Ethereum: 'https://app.spark.fi/',
  },
  'curve-dex': {
    Ethereum: 'https://curve.fi/#/ethereum/pools',
    Arbitrum: 'https://curve.fi/#/arbitrum/pools',
    Optimism: 'https://curve.fi/#/optimism/pools',
    Polygon: 'https://curve.fi/#/polygon/pools',
    Base: 'https://curve.fi/#/base/pools',
    Avalanche: 'https://curve.fi/#/avalanche/pools',
  },
  'convex-finance': {
    Ethereum: 'https://www.convexfinance.com/stake',
    Arbitrum: 'https://www.convexfinance.com/stake?chain=arbitrum',
  },
  'pendle': {
    Ethereum: 'https://app.pendle.finance/trade/markets',
    Arbitrum: 'https://app.pendle.finance/trade/markets?chain=arbitrum',
  },
  'venus': {
    BSC: 'https://app.venus.io/core-pool?chainId=56',
  },
};

// Optional manual overrides for specific pool ids (highest precision).
// Example:
//   '57f95d9e-...' : 'https://app.protocol.xyz/deposit?market=usdc'
const POOL_LINK_OVERRIDES = {};

function isHttpUrl(value) {
  const v = String(value || '').trim();
  return v.startsWith('https://') || v.startsWith('http://');
}

function isDefiLlamaPoolUrl(value) {
  const v = String(value || '').trim().toLowerCase();
  return v.includes('defillama.com/yields/pool/');
}

export function officialDepositUrl(project, { chain, symbol } = {}) {
  const key = String(project || '').toLowerCase();

  // Try chain-specific URL first
  if (chain && CHAIN_MARKET_URLS[key]?.[chain]) {
    return CHAIN_MARKET_URLS[key][chain];
  }

  // Fall back to base URL
  const base = DEFI_PROJECT_LINKS[key];
  if (!base) return null;

  return base;
}

export function defillamaPoolUrl(poolId) {
  return poolId ? `https://defillama.com/yields/pool/${poolId}` : null;
}

export function getBestDepositUrl({ poolId, project, chain, symbol, adapterUrl } = {}) {
  const override = poolId ? POOL_LINK_OVERRIDES[String(poolId)] : null;
  if (isHttpUrl(override)) return override;

  const projectKey = String(project || '').toLowerCase();
  const official = officialDepositUrl(project, { chain, symbol });

  if (FORCE_OFFICIAL_URL_PROJECTS.has(projectKey) && isHttpUrl(official)) {
    return official;
  }

  // Adapter URL is often the most precise, unless it's just a DeFiLlama fallback.
  if (isHttpUrl(adapterUrl) && !isDefiLlamaPoolUrl(adapterUrl)) {
    return adapterUrl;
  }

  if (isHttpUrl(official)) return official;

  if (isHttpUrl(adapterUrl)) return adapterUrl;

  return defillamaPoolUrl(poolId);
}
