import { getLlamaPools } from './common.js';
import { baseApyPriorityStrategy } from './baseApyPriority.js';
import { conservativeCoreStrategy } from './conservativeCore.js';
import { liquidityBluechipStrategy } from './liquidityBluechip.js';
import { rewardBalancedStrategy } from './rewardBalanced.js';
import { opportunisticGuardedStrategy } from './opportunisticGuarded.js';
import { cache, TTL, CacheKey } from '../cache.js';

const STRATEGIES = new Map([
  [baseApyPriorityStrategy.id, baseApyPriorityStrategy],
  [conservativeCoreStrategy.id, conservativeCoreStrategy],
  [liquidityBluechipStrategy.id, liquidityBluechipStrategy],
  [rewardBalancedStrategy.id, rewardBalancedStrategy],
  [opportunisticGuardedStrategy.id, opportunisticGuardedStrategy],
]);

export function getStrategyIds() {
  return Array.from(STRATEGIES.keys());
}

export async function runStrategyById(strategyId, top = 10) {
  const strategy = STRATEGIES.get(strategyId);
  if (!strategy) return null;

  // Try cache first (1 hour TTL)
  const cacheKey = CacheKey.STRATEGY(strategyId, top);
  const cached = cache.get(cacheKey);
  if (cached && Array.isArray(cached.items) && cached.items.length > 0) {
    return cached;
  }
  if (cached) {
    cache.delete(cacheKey);
  }

  // Generate strategy result
  const pools = await getLlamaPools();
  const items = strategy.run(pools, top);

  const result = {
    strategy: {
      id: strategy.id,
      name: strategy.name,
      description: strategy.description,
    },
    generatedAt: new Date().toISOString(),
    items,
  };

  // Cache for 1 hour
  cache.set(cacheKey, result, TTL.ONE_HOUR);

  return result;
}

/**
 * Refresh all strategy caches
 * Call this from a cron job to pre-warm caches
 */
export async function refreshAllStrategies() {
  const strategyIds = getStrategyIds();
  const tops = [10, 20]; // Common top values

  const results = [];
  for (const strategyId of strategyIds) {
    for (const top of tops) {
      try {
        // Clear existing cache
        const cacheKey = CacheKey.STRATEGY(strategyId, top);
        cache.delete(cacheKey);

        // Regenerate
        const result = await runStrategyById(strategyId, top);
        results.push({ strategyId, top, success: true });
      } catch (error) {
        console.error(`[strategy] Failed to refresh ${strategyId} (top=${top}):`, error.message);
        results.push({ strategyId, top, success: false, error: error.message });
      }
    }
  }

  return results;
}
