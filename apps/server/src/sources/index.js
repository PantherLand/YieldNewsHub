// Third-party API sources for APY data
//
// Each source module exports:
//   - fetchPools(): Promise<Array> - Fetch stablecoin pools
//   - isFamily(project): boolean - Check if project belongs to this source
//   - poolIdPrefix: string - Prefix for pool IDs from this source
//
// To add a new source:
//   1. Create a new file (e.g., newprotocol.js)
//   2. Implement fetchPools(), isFamily(), poolIdPrefix
//   3. Add to SOURCES array below

import * as morpho from './morpho.js';
import * as venus from './venus.js';
import * as lendle from './lendle.js';

// All available sources - add new sources here
export const SOURCES = [
  { name: 'morpho', module: morpho },
  { name: 'venus', module: venus },
  { name: 'lendle', module: lendle },
];

/**
 * Fetch pools from all sources in parallel
 * @returns {Promise<{[key: string]: Array}>} Object with source names as keys
 */
export async function fetchAllPools() {
  const results = {};

  await Promise.all(
    SOURCES.map(async ({ name, module }) => {
      try {
        results[name] = await module.fetchPools();
        console.log(`[sources/${name}] fetched ${results[name].length} pools`);
      } catch (e) {
        console.warn(`[sources/${name}] fetch error:`, e?.message || e);
        results[name] = [];
      }
    })
  );

  return results;
}

/**
 * Check if a project belongs to any official source
 * @param {string} project - Project name from DeFiLlama
 * @returns {string|null} Source name if matched, null otherwise
 */
export function matchSource(project) {
  for (const { name, module } of SOURCES) {
    if (module.isFamily(project)) {
      return name;
    }
  }
  return null;
}

/**
 * Get source by name
 * @param {string} name - Source name
 * @returns {Object|null} Source module or null
 */
export function getSource(name) {
  const source = SOURCES.find(s => s.name === name);
  return source?.module || null;
}

// Re-export individual sources for direct access
export { morpho, venus, lendle };

// Re-export common utilities
export * from './common.js';
