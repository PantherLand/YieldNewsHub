// Centralized configuration for the server
// All environment variables are accessed from this module

export const config = {
  // Server
  port: Number(process.env.PORT || 8787),
  webOrigin: process.env.WEB_ORIGIN || true,

  // Cron schedules
  cron: {
    news: process.env.NEWS_POLL_CRON || '*/5 * * * *',
    apy: process.env.APY_POLL_CRON || '0 * * * *',
    cache: process.env.CACHE_REFRESH_CRON || '0 * * * *',
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
};

export default config;
