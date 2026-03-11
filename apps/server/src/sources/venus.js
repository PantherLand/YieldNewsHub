// Venus Protocol API integration
// Docs: https://api.venus.io

import { config } from '../config/index.js';
import { toNumber, normalizePercent, pickFirstNumber, pickMaxNumber, inferDirectStableToken } from './common.js';
import { fetchJsonWithTimeout } from '../http.js';

const API_BASE_URL = config.apy.sources.venusApiBaseUrl;
const CHAIN_IDS = config.apy.sources.venusChainIds;

function chainName(chainId) {
  if (Number(chainId) === 56) return 'BSC';
  return null;
}

function buildMarketUrl(chainId) {
  return `https://app.venus.io/core-pool?chainId=${chainId}`;
}

/**
 * Fetch stablecoin markets from Venus official API
 * @returns {Promise<Array>} Array of pool objects
 */
export async function fetchPools() {
  const output = [];

  for (const chainId of CHAIN_IDS) {
    const chain = chainName(chainId);
    if (!chain) continue;

    try {
      const marketsUrl = new URL('/markets', API_BASE_URL);
      marketsUrl.searchParams.set('chainId', String(chainId));
      marketsUrl.searchParams.set('limit', '500');

      const json = await fetchJsonWithTimeout(marketsUrl.toString(), {
        headers: {
          'User-Agent': 'YieldNewsHub/0.1',
          'accept-version': 'stable',
        },
      });
      const markets = Array.isArray(json?.result)
        ? json.result
        : Array.isArray(json?.data?.result)
          ? json.data.result
          : [];

      for (const market of markets) {
        const symbolText = `${market?.underlyingSymbol || ''} ${market?.symbol || ''} ${market?.name || ''}`;
        const stableToken = inferDirectStableToken(symbolText);
        if (!stableToken) continue;

        // Venus payloads may carry multiple supply APY fields; pick the highest base supply APY.
        const apy = pickMaxNumber(
          normalizePercent(market?.supplyApy),
          normalizePercent(market?.supplyApyV3),
          normalizePercent(market?.supplyApyV2),
          normalizePercent(market?.apy),
          normalizePercent(market?.supplyRate),
        );
        if (apy === null) continue;

        const liquidityCents = toNumber(market?.liquidityCents);
        const tvlUsd = liquidityCents !== null
          ? liquidityCents / 100
          : pickFirstNumber(market?.tvlUsd, market?.totalSupplyUsd, market?.liquidityUsd);
        if (tvlUsd === null || tvlUsd <= 0) continue;

        const marketAddress = String(
          market?.vTokenAddress
            || market?.address
            || market?.id
            || ''
        ).toLowerCase();

        output.push({
          pool: `venus:${chain.toLowerCase()}:${marketAddress || stableToken.toLowerCase()}`,
          project: 'venus',
          chain,
          symbol: stableToken,
          apy,
          tvlUsd,
          stablecoin: true,
          exposure: 'single',
          ilRisk: 'no',
          url: buildMarketUrl(chainId),
        });
      }
    } catch (e) {
      console.warn(`[sources/venus] fetch failed (chainId=${chainId}):`, e?.message || e);
    }
  }

  return output;
}

export function isFamily(project = '') {
  return String(project || '').toLowerCase().startsWith('venus');
}

export const poolIdPrefix = 'venus:';

export default { fetchPools, isFamily, poolIdPrefix };
