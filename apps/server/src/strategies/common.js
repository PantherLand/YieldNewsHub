import fetch from 'node-fetch';
import { analyzeSymbol } from '../apy-intelligence.js';
import { prisma } from '../db.js';
import { cache, TTL, CacheKey } from '../cache.js';

const LLAMA_POOLS_API = 'https://yields.llama.fi/pools';

const TRUSTED_PROTOCOLS = new Set([
  'aave-v3',
  'compound-v3',
  'morpho',
  'spark',
  'euler-v2',
  'maple',
  'maple-finance',
  'moonwell',
  'fluid',
  'curve-dex',
  'yearn-finance',
  'convex-finance',
  'pendle',
  'avantis',
  'avantisfi',
  'goldfinch',
  'goldfinch-protocol',
]);

const LOW_RISK_CHAINS = new Set(['ethereum', 'arbitrum', 'base', 'optimism']);
const MEDIUM_RISK_CHAINS = new Set(['polygon', 'avalanche', 'bsc']);

function toNumber(value, fallback = null) {
  const v = Number(value);
  if (Number.isNaN(v)) return fallback;
  return v;
}

function safeLog10(v) {
  return Math.log10(Math.max(1, Number(v) || 1));
}

function normalizeChainRisk(chain = '') {
  const c = String(chain || '').toLowerCase();
  if (LOW_RISK_CHAINS.has(c)) return 0;
  if (MEDIUM_RISK_CHAINS.has(c)) return 1;
  return 2;
}

function normalizePool(raw = {}) {
  const symbolInfo = analyzeSymbol(raw.symbol || '');
  const provider = String(raw.project || '').toLowerCase();
  const apy = toNumber(raw.apy, 0);
  const apyBaseInput = toNumber(raw.apyBase, null);
  const apyRewardInput = toNumber(raw.apyReward, null);
  const apyBase = apyBaseInput == null
    ? apy
    : apyBaseInput;
  const apyReward = apyRewardInput == null
    ? Math.max(0, apy - apyBase)
    : apyRewardInput;

  return {
    ...raw,
    project: raw.project || null,
    chain: raw.chain || null,
    symbol: raw.symbol || null,
    pool: raw.pool || null,
    apy,
    apyBase: Math.max(0, apyBase),
    apyReward: Math.max(0, apyReward),
    tvlUsd: toNumber(raw.tvlUsd, 0),
    outlier: raw.outlier === true,
    stablecoin: raw.stablecoin === true,
    exposure: raw.exposure || null,
    ilRisk: raw.ilRisk || null,
    trustedProtocol: TRUSTED_PROTOCOLS.has(provider),
    chainRisk: normalizeChainRisk(raw.chain),
    symbolInfo,
  };
}

function toResult(pool, score, scoreRaw = score) {
  const poolId = pool.pool ? String(pool.pool) : null;
  return {
    symbol: pool.symbol,
    chain: pool.chain,
    project: pool.project,
    apy: Number((pool.apy || 0).toFixed(2)),
    apyBase: Number((pool.apyBase || 0).toFixed(2)),
    apyReward: Number((pool.apyReward || 0).toFixed(2)),
    tvlUsd: Math.round(pool.tvlUsd || 0),
    pool: poolId,
    url: poolId ? `https://defillama.com/yields/pool/${poolId}` : null,
    stablecoin: pool.stablecoin,
    exposure: pool.exposure,
    ilRisk: pool.ilRisk,
    trustedProtocol: pool.trustedProtocol,
    pureDirectStable: pool.symbolInfo.pureDirectStable,
    score: Number(score.toFixed(2)),
    scoreRaw: Number(scoreRaw.toFixed(4)),
  };
}

export function filterDirectStablePools(
  pools,
  {
    minTvlUsd = 5_000_000,
    requireSingleExposure = true,
    requireNoIl = true,
    allowOutlier = false,
    minApy = 0,
    maxApy = Infinity,
  } = {}
) {
  return pools.filter((p) => {
    if (p.stablecoin !== true) return false;
    if (!p.symbolInfo.pureDirectStable) return false;
    if ((p.tvlUsd || 0) < minTvlUsd) return false;
    if (requireSingleExposure && p.exposure !== 'single') return false;
    if (requireNoIl && p.ilRisk !== 'no') return false;
    if (!allowOutlier && p.outlier === true) return false;
    if ((p.apy || 0) < minApy) return false;
    if ((p.apy || 0) > maxApy) return false;
    return true;
  });
}

export function rankPools(pools, scoreFn, top) {
  const scored = pools
    .map((pool) => ({ pool, score: Number(scoreFn(pool) || 0) }))
    .filter((x) => Number.isFinite(x.score))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if ((b.pool.tvlUsd || 0) !== (a.pool.tvlUsd || 0)) return (b.pool.tvlUsd || 0) - (a.pool.tvlUsd || 0);
      return (b.pool.apy || 0) - (a.pool.apy || 0);
    });

  if (!scored.length) return [];

  const maxScore = scored[0].score;
  const minScore = scored[scored.length - 1].score;
  const spread = maxScore - minScore;
  const toNormalizedScore = (rawScore) => {
    if (!Number.isFinite(rawScore)) return 0;
    if (spread <= 0) return 80;
    return Math.max(0, Math.min(100, ((rawScore - minScore) / spread) * 100));
  };

  return scored
    .slice(0, top)
    .map((x) => toResult(x.pool, toNormalizedScore(x.score), x.score));
}

export function logTvl(p) {
  return safeLog10(p.tvlUsd);
}

export function chainPenalty(p) {
  return p.chainRisk;
}

/**
 * Get pools from database (cached for 1 hour)
 * Falls back to external API if database is empty
 */
export async function getLlamaPools() {
  const cacheKey = CacheKey.LLAMA_POOLS();

  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const dbPools = await prisma.apyOpportunity.findMany({
    where: { source: 'defillama' },
    orderBy: { updatedAt: 'desc' },
  });

  // If database has data, use it
  if (dbPools.length > 0) {
    const pools = dbPools.map((p) => normalizePool({
      pool: p.externalId,
      project: p.provider,
      chain: p.chain,
      symbol: p.symbol,
      apy: p.apy,
      tvlUsd: p.tvlUsd,
      stablecoin: true, // Our database only stores stablecoin pools
      exposure: 'single',
      ilRisk: 'no',
    }));

    cache.set(cacheKey, pools, TTL.ONE_HOUR);
    return pools;
  }

  // Fallback: fetch from external API if database is empty
  console.warn('[strategy] Database empty, falling back to external API');
  const res = await fetch(LLAMA_POOLS_API, {
    headers: { 'User-Agent': 'YieldNewsHub/0.1 strategy' },
  });
  if (!res.ok) {
    throw new Error(`failed to fetch pools: ${res.status}`);
  }

  const json = await res.json();
  const rawPools = Array.isArray(json?.data) ? json.data : [];
  const pools = rawPools.map((p) => normalizePool(p));

  cache.set(cacheKey, pools, TTL.ONE_HOUR);
  return pools;
}
