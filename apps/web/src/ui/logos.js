// Platform logos - local SVGs take priority over CDN URLs
export const LOGOS = {
  // CEX platforms (local SVGs)
  binance: '/logos/binance.svg',
  okx: '/logos/okx.svg',
  bybit: '/logos/bybit.svg',

  // DeFi protocols - use DefiLlama CDN for reliable logos
  aave: 'https://icons.llama.fi/aave.jpg',
  compound: 'https://icons.llama.fi/compound.jpg',
  morpho: 'https://icons.llama.fi/morpho.jpg',
  spark: 'https://icons.llama.fi/spark.jpg',
  euler: 'https://icons.llama.fi/euler.jpg',
  curve: 'https://icons.llama.fi/curve.jpg',
  yearn: 'https://icons.llama.fi/yearn-finance.jpg',
  convex: 'https://icons.llama.fi/convex-finance.jpg',
  pendle: 'https://icons.llama.fi/pendle.jpg',
};

// Chain logos - use DefiLlama CDN for reliable logos
export const CHAIN_LOGOS = {
  ethereum: 'https://icons.llama.fi/chains/rsz_ethereum.jpg',
  arbitrum: 'https://icons.llama.fi/chains/rsz_arbitrum.jpg',
  optimism: 'https://icons.llama.fi/chains/rsz_optimism.jpg',
  polygon: 'https://icons.llama.fi/chains/rsz_polygon.jpg',
  base: 'https://icons.llama.fi/chains/rsz_base.jpg',
  avalanche: 'https://icons.llama.fi/chains/rsz_avalanche.jpg',
  bnb: 'https://icons.llama.fi/chains/rsz_bsc.jpg',
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
