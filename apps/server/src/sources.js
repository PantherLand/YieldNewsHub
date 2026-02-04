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
  // High-quality Chinese crypto news sources (tested and verified)
  {
    name: '律动BlockBeats',
    kind: 'RSS',
    url: 'https://api.theblockbeats.news/v2/rss/all',
  },

  // Note: 區塊客 Blockcast has slow/hanging RSS parsing issues
  // Temporarily disabled to avoid timeout
  /*
  {
    name: '區塊客 Blockcast',
    kind: 'RSS',
    url: 'https://blockcast.it/feed/',
  },
  */

  // Note: 金色财经 requires self-hosted RSSHub instance
  // Uncomment if you have deployed your own RSSHub
  /*
  {
    name: '金色财经快讯',
    kind: 'RSS',
    url: 'https://your-rsshub-domain.com/jinse/lives',
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

  // === Chinese Keywords (中文关键词) ===
  // Crypto basics
  '比特币',
  '以太坊',
  '加密货币',
  '数字货币',
  '区块链',
  '虚拟货币',

  // DeFi & Protocols
  'defi',
  '去中心化',
  '流动性',
  '质押',
  '挖矿',
  '收益',
  '稳定币',

  // Market & Trading
  '暴涨',
  '暴跌',
  '牛市',
  '熊市',
  '减半',
  '突破',
  '回调',
  '爆仓',

  // Regulatory & Compliance
  '监管',
  '合规',
  '央行',
  '数字人民币',
  '香港',
  '新加坡',
  '政策',
  '禁令',

  // Risk & Security
  '黑客',
  '漏洞',
  '安全',
  '被盗',
  '诈骗',
  '跑路',

  // Exchanges & Platforms
  '交易所',
  '上线',
  '下架',
  '提币',
  '充币',
];
