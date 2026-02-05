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
  venus: 'https://icons.llama.fi/venus.jpg',
  lendle: 'https://icons.llama.fi/lendle.jpg',
  pancakeswap: 'https://icons.llama.fi/pancakeswap.jpg',
  curve: 'https://icons.llama.fi/curve.jpg',
  yearn: 'https://icons.llama.fi/yearn-finance.jpg',
  convex: 'https://icons.llama.fi/convex-finance.jpg',
  pendle: 'https://icons.llama.fi/pendle.jpg',
};

// Chain logos - use DefiLlama CDN for reliable logos
// Keys are lowercase for consistent lookup
export const CHAIN_LOGOS = {
  ethereum: 'https://icons.llama.fi/chains/rsz_ethereum.jpg',
  arbitrum: 'https://icons.llama.fi/chains/rsz_arbitrum.jpg',
  optimism: 'https://icons.llama.fi/chains/rsz_optimism.jpg',
  polygon: 'https://icons.llama.fi/chains/rsz_polygon.jpg',
  base: 'https://icons.llama.fi/chains/rsz_base.jpg',
  avalanche: 'https://icons.llama.fi/chains/rsz_avalanche.jpg',
  bsc: 'https://icons.llama.fi/chains/rsz_bsc.jpg',
  bnb: 'https://icons.llama.fi/chains/rsz_bsc.jpg',
  gnosis: 'https://icons.llama.fi/chains/rsz_gnosis.jpg',
  fantom: 'https://icons.llama.fi/chains/rsz_fantom.jpg',
  linea: 'https://icons.llama.fi/chains/rsz_linea.jpg',
  scroll: 'https://icons.llama.fi/chains/rsz_scroll.jpg',
  zksync: 'https://icons.llama.fi/chains/rsz_zksync-era.jpg',
  mantle: 'https://icons.llama.fi/chains/rsz_mantle.jpg',
  blast: 'https://icons.llama.fi/chains/rsz_blast.jpg',
};

// Chain colors for badges - supports both title case and lowercase lookups
const chainColorMap = {
  ethereum: '#627EEA',
  arbitrum: '#28A0F0',
  optimism: '#FF0420',
  polygon: '#8247E5',
  base: '#0052FF',
  avalanche: '#E84142',
  bsc: '#F0B90B',
  bnb: '#F0B90B',
  gnosis: '#04795B',
  fantom: '#1969FF',
  linea: '#61DFFF',
  scroll: '#FFEEDA',
  zksync: '#8C8DFC',
  mantle: '#000000',
  blast: '#FCFC03',
};

// Export CHAIN_COLORS with both title case and lowercase keys for compatibility
export const CHAIN_COLORS = {
  // Title case (legacy format)
  Ethereum: chainColorMap.ethereum,
  Arbitrum: chainColorMap.arbitrum,
  Optimism: chainColorMap.optimism,
  Polygon: chainColorMap.polygon,
  Base: chainColorMap.base,
  Avalanche: chainColorMap.avalanche,
  BSC: chainColorMap.bsc,
  Gnosis: chainColorMap.gnosis,
  Fantom: chainColorMap.fantom,
  Linea: chainColorMap.linea,
  Scroll: chainColorMap.scroll,
  zkSync: chainColorMap.zksync,
  Mantle: chainColorMap.mantle,
  Blast: chainColorMap.blast,
  // Lowercase (new format)
  ...chainColorMap,
};

// Helper function to get chain logo with case-insensitive lookup
export function getChainLogo(chain) {
  if (!chain) return null;
  const key = String(chain).toLowerCase().replace(/[^a-z0-9]/g, '');
  return CHAIN_LOGOS[key] || null;
}

// Helper function to get chain color with case-insensitive lookup
export function getChainColor(chain) {
  if (!chain) return null;
  // Try exact match first
  if (CHAIN_COLORS[chain]) return CHAIN_COLORS[chain];
  // Try lowercase
  const key = String(chain).toLowerCase().replace(/[^a-z0-9]/g, '');
  return chainColorMap[key] || null;
}
