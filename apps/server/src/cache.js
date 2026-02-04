/**
 * Cache Service
 * Provides in-memory caching with configurable TTL
 */

class CacheService {
  constructor() {
    this.store = new Map();
  }

  /**
   * Get value from cache
   * @param {string} key
   * @returns {any|null} cached value or null if expired/not found
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set value in cache
   * @param {string} key
   * @param {any} value
   * @param {number} ttlMs - TTL in milliseconds
   */
  set(key, value, ttlMs) {
    const now = Date.now();
    this.store.set(key, {
      value,
      expiresAt: now + ttlMs,
      cachedAt: now,
    });
  }

  /**
   * Delete key from cache
   * @param {string} key
   */
  delete(key) {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get all keys
   */
  keys() {
    return Array.from(this.store.keys());
  }

  /**
   * Get cache stats
   */
  stats() {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    const valid = entries.filter(([_, entry]) => now <= entry.expiresAt);
    const expired = entries.length - valid.length;

    return {
      total: entries.length,
      valid: valid.length,
      expired,
      keys: valid.map(([key]) => key),
    };
  }
}

// Singleton instance
export const cache = new CacheService();

// Cache TTL constants (in milliseconds)
export const TTL = {
  ONE_MINUTE: 60_000,
  FIVE_MINUTES: 5 * 60_000,
  TEN_MINUTES: 10 * 60_000,
  THIRTY_MINUTES: 30 * 60_000,
  ONE_HOUR: 60 * 60_000,
  TWO_HOURS: 2 * 60 * 60_000,
  ONE_DAY: 24 * 60 * 60_000,
};

// Cache key builders
export const CacheKey = {
  STRATEGY: (strategyId, top) => `strategy:${strategyId}:${top}`,
  LLAMA_POOLS: () => 'llama:pools',
  CEX_LINKS: () => 'cex:links',
  APY_LIST: (params) => `apy:list:${JSON.stringify(params)}`,
};
