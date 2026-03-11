// Morpho Protocol API integration
// Docs: https://api.morpho.org/graphql

import { config } from '../config/index.js';
import { analyzeSymbol } from '../apy-intelligence.js';
import { inferDirectStableToken } from './common.js';
import { fetchJsonWithTimeout } from '../http.js';

const GRAPHQL_URL = config.apy.sources.morphoGraphqlUrl;
const CHAIN_IDS = config.apy.sources.morphoChainIds;

const VAULTS_QUERY = `
  query MorphoVaultV2s($first: Int!, $chainIds: [Int!]) {
    vaultV2s(first: $first, where: { chainId_in: $chainIds }) {
      items {
        address
        symbol
        name
        totalAssetsUsd
        avgNetApy
        chain {
          id
          network
        }
      }
    }
  }
`;

function normalizeChain(chain = {}) {
  const chainId = Number(chain?.id);
  if (chainId === 1) return 'Ethereum';
  if (chainId === 8453) return 'Base';

  const network = String(chain?.network || '').toLowerCase();
  if (network === 'mainnet' || network === 'ethereum') return 'Ethereum';
  if (network === 'base') return 'Base';

  return chain?.network || null;
}

function normalizeApy(rawValue) {
  const value = Number(rawValue);
  if (!Number.isFinite(value) || value <= 0) return null;
  // Morpho API returns decimal APY (0.04), convert to percentage (4.0)
  return value <= 1 ? value * 100 : value;
}

function buildVaultUrl(address, chainName = '') {
  const chain = String(chainName || '').toLowerCase();
  const network = chain === 'base' ? 'base' : 'mainnet';
  if (address) {
    return `https://app.morpho.org/vault?vault=${address}&network=${network}`;
  }
  return `https://app.morpho.org/?network=${network}`;
}

/**
 * Fetch stablecoin vaults from Morpho official API
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
        query: VAULTS_QUERY,
        variables: { first: 500, chainIds: CHAIN_IDS },
      }),
    });
    if (Array.isArray(json?.errors) && json.errors.length > 0) {
      throw new Error(json.errors[0]?.message || 'morpho api returned graphql errors');
    }

    const items = Array.isArray(json?.data?.vaultV2s?.items)
      ? json.data.vaultV2s.items
      : [];

    return items
      .map((vault) => {
        const address = String(vault?.address || '').toLowerCase();
        if (!address) return null;

        const chain = normalizeChain(vault?.chain);
        const apy = normalizeApy(vault?.avgNetApy);
        const tvlUsd = Number(vault?.totalAssetsUsd);
        if (!Number.isFinite(apy) || !Number.isFinite(tvlUsd)) return null;

        const rawSymbol = String(vault?.symbol || '').trim();
        const rawSymbolInfo = analyzeSymbol(rawSymbol);
        const stableHint = inferDirectStableToken(`${rawSymbol} ${String(vault?.name || '')}`);
        const isDirectStable = rawSymbolInfo.directStableTokens.length > 0 || Boolean(stableHint);
        if (!isDirectStable) return null;

        const symbol = rawSymbolInfo.directStableTokens.length > 0
          ? rawSymbol
          : (stableHint || rawSymbol || 'UNKNOWN');

        return {
          pool: `morpho-v2:${chain || 'unknown'}:${address}`,
          project: 'morpho',
          chain,
          symbol,
          apy,
          tvlUsd,
          stablecoin: true,
          exposure: 'single',
          ilRisk: 'no',
          url: buildVaultUrl(address, chain),
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn('[sources/morpho] fetch failed:', e?.message || e);
    return [];
  }
}

export function isFamily(project = '') {
  return String(project || '').toLowerCase().startsWith('morpho');
}

export const poolIdPrefix = 'morpho-v2:';

export default { fetchPools, isFamily, poolIdPrefix };
