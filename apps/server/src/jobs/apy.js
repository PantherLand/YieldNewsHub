import fetch from 'node-fetch';
import { prisma } from '../db.js';
import { officialDepositUrl } from '../defiLinks.js';

// APY aggregation:
// - DeFi: DeFiLlama yields API (no key)
// - CeFi: links are served separately (no APY aggregation for now)
//
// DeFiLlama yields API:
// https://yields.llama.fi/pools

const STABLE_SYMBOLS = new Set(['USDC', 'USDT', 'DAI', 'USDE', 'USDS', 'FRAX', 'TUSD', 'FDUSD', 'PYUSD', 'USD0', 'USDY']);

function isStableSymbol(sym = '') {
  return STABLE_SYMBOLS.has(String(sym).toUpperCase());
}

function parseSymbols(symbol = '') {
  // Normalize and extract token-like parts.
  // Examples:
  // - "USDC" => ["USDC"]
  // - "USDC-USDT" => ["USDC","USDT"]
  // - "USDC/USDT" => ["USDC","USDT"]
  // - "USDC+USDT" => ["USDC","USDT"]
  // - "USDC-USDT (LP)" => ["USDC","USDT","LP"] (LP will later fail stable check)
  const s = String(symbol || '').toUpperCase();
  // Replace non-alphanumerics with a delimiter, then split.
  return s
    .replace(/[^A-Z0-9]+/g, '-')
    .split('-')
    .filter(Boolean);
}

const DENY_CHAINS = new Set(['solana', 'sui', 'aptos']);

function isAllowedChain(chain = '') {
  const c = String(chain || '').toLowerCase();
  if (!c) return true;
  return !DENY_CHAINS.has(c);
}

function isStableOnlyPool(p) {
  // Drop chains we don't want in MVP (e.g. Solana)
  if (!isAllowedChain(p?.chain)) return false;

  // Prefer DeFiLlama's stablecoin flag if present
  if (p?.stablecoin === true) {
    // Still reject if symbol clearly includes a non-stable (defensive)
    const parts = parseSymbols(p?.symbol || '');
    if (parts.some((sym) => sym && !isStableSymbol(sym))) return false;
    return true;
  }

  const parts = parseSymbols(p?.symbol || '');
  if (!parts.length) return false;

  // If any non-stable symbol shows up, reject.
  for (const sym of parts) {
    if (!isStableSymbol(sym)) return false;
  }
  return true;
}

function llamaPoolUrl(poolId) {
  // DeFiLlama yields pool page
  return poolId ? `https://defillama.com/yields/pool/${poolId}` : null;
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

const DEFILLAMA_PROJECT_ALLOWLIST = new Set([
  'aave-v3',
  'aave-v2',
  'morpho-v1',
  'morpho',
  'compound-v3',
  'compound-v2',
  'euler-v2',
  'spark',
  'curve-dex',
  'yearn-finance',
]);

function isAllowedProject(project = '') {
  const p = String(project || '').toLowerCase();
  if (!p) return false;
  return DEFILLAMA_PROJECT_ALLOWLIST.has(p);
}

export async function pollApyOnce() {
  const sources = await prisma.apySource.findMany({ where: { enabled: true } });
  const defillama = sources.find((s) => s.name === 'DeFiLlama');
  if (!defillama) return;

  try {
    const res = await fetch(defillama.url, { headers: { 'User-Agent': 'YieldNewsHub/0.1' } });
    const json = await res.json();
    const pools = json?.data || [];

    // pick stable-only pools, sort by apy, require tvl threshold
    const filtered = pools
      .filter((p) => isAllowedProject(p.project))
      .filter((p) => isStableOnlyPool(p))
      .filter((p) => typeof p.apy === 'number' && p.apy >= 0)
      .filter((p) => (p.tvlUsd ?? 0) >= 1_000_000)
      .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0))
      .slice(0, 80);

    for (const p of filtered) {
      const externalId = p.pool;
      const url = officialDepositUrl(p.project, { chain: p.chain, symbol: p.symbol }) || llamaPoolUrl(p.pool);
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
