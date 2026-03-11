import cron from 'node-cron';
import { config } from './config/index.js';
import { pollNewsOnce } from './jobs/news.js';
import { pollApyOnce } from './jobs/apy.js';
import { pushTelegram } from './telegram.js';
import { refreshAllStrategies } from './strategies/index.js';
import { cache } from './cache.js';

const runningJobs = new Set();

function formatMemoryMb(bytes = 0) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function logMemoryUsage() {
  const memory = process.memoryUsage();
  const cacheStats = cache.stats();
  console.log(
    `[memory] rss=${formatMemoryMb(memory.rss)} heapUsed=${formatMemoryMb(memory.heapUsed)} `
      + `heapTotal=${formatMemoryMb(memory.heapTotal)} external=${formatMemoryMb(memory.external)} `
      + `arrayBuffers=${formatMemoryMb(memory.arrayBuffers)} uptime=${Math.floor(process.uptime())}s `
      + `cacheTotal=${cacheStats.total} cacheValid=${cacheStats.valid} cacheExpired=${cacheStats.expired}`
  );
}

async function runExclusiveJob(jobName, jobFn) {
  if (runningJobs.has(jobName)) {
    console.warn(`[scheduler] Skip ${jobName}: previous run still in progress`);
    return { skipped: true };
  }

  runningJobs.add(jobName);
  const startedAt = Date.now();
  try {
    const result = await jobFn();
    const elapsedMs = Date.now() - startedAt;
    console.log(`[scheduler] ${jobName} completed in ${elapsedMs}ms`);
    return { skipped: false, result };
  } catch (error) {
    console.error(`[scheduler] ${jobName} failed:`, error?.message || error);
    return { skipped: false, error: error?.message || String(error) };
  } finally {
    runningJobs.delete(jobName);
  }
}

/**
 * Start all scheduled jobs
 */
export function startScheduler() {
  // News polling job
  cron.schedule(config.cron.news, async () => {
    await runExclusiveJob('news-poll', async () => {
      await pollNewsOnce({
        pushFn: async ({ title, url, score }) => {
          // Push to default telegram only if configured
          await pushTelegram(`📰 ${title}\nscore=${score}\n${url}`);
        },
      });
    });
  });

  // APY data polling job
  cron.schedule(config.cron.apy, async () => {
    await runExclusiveJob('apy-poll', async () => {
      await pollApyOnce();
    });
  });

  // Cache refresh job - runs after APY data is updated
  cron.schedule(config.cron.cache, async () => {
    await runExclusiveJob('cache-refresh', async () => {
      console.log('[cache] Refreshing strategy caches...');
      const results = await refreshAllStrategies();
      const succeeded = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      console.log(`[cache] Strategy cache refresh completed: ${succeeded} succeeded, ${failed} failed`);
    });
  });

  // Memory usage log job
  cron.schedule(config.cron.memoryLog, async () => {
    await runExclusiveJob('memory-log', async () => {
      logMemoryUsage();
    });
  });

  // Cache sweep job
  cron.schedule(config.cron.cacheSweep, async () => {
    await runExclusiveJob('cache-sweep', async () => {
      const removed = cache.sweepExpired();
      if (removed > 0) {
        console.log(`[cache] Swept ${removed} expired entries`);
      }
    });
  });

  console.log('[scheduler] Cron jobs scheduled:');
  console.log(`  - News polling: ${config.cron.news}`);
  console.log(`  - APY polling: ${config.cron.apy}`);
  console.log(`  - Cache refresh: ${config.cron.cache}`);
  console.log(`  - Memory log: ${config.cron.memoryLog}`);
  console.log(`  - Cache sweep: ${config.cron.cacheSweep}`);
  logMemoryUsage();
}

/**
 * Run initial data fetch at startup
 */
export async function runInitialFetch() {
  if (!config.startup.runInitialFetch) {
    console.log('[scheduler] Initial fetch disabled by RUN_INITIAL_FETCH=false');
    return;
  }

  // Kick once at boot
  runExclusiveJob('news-poll', () => pollNewsOnce()).catch(() => {});
  runExclusiveJob('apy-poll', () => pollApyOnce()).catch(() => {});

  // Initial cache warm-up (run after APY data loads)
  if (!config.startup.runStrategyWarmup) {
    console.log('[scheduler] Strategy warm-up disabled by RUN_STRATEGY_WARMUP=false');
    return;
  }

  setTimeout(() => {
    runExclusiveJob('cache-refresh', () => refreshAllStrategies())
      .then((resultsWrapper) => {
        if (resultsWrapper?.skipped || !Array.isArray(resultsWrapper?.result)) return;
        const results = resultsWrapper.result;
        const succeeded = results.filter(r => r.success).length;
        console.log(`[cache] Initial cache warm-up completed: ${succeeded} strategies cached`);
      })
      .catch(error => {
        console.error('[cache] Initial cache warm-up failed:', error.message);
      });
  }, config.cache.strategyWarmupDelay);
}

export default { startScheduler, runInitialFetch };
