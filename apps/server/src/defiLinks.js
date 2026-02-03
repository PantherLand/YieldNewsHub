// Map DeFiLlama `project` identifiers to official deposit pages.
// If a project isn't mapped, we fall back to the DeFiLlama pool page.

export const DEFI_PROJECT_LINKS = {
  // Lending protocols
  'aave-v3': 'https://app.aave.com/',
  'compound-v3': 'https://app.compound.finance/',
  'morpho': 'https://app.morpho.org/',
  'spark': 'https://app.spark.fi/',
  'euler-v2': 'https://app.euler.finance/',
  // DEX / Yield
  'curve-dex': 'https://curve.fi/',
  'yearn-finance': 'https://yearn.fi/',
  'convex-finance': 'https://www.convexfinance.com/',
  'pendle': 'https://app.pendle.finance/',
};

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
};

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
