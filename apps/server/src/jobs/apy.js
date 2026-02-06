import fetch from 'node-fetch';
import { prisma } from '../db.js';
import { getBestDepositUrl } from '../constants/index.js';
import { analyzeSymbol } from '../apy-intelligence.js';
import { fetchAllPools, morpho, venus, lendle, inferDirectStableToken } from '../sources/index.js';

// APY aggregation:
// - DeFi: DeFiLlama yields API (no key) + official protocol APIs (sources/)
// - CeFi: links are served separately (no APY aggregation for now)
//
// DeFiLlama yields API:
// https://yields.llama.fi/pools

function isMorphoFamilyProject(project = '') {
  return morpho.isFamily(project);
}

function isVenusFamilyProject(project = '') {
  return venus.isFamily(project);
}

function isLendleFamilyProject(project = '') {
  return lendle.isFamily(project);
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
    // Fetch data from all sources in parallel
    const [defillamaRes, officialPools] = await Promise.all([
      fetch(defillama.url, { headers: { 'User-Agent': 'YieldNewsHub/0.1' } }).then(r => r.json()),
      fetchAllPools(),
    ]);

    const pools = Array.isArray(defillamaRes?.data) ? defillamaRes.data : [];
    const morphoSupplementPools = officialPools.morpho || [];
    const venusSupplementPools = officialPools.venus || [];
    const lendleSupplementPools = officialPools.lendle || [];

    // If official pools are available, drop stale aggregator rows for same family.
    if (morphoSupplementPools.length > 0) {
      await prisma.apyOpportunity.deleteMany({
        where: {
          provider: { startsWith: 'morpho', mode: 'insensitive' },
          externalId: { not: { startsWith: morpho.poolIdPrefix } },
        },
      });
    }
    if (venusSupplementPools.length > 0) {
      await prisma.apyOpportunity.deleteMany({
        where: {
          provider: { startsWith: 'venus', mode: 'insensitive' },
          externalId: { not: { startsWith: venus.poolIdPrefix } },
        },
      });
    }
    if (lendleSupplementPools.length > 0) {
      await prisma.apyOpportunity.deleteMany({
        where: {
          provider: { startsWith: 'lendle', mode: 'insensitive' },
          externalId: { not: { startsWith: lendle.poolIdPrefix } },
        },
      });
    }

    const basePools = pools.filter((p) => {
      const project = String(p?.project || '').toLowerCase();
      // When we have official API data, skip DeFiLlama data for that protocol
      if (morphoSupplementPools.length > 0 && isMorphoFamilyProject(project)) return false;
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
