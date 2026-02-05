import fetch from 'node-fetch';
import { prisma } from '../db.js';
import { getBestDepositUrl } from '../defiLinks.js';
import { analyzeSymbol } from '../apy-intelligence.js';

// APY aggregation:
// - DeFi: DeFiLlama yields API (no key)
// - CeFi: links are served separately (no APY aggregation for now)
//
// DeFiLlama yields API:
// https://yields.llama.fi/pools

function isStableOnlyPool(p) {
  const symbol = analyzeSymbol(p?.symbol || '');
  const project = String(p?.project || '').toLowerCase();

  // Some lending vault symbols include strategy/provider words (e.g. "USDC Morpho Vault"),
  // so allow trusted single-sided stablecoin vaults even if symbol isn't pure token format.
  const allowNamedStableVault = (
    [
      'aave-v3',
      'compound-v3',
      'morpho',
      'spark',
      'euler-v2',
      'maple',
      'maple-finance',
      'moonwell',
      'fluid',
    ].includes(project)
    && p?.stablecoin === true
    && symbol.directStableTokens.length >= 1
    && String(p?.exposure || '').toLowerCase() === 'single'
    && String(p?.ilRisk || '').toLowerCase() === 'no'
  );

  if (!symbol.tokens.length) return false;
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
  if (!DEFILLAMA_PROJECT_ALLOWLIST.has(p)) return false;

  const chainAllowlist = PROJECT_CHAIN_ALLOWLIST.get(p);
  if (!chainAllowlist) return true;

  const normalizedChain = String(chain || '').toLowerCase();
  return chainAllowlist.has(normalizedChain);
}

function passesApyThreshold(pool = {}) {
  const project = String(pool?.project || '').toLowerCase();
  const minApy = PROJECT_MIN_APY_THRESHOLD.get(project) ?? MIN_APY_THRESHOLD;
  return typeof pool.apy === 'number' && pool.apy >= minApy;
}

export async function pollApyOnce() {
  const sources = await prisma.apySource.findMany({ where: { enabled: true } });
  const defillama = sources.find((s) => s.name === 'DeFiLlama');
  if (!defillama) return;

  try {
    const res = await fetch(defillama.url, { headers: { 'User-Agent': 'YieldNewsHub/0.1' } });
    const json = await res.json();
    const pools = json?.data || [];

    // pick direct stablecoin pools only (USDC/USDT/USDE/DAI)
    // with: whitelisted project, TVL >= $1M, APY threshold (default 3%, some core lending lower)
    // sort by apy desc, keep more rows for frontend filtering and routing
    const filtered = pools
      .filter((p) => isAllowedProject(p.project, p.chain))
      .filter((p) => isStableOnlyPool(p))
      .filter((p) => passesApyThreshold(p))
      .filter((p) => (p.tvlUsd ?? 0) >= 1_000_000)
      .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0))
      .slice(0, 50);

    for (const p of filtered) {
      const externalId = p.pool;
      const url = getBestDepositUrl({
        poolId: p.pool,
        project: p.project,
        chain: p.chain,
        symbol: p.symbol,
        adapterUrl: p.url,
      });
      await prisma.apyOpportunity.upsert({
        where: { externalId },
        update: {
          provider: p.project || 'Unknown',
          chain: p.chain || null,
          symbol: p.symbol || 'UNKNOWN',
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
          symbol: p.symbol || 'UNKNOWN',
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
  } catch (e) {
    console.warn('[apy] poll failed', e?.message || e);
  }
}
