import cron from 'node-cron';
import { config } from './config/index.js';
import { pollNewsOnce } from './jobs/news.js';
import { pollApyOnce } from './jobs/apy.js';
import { pushTelegram } from './telegram.js';
import { refreshAllStrategies } from './strategies/index.js';

/**
 * Start all scheduled jobs
 */
export function startScheduler() {
  // News polling job
  cron.schedule(config.cron.news, async () => {
    await pollNewsOnce({
      pushFn: async ({ title, url, score }) => {
        // Push to default telegram only if configured
        await pushTelegram(`📰 ${title}\nscore=${score}\n${url}`);
      },
    });
  });

  // APY data polling job
  cron.schedule(config.cron.apy, async () => {
    await pollApyOnce();
  });

  // Cache refresh job - runs after APY data is updated
  cron.schedule(config.cron.cache, async () => {
    console.log('[cache] Refreshing strategy caches...');
    try {
      const results = await refreshAllStrategies();
      const succeeded = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      console.log(`[cache] Strategy cache refresh completed: ${succeeded} succeeded, ${failed} failed`);
    } catch (error) {
      console.error('[cache] Strategy cache refresh failed:', error.message);
    }
  });

  console.log('[scheduler] Cron jobs scheduled:');
  console.log(`  - News polling: ${config.cron.news}`);
  console.log(`  - APY polling: ${config.cron.apy}`);
  console.log(`  - Cache refresh: ${config.cron.cache}`);
}

/**
 * Run initial data fetch at startup
 */
export async function runInitialFetch() {
  // Kick once at boot
  pollNewsOnce().catch(() => {});
  pollApyOnce().catch(() => {});

  // Initial cache warm-up (run after APY data loads)
  setTimeout(() => {
    refreshAllStrategies()
      .then(results => {
        const succeeded = results.filter(r => r.success).length;
        console.log(`[cache] Initial cache warm-up completed: ${succeeded} strategies cached`);
      })
      .catch(error => {
        console.error('[cache] Initial cache warm-up failed:', error.message);
      });
  }, config.cache.strategyWarmupDelay);
}

export default { startScheduler, runInitialFetch };
