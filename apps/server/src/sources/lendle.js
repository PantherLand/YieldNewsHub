// Lendle Protocol API integration (Mantle chain)
// Docs: https://subgraph.lendle.xyz/graphql

import { config } from '../config/index.js';
import { toNumber, normalizePercent, pickFirstNumber, inferDirectStableToken } from './common.js';
import { fetchJsonWithTimeout } from '../http.js';

const GRAPHQL_URL = config.apy.sources.lendleGraphqlUrl;

const RESERVES_QUERY = `
  query LendleReserves($first: Int!) {
    reserves(first: $first) {
      id
      symbol
      name
      decimals
      supplyApy
      liquidityRate
      totalSupplyUsd
      tvlUsd
      totalATokenSupply
      availableLiquidity
      underlyingSymbol
      underlyingAsset
      priceInUsd
      price {
        priceInUsd
      }
    }
  }
`;

function apyFromReserve(reserve = {}) {
  const direct = normalizePercent(reserve?.supplyApy);
  if (direct !== null) return direct;

  const rateRay = toNumber(reserve?.liquidityRate);
  if (rateRay !== null && rateRay > 0) {
    // Aave-style ray annual rate: 1e27 = 100%.
    return rateRay / 1e25;
  }

  return null;
}

function tvlFromReserve(reserve = {}) {
  const direct = pickFirstNumber(
    reserve?.tvlUsd,
    reserve?.totalSupplyUsd,
    reserve?.totalLiquidityUsd
  );
  if (direct !== null && direct > 0) return direct;

  const totalSupply = pickFirstNumber(reserve?.totalATokenSupply, reserve?.availableLiquidity);
  const decimals = toNumber(reserve?.decimals);
  const price = pickFirstNumber(reserve?.priceInUsd, reserve?.price?.priceInUsd);
  if (totalSupply === null || decimals === null || price === null) return null;

  return (totalSupply / (10 ** decimals)) * price;
}

/**
 * Fetch stablecoin reserves from Lendle subgraph
 * @returns {Promise<Array>} Array of pool objects
 */
export async function fetchPools() {
  try {
    const json = await fetchJsonWithTimeout(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YieldNewsHub/0.1',
      },
      body: JSON.stringify({
        query: RESERVES_QUERY,
        variables: { first: 300 },
      }),
    });
    if (Array.isArray(json?.errors) && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'lendle graphql returned errors');
    }

    const reserves = Array.isArray(json?.data?.reserves) ? json.data.reserves : [];

    return reserves
      .map((reserve) => {
        const stableToken = inferDirectStableToken(
          `${reserve?.underlyingSymbol || ''} ${reserve?.symbol || ''} ${reserve?.name || ''}`
        );
        if (!stableToken) return null;

        const apy = apyFromReserve(reserve);
        const tvlUsd = tvlFromReserve(reserve);
        if (apy === null || tvlUsd === null || tvlUsd <= 0) return null;

        const reserveId = String(
          reserve?.underlyingAsset
            || reserve?.id
            || reserve?.symbol
            || stableToken
        ).toLowerCase();

        return {
          pool: `lendle:mantle:${reserveId}`,
          project: 'lendle',
          chain: 'Mantle',
          symbol: stableToken,
          apy,
          tvlUsd,
          stablecoin: true,
          exposure: 'single',
          ilRisk: 'no',
          url: 'https://app.lendle.xyz/market',
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn('[sources/lendle] fetch failed:', e?.message || e);
    return [];
  }
}

export function isFamily(project = '') {
  return String(project || '').toLowerCase().startsWith('lendle');
}

export const poolIdPrefix = 'lendle:';

export default { fetchPools, isFamily, poolIdPrefix };
