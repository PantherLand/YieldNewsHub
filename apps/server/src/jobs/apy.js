import fetch from 'node-fetch';
import { prisma } from '../db.js';
import { getBestDepositUrl } from '../defiLinks.js';
import { analyzeSymbol } from '../apy-intelligence.js';
import { config } from '../config/index.js';

// APY aggregation:
// - DeFi: DeFiLlama yields API (no key)
// - CeFi: links are served separately (no APY aggregation for now)
//
// DeFiLlama yields API:
// https://yields.llama.fi/pools

const MORPHO_GRAPHQL_URL = config.apy.sources.morphoGraphqlUrl;
const MORPHO_CHAIN_IDS = config.apy.sources.morphoChainIds;
const VENUS_API_BASE_URL = config.apy.sources.venusApiBaseUrl;
const VENUS_CHAIN_IDS = config.apy.sources.venusChainIds;
const LENDLE_GRAPHQL_URL = config.apy.sources.lendleGraphqlUrl;

const MORPHO_VAULTS_QUERY = `
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

const LENDLE_RESERVES_QUERY = `
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

function isMorphoFamilyProject(project = '') {
  return String(project || '').toLowerCase().startsWith('morpho');
}

function isVenusFamilyProject(project = '') {
  return String(project || '').toLowerCase().startsWith('venus');
}

function isLendleFamilyProject(project = '') {
  return String(project || '').toLowerCase().startsWith('lendle');
}

function isPancakeFamilyProject(project = '') {
  return String(project || '').toLowerCase().startsWith('pancakeswap');
}

function isNamedStableVaultProject(project = '') {
  return [
    'aave-v3',
    'compound-v3',
    'spark',
    'euler-v2',
    'maple',
    'maple-finance',
    'moonwell',
    'fluid',
  ].includes(project)
    || isMorphoFamilyProject(project)
    || isVenusFamilyProject(project)
    || isLendleFamilyProject(project);
}

function shouldNormalizeWrappedStableSymbol(project = '') {
  return isMorphoFamilyProject(project)
    || isVenusFamilyProject(project)
    || isLendleFamilyProject(project);
}

function inferDirectStableToken(text = '') {
  const normalized = String(text || '').toUpperCase();
  if (/(^|[^A-Z0-9])USDC([^A-Z0-9]|$)/.test(normalized)) return 'USDC';
  if (/(^|[^A-Z0-9])USDT([^A-Z0-9]|$)/.test(normalized)) return 'USDT';
  if (/(^|[^A-Z0-9])USDE([^A-Z0-9]|$)/.test(normalized)) return 'USDE';
  if (/(^|[^A-Z0-9])DAI([^A-Z0-9]|$)/.test(normalized)) return 'DAI';
  // Morpho vault symbols can be wrapper-like (e.g. gtUSDCcore), so use substring fallback.
  if (normalized.includes('USDC')) return 'USDC';
  if (normalized.includes('USDT')) return 'USDT';
  if (normalized.includes('USDE')) return 'USDE';
  if (normalized.includes('DAI')) return 'DAI';
  return null;
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const cleaned = String(value).trim().replace(/,/g, '');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePercent(value) {
  const num = toNumber(value);
  if (num === null || num <= 0) return null;
  // Some APIs return APY as ratio (0.0453), some as percent (4.53).
  return num <= 1 ? num * 100 : num;
}

function venusChainName(chainId) {
  if (Number(chainId) === 56) return 'BSC';
  return null;
}

function pickFirstNumber(...values) {
  for (const value of values) {
    const num = toNumber(value);
    if (num !== null) return num;
  }
  return null;
}

function pickMaxNumber(...values) {
  const nums = values
    .map((value) => toNumber(value))
    .filter((value) => value !== null && value > 0 && value < 1000);
  if (nums.length === 0) return null;
  return Math.max(...nums);
}

function normalizeMorphoApy(rawValue) {
  const value = Number(rawValue);
  if (!Number.isFinite(value) || value <= 0) return null;

  // Morpho API may return decimal APY (0.04) while we store percentage (4.0).
  if (value <= 1) return value * 100;
  return value;
}

function normalizeMorphoChain(chain = {}) {
  const chainId = Number(chain?.id);
  if (chainId === 1) return 'Ethereum';
  if (chainId === 8453) return 'Base';

  const network = String(chain?.network || '').toLowerCase();
  if (network === 'mainnet' || network === 'ethereum') return 'Ethereum';
  if (network === 'base') return 'Base';

  return chain?.network || null;
}

function morphoUrlByChain(chainName = '') {
  const chain = String(chainName || '').toLowerCase();
  if (chain === 'ethereum') return 'https://app.morpho.org/?network=mainnet';
  if (chain === 'base') return 'https://app.morpho.org/?network=base';
  return 'https://app.morpho.org/';
}

async function fetchMorphoSupplementPools() {
  try {
    const res = await fetch(MORPHO_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YieldNewsHub/0.1',
      },
      body: JSON.stringify({
        query: MORPHO_VAULTS_QUERY,
        variables: { first: 500, chainIds: MORPHO_CHAIN_IDS },
      }),
    });

    if (!res.ok) {
      throw new Error(`morpho api request failed: ${res.status}`);
    }

    const json = await res.json();
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

        const chain = normalizeMorphoChain(vault?.chain);
        const apy = normalizeMorphoApy(vault?.avgNetApy);
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
          url: morphoUrlByChain(chain),
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn('[apy] morpho supplement failed', e?.message || e);
    return [];
  }
}

async function fetchVenusSupplementPools() {
  const output = [];

  for (const chainId of VENUS_CHAIN_IDS) {
    const chain = venusChainName(chainId);
    if (!chain) continue;

    try {
      const marketsUrl = new URL('/markets', VENUS_API_BASE_URL);
      marketsUrl.searchParams.set('chainId', String(chainId));
      marketsUrl.searchParams.set('limit', '500');

      const res = await fetch(marketsUrl.toString(), {
        headers: {
          'User-Agent': 'YieldNewsHub/0.1',
          'accept-version': 'stable',
        },
      });

      if (!res.ok) {
        throw new Error(`venus api request failed: ${res.status}`);
      }

      const json = await res.json();
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
          url: 'https://app.venus.io/core-pool?chainId=56',
        });
      }
    } catch (e) {
      console.warn(`[apy] venus supplement failed (chainId=${chainId})`, e?.message || e);
    }
  }

  return output;
}

function lendleApyFromReserve(reserve = {}) {
  const direct = normalizePercent(reserve?.supplyApy);
  if (direct !== null) return direct;

  const rateRay = toNumber(reserve?.liquidityRate);
  if (rateRay !== null && rateRay > 0) {
    // Aave-style ray annual rate: 1e27 = 100%.
    return rateRay / 1e25;
  }

  return null;
}

function lendleTvlFromReserve(reserve = {}) {
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

async function fetchLendleSupplementPools() {
  try {
    const res = await fetch(LENDLE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'YieldNewsHub/0.1',
      },
      body: JSON.stringify({
        query: LENDLE_RESERVES_QUERY,
        variables: { first: 300 },
      }),
    });

    if (!res.ok) {
      throw new Error(`lendle graphql request failed: ${res.status}`);
    }

    const json = await res.json();
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

        const apy = lendleApyFromReserve(reserve);
        const tvlUsd = lendleTvlFromReserve(reserve);
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
    console.warn('[apy] lendle supplement failed', e?.message || e);
    return [];
  }
}

function isStableOnlyPool(p) {
  const symbol = analyzeSymbol(p?.symbol || '');
  const project = String(p?.project || '').toLowerCase();
  const projectStableHint = shouldNormalizeWrappedStableSymbol(project)
    ? inferDirectStableToken(p?.symbol || '')
    : null;

  // Some lending vault symbols include strategy/provider words (e.g. "USDC Morpho Vault"),
  // so allow trusted single-sided stablecoin vaults even if symbol isn't pure token format.
  const allowNamedStableVault = isNamedStableVaultProject(project) && (
    p?.stablecoin === true
    && (symbol.directStableTokens.length >= 1 || Boolean(projectStableHint))
    && String(p?.exposure || '').toLowerCase() === 'single'
    && String(p?.ilRisk || '').toLowerCase() === 'no'
  );

  if (!symbol.tokens.length && !projectStableHint) return false;
  if (!symbol.pureDirectStable && !allowNamedStableVault) return false;
  if (symbol.hasVolatileToken) return false;

  // Additional check: reject pools with suspiciously high APY (>50% usually indicates non-stable or ponzi risk)
  if (typeof p.apy === 'number' && p.apy > 50) {
    // Only allow high APY if it's a well-known protocol AND has the stablecoin flag
    const isTrustedHighYield = ['pendle'].includes(project);
    if (!isTrustedHighYield || p?.stablecoin !== true) {
      return false;
    }
  }

  // Check pool name/symbol for suspicious indicators
  const symbolLower = String(p?.symbol || '').toLowerCase();
  const suspiciousPatterns = ['leverage', 'perp', 'long', 'short', 'option', 'futures'];
  if (suspiciousPatterns.some(pattern => symbolLower.includes(pattern))) {
    return false;
  }

  return true;
}

// CeFi links are handled separately (see src/cexLinks.js)

function riskNoteFromPool(p) {
  // Extremely naive; for MVP we just label by category.
  // Users should treat all DeFi as smart-contract risk.
  const project = p.project || '';
  const chain = p.chain || '';
  const base = `DeFi (smart-contract risk)`;
  return `${base}${project ? ` • ${project}` : ''}${chain ? ` • ${chain}` : ''}`;
}

// 权威 DeFi 项目白名单 - 仅保留经过审计、TVL 稳定的头部协议
const DEFILLAMA_PROJECT_ALLOWLIST = new Set([
  // Lending protocols
  'aave-v3',
  'compound-v3',
  'morpho',
  'spark',
  'euler-v2',
  'maple',
  'maple-finance',
  'moonwell',
  'fluid',
  'venus',
  'lendle',
  'pancakeswap-amm',
  // Additional protocols requested by product
  'avantis',
  'avantisfi',
  'goldfinch',
  'goldfinch-protocol',
  'autofinance',
  'autofarm',
  'wasabi',
  'wasabi-protocol',
  // DEX / Yield
  'curve-dex',
  'yearn-finance',
  'convex-finance',
  'pendle',
]);

// Some projects should only be shown on specific chains for clearer UX.
const PROJECT_CHAIN_ALLOWLIST = new Map([
  ['wasabi', new Set(['base'])],
  ['wasabi-protocol', new Set(['base'])],
]);

// 最低 APY 阈值 (3%)
const MIN_APY_THRESHOLD = 3;
const PROJECT_MIN_APY_THRESHOLD = new Map([
  // Mature lending vaults can still be attractive below 3%.
  ['morpho', 1.5],
  ['maple', 1.5],
  ['maple-finance', 1.5],
]);

function isAllowedProject(project = '', chain = '') {
  const p = String(project || '').toLowerCase();
  if (!p) return false;
  const normalizedChain = String(chain || '').toLowerCase();

  // Chain-scoped protocol policies requested by product.
  if (isLendleFamilyProject(p)) return normalizedChain === 'mantle';
  if (isPancakeFamilyProject(p)) return normalizedChain === 'bsc';
  if (isVenusFamilyProject(p)) return normalizedChain === 'bsc';

  if (!isMorphoFamilyProject(p) && !DEFILLAMA_PROJECT_ALLOWLIST.has(p)) return false;

  const chainAllowlist = PROJECT_CHAIN_ALLOWLIST.get(p);
  if (!chainAllowlist) return true;

  return chainAllowlist.has(normalizedChain);
}

function passesApyThreshold(pool = {}) {
  const project = String(pool?.project || '').toLowerCase();
  if (isMorphoFamilyProject(project)) {
    return typeof pool.apy === 'number' && pool.apy >= 1.5;
  }
  if (isVenusFamilyProject(project)) {
    return typeof pool.apy === 'number' && pool.apy >= 1.5;
  }
  if (isLendleFamilyProject(project)) {
    return typeof pool.apy === 'number' && pool.apy >= 2;
  }
  if (isPancakeFamilyProject(project)) {
    return typeof pool.apy === 'number' && pool.apy >= 2;
  }
  const minApy = PROJECT_MIN_APY_THRESHOLD.get(project) ?? MIN_APY_THRESHOLD;
  return typeof pool.apy === 'number' && pool.apy >= minApy;
}

function canonicalProjectFamily(project = '') {
  const p = String(project || '').toLowerCase();
  if (isMorphoFamilyProject(p)) return 'morpho';
  if (isVenusFamilyProject(p)) return 'venus';
  if (isLendleFamilyProject(p)) return 'lendle';
  if (isPancakeFamilyProject(p)) return 'pancakeswap';
  return p;
}

function selectDiverseTopPools(sortedPools = [], maxCount = 50) {
  const familyQuota = new Map([
    ['venus', 2],
    ['lendle', 2],
  ]);

  const selected = [];
  const selectedIds = new Set();

  for (const [family, quota] of familyQuota.entries()) {
    if (selected.length >= maxCount) break;

    let picked = 0;
    for (const pool of sortedPools) {
      if (picked >= quota || selected.length >= maxCount) break;
      const id = String(pool?.pool || '');
      if (!id || selectedIds.has(id)) continue;
      if (canonicalProjectFamily(pool?.project) !== family) continue;

      selected.push(pool);
      selectedIds.add(id);
      picked += 1;
    }
  }

  for (const pool of sortedPools) {
    if (selected.length >= maxCount) break;
    const id = String(pool?.pool || '');
    if (!id || selectedIds.has(id)) continue;
    selected.push(pool);
    selectedIds.add(id);
  }

  return selected;
}

export async function pollApyOnce() {
  const sources = await prisma.apySource.findMany({ where: { enabled: true } });
  const defillama = sources.find((s) => s.name === 'DeFiLlama');
  if (!defillama) {
    return {
      ok: false,
      reason: 'defillama source not enabled',
    };
  }

  try {
    const res = await fetch(defillama.url, { headers: { 'User-Agent': 'YieldNewsHub/0.1' } });
    const json = await res.json();
    const pools = Array.isArray(json?.data) ? json.data : [];
    const morphoSupplementPools = await fetchMorphoSupplementPools();
    const venusSupplementPools = await fetchVenusSupplementPools();
    const lendleSupplementPools = await fetchLendleSupplementPools();

    // If official pools are available, drop stale aggregator rows for same family.
    if (venusSupplementPools.length > 0) {
      await prisma.apyOpportunity.deleteMany({
        where: {
          provider: { startsWith: 'venus', mode: 'insensitive' },
          externalId: { not: { startsWith: 'venus:' } },
        },
      });
    }
    if (lendleSupplementPools.length > 0) {
      await prisma.apyOpportunity.deleteMany({
        where: {
          provider: { startsWith: 'lendle', mode: 'insensitive' },
          externalId: { not: { startsWith: 'lendle:' } },
        },
      });
    }

    const basePools = pools.filter((p) => {
      const project = String(p?.project || '').toLowerCase();
      if (venusSupplementPools.length > 0 && isVenusFamilyProject(project)) return false;
      if (lendleSupplementPools.length > 0 && isLendleFamilyProject(project)) return false;
      return true;
    });
    const candidatePools = [
      ...basePools,
      ...morphoSupplementPools,
      ...venusSupplementPools,
      ...lendleSupplementPools,
    ];

    // pick direct stablecoin pools only (USDC/USDT/USDE/DAI)
    // with: whitelisted project, TVL >= $1M, APY threshold (default 3%, some core lending lower)
    // sort by apy desc, keep more rows for frontend filtering and routing
    const ranked = candidatePools
      .filter((p) => isAllowedProject(p.project, p.chain))
      .filter((p) => isStableOnlyPool(p))
      .filter((p) => passesApyThreshold(p))
      .filter((p) => (p.tvlUsd ?? 0) >= 1_000_000)
      .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0));
    const filtered = selectDiverseTopPools(ranked, 50);

    for (const p of filtered) {
      const externalId = p.pool;
      const project = String(p?.project || '').toLowerCase();
      const rawSymbol = String(p?.symbol || '').trim();
      const rawSymbolAnalysis = analyzeSymbol(rawSymbol);
      const projectStableHint = shouldNormalizeWrappedStableSymbol(project)
        ? inferDirectStableToken(rawSymbol)
        : null;
      const normalizedSymbol = (
        shouldNormalizeWrappedStableSymbol(project)
        && projectStableHint
        && rawSymbolAnalysis.directStableTokens.length === 0
      )
        ? projectStableHint
        : (rawSymbol || 'UNKNOWN');
      const url = getBestDepositUrl({
        poolId: p.pool,
        project: p.project,
        chain: p.chain,
        symbol: normalizedSymbol,
        adapterUrl: p.url,
      });
      await prisma.apyOpportunity.upsert({
        where: { externalId },
        update: {
          provider: p.project || 'Unknown',
          chain: p.chain || null,
          symbol: normalizedSymbol,
          apy: p.apy,
          tvlUsd: p.tvlUsd ?? null,
          url,
          riskNote: riskNoteFromPool(p),
          source: 'defillama',
          updatedAt: new Date(),
        },
        create: {
          externalId,
          provider: p.project || 'Unknown',
          chain: p.chain || null,
          symbol: normalizedSymbol,
          apy: p.apy,
          tvlUsd: p.tvlUsd ?? null,
          url,
          riskNote: riskNoteFromPool(p),
          source: 'defillama',
          updatedAt: new Date(),
        },
      });
    }

    // Cleanup any previously inserted CeFi rows; CEX is links-only for now.
    await prisma.apyOpportunity.deleteMany({ where: { source: 'cefi' } });

    // Cleanup: keep only recent entries for defillama that were not updated for 2 days
    await prisma.apyOpportunity.deleteMany({
      where: {
        source: 'defillama',
        updatedAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
      },
    });

    return {
      ok: true,
      counts: {
        defillamaRaw: pools.length,
        morphoSupplement: morphoSupplementPools.length,
        venusSupplement: venusSupplementPools.length,
        lendleSupplement: lendleSupplementPools.length,
        candidate: candidatePools.length,
        ranked: ranked.length,
        final: filtered.length,
      },
    };
  } catch (e) {
    console.warn('[apy] poll failed', e?.message || e);
    return {
      ok: false,
      reason: e?.message || String(e),
    };
  }
}
