// Constants module - centralized exports for all constant data
//
// This folder contains:
// - platforms.js: Platform and chain metadata (logos, URLs)
// - cexLinks.js: CEX earn page link generators
// - defiLinks.js: DeFi protocol deposit URLs
// - newsSources.js: News sources and importance keywords

// Platform and chain metadata
export {
  PLATFORM_META,
  CHAIN_META,
  normalizePlatformKey,
  getChainMeta,
} from './platforms.js';

// CEX links
export {
  CEFI_ASSETS,
  CEX_EXCHANGES,
  getCexLinks,
} from './cexLinks.js';

// DeFi links
export {
  DEFI_PROJECT_LINKS,
  FORCE_OFFICIAL_URL_PROJECTS,
  CHAIN_MARKET_URLS,
  POOL_LINK_OVERRIDES,
  officialDepositUrl,
  defillamaPoolUrl,
  getBestDepositUrl,
} from './defiLinks.js';

// News sources and keywords
export {
  DEFAULT_NEWS_SOURCES,
  IMPORTANT_KEYWORDS,
} from './newsSources.js';
