export const DEFAULT_NEWS_SOURCES = [
  // === Macro/Regulatory (Low frequency, high impact) ===
  {
    name: 'Federal Reserve (Press Releases)',
    kind: 'RSS',
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
  },
  {
    name: 'U.S. Treasury (Press Releases)',
    kind: 'RSS',
    url: 'https://home.treasury.gov/rss/press-releases.xml',
  },
  {
    name: 'SEC (Press Releases)',
    kind: 'RSS',
    url: 'https://www.sec.gov/news/pressreleases.rss',
  },

  // === CEX Announcements (Medium frequency) ===
  {
    name: 'Binance Announcements',
    kind: 'RSS',
    url: 'https://www.binance.com/en/support/announcement/rss',
  },

  // === Crypto News (High frequency) ===
  {
    name: 'CoinDesk',
    kind: 'RSS',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  },
  {
    name: 'CoinTelegraph',
    kind: 'RSS',
    url: 'https://cointelegraph.com/rss',
  },
  {
    name: 'Decrypt',
    kind: 'RSS',
    url: 'https://decrypt.co/feed',
  },
  {
    name: 'The Block',
    kind: 'RSS',
    url: 'https://www.theblock.co/rss.xml',
  },

  // === DeFi Specific ===
  {
    name: 'DeFi Llama Blog',
    kind: 'RSS',
    url: 'https://defillama.com/blog/rss.xml',
  },

  // === Protocol Blogs (High quality, low frequency) ===
  {
    name: 'Aave Blog',
    kind: 'RSS',
    url: 'https://aave.com/rss.xml',
  },
  {
    name: 'Curve Finance Blog',
    kind: 'RSS',
    url: 'https://news.curve.fi/rss/',
  },

  // === Chinese News Sources (中文新闻源) ===
  // Note: These sources provide Chinese language crypto news
  // Uncomment if you want to add Chinese news support
  /*
  {
    name: '金色财经 (Golden Finance)',
    kind: 'RSS',
    url: 'https://www.jinse.com/lives/rss',
  },
  {
    name: 'PANews',
    kind: 'RSS',
    url: 'https://www.panewslab.com/rss/index.xml',
  },
  {
    name: 'BlockBeats (律动)',
    kind: 'RSS',
    url: 'https://www.theblockbeats.info/rss/index.xml',
  },
  */
];

export const IMPORTANT_KEYWORDS = [
  // === Macro/Economic ===
  'fed',
  'fomc',
  'interest rate',
  'inflation',
  'cpi',
  'ppi',
  'jobs',
  'payroll',
  'unemployment',
  'federal reserve',
  'treasury',

  // === Regulatory ===
  'sec',
  'cftc',
  'lawsuit',
  'regulation',
  'compliance',
  'etf',
  'approval',
  'ban',

  // === DeFi/Protocol ===
  'aave',
  'compound',
  'curve',
  'uniswap',
  'maker',
  'defi',
  'yield',
  'liquidity',
  'tvl',
  'audit',

  // === Stablecoins ===
  'stablecoin',
  'usdc',
  'usdt',
  'dai',
  'usde',
  'depeg',
  'peg',

  // === Risk Events ===
  'hack',
  'exploit',
  'vulnerability',
  'security',
  'breach',
  'attack',
  'rug pull',
  'scam',

  // === Exchanges ===
  'binance',
  'coinbase',
  'okx',
  'bybit',
  'kraken',
  'listing',
  'delisting',

  // === Market Events ===
  'crash',
  'rally',
  'surge',
  'drop',
  'volatility',
  'liquidity crisis',
];
