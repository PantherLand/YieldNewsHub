// Centralized configuration for the server
// All environment variables are accessed from this module

function getPositiveInteger(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const normalized = Math.floor(parsed);
  if (normalized <= 0) return fallback;
  return normalized;
}

// Build allowed origins array from environment variables
function buildAllowedOrigins() {
  const origins = [];
  if (process.env.WEB_ORIGIN) origins.push(process.env.WEB_ORIGIN);
  if (process.env.WEB_ORIGIN_TEST) origins.push(process.env.WEB_ORIGIN_TEST);
  // If no origins specified, allow all (for local dev)
  return origins.length > 0 ? origins : true;
}

export const config = {
  // Server
  port: Number(process.env.PORT || 8787),
  webOrigin: buildAllowedOrigins(),

  // Cron schedules
  cron: {
    news: process.env.NEWS_POLL_CRON || '*/5 * * * *',
    apy: process.env.APY_POLL_CRON || '0 * * * *',
    cache: process.env.CACHE_REFRESH_CRON || '0 * * * *',
    memoryLog: process.env.MEMORY_LOG_CRON || '*/5 * * * *',
  },

  // Network request settings
  network: {
    requestTimeoutMs: getPositiveInteger(process.env.REQUEST_TIMEOUT_MS, 15_000),
    rssTimeoutMs: getPositiveInteger(process.env.RSS_TIMEOUT_MS, 20_000),
  },

  // Cache settings
  cache: {
    cexLinksTtl: 60 * 60_000, // 1 hour
    strategyWarmupDelay: 5000, // 5 seconds
  },

  // API limits
  api: {
    maxLimit: 200,
    defaultLimit: 50,
    maxStrategyTop: 30,
    defaultStrategyTop: 10,
  },

  // APY data source constants (non-env, product-level defaults)
  apy: {
    sources: {
      morphoGraphqlUrl: 'https://api.morpho.org/graphql',
      morphoChainIds: [1, 8453],
      venusApiBaseUrl: 'https://api.venus.io',
      venusChainIds: [56],
      lendleGraphqlUrl: 'https://subgraph.lendle.xyz/graphql',
    },
  },
};

export default config;
