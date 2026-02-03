// Platform logos - local SVGs take priority over CDN URLs
export const LOGOS = {
  // CEX platforms (local SVGs)
  binance: '/logos/binance.svg',
  okx: '/logos/okx.svg',
  bybit: '/logos/bybit.svg',

  // DeFi protocols - use CDN/official URLs as fallback
  aave: 'https://cryptologos.cc/logos/aave-aave-logo.svg',
  compound: 'https://cryptologos.cc/logos/compound-comp-logo.svg',
  morpho: 'https://cdn.morpho.org/assets/logos/morpho.svg',
  spark: 'https://app.spark.fi/spark-logo.svg',
  euler: 'https://www.euler.finance/logo192.png',
  curve: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg',
  yearn: 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.svg',
  convex: 'https://www.convexfinance.com/static/icons/svg/convex.svg',
  pendle: 'https://app.pendle.finance/favicon.png',
};

// Chain logos
export const CHAIN_LOGOS = {
  ethereum: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  arbitrum: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg',
  optimism: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg',
  polygon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
  base: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/Base_Symbol_Blue.svg',
  avalanche: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
  bnb: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
};

// Chain colors for badges
export const CHAIN_COLORS = {
  Ethereum: '#627EEA',
  Arbitrum: '#28A0F0',
  Optimism: '#FF0420',
  Polygon: '#8247E5',
  Base: '#0052FF',
  Avalanche: '#E84142',
  BSC: '#F0B90B',
};
