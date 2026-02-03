import fetch from 'node-fetch';
import { prisma } from '../db.js';

// DeFiLlama yields API (no key)
// https://yields.llama.fi/pools
// We'll filter for stablecoin-like pools (USDC/USDT/DAI etc.) and keep a curated top set.

const STABLE_SYMBOLS = new Set(['USDC', 'USDT', 'DAI', 'USDE', 'USDS', 'FRAX', 'TUSD', 'FDUSD', 'PYUSD']);

function isStableSymbol(sym = '') {
  return STABLE_SYMBOLS.has(String(sym).toUpperCase());
}

function riskNoteFromPool(p) {
  // Extremely naive; for MVP we just label by category.
  // Users should treat all DeFi as smart-contract risk.
  const project = p.project || '';
  const chain = p.chain || '';
  const base = `DeFi (smart-contract risk)`;
  return `${base}${project ? ` • ${project}` : ''}${chain ? ` • ${chain}` : ''}`;
}

export async function pollApyOnce() {
  const sources = await prisma.apySource.findMany({ where: { enabled: true } });
  const defillama = sources.find((s) => s.name === 'DeFiLlama');
  if (!defillama) return;

  try {
    const res = await fetch(defillama.url, { headers: { 'User-Agent': 'YieldNewsHub/0.1' } });
    const json = await res.json();
    const pools = json?.data || [];

    // pick stables, sort by apy, require tvl threshold
    const filtered = pools
      .filter((p) => isStableSymbol(p.symbol) || /USDC|USDT|DAI/.test(String(p.symbol || '').toUpperCase()))
      .filter((p) => typeof p.apy === 'number' && p.apy >= 0)
      .filter((p) => (p.tvlUsd ?? 0) >= 1_000_000)
      .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0))
      .slice(0, 50);

    for (const p of filtered) {
      const externalId = p.pool;
      await prisma.apyOpportunity.upsert({
        where: { externalId },
        update: {
          provider: p.project || 'Unknown',
          chain: p.chain || null,
          symbol: p.symbol || 'UNKNOWN',
          apy: p.apy,
          tvlUsd: p.tvlUsd ?? null,
          url: p.url || null,
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
          url: p.url || null,
          riskNote: riskNoteFromPool(p),
          source: 'defillama',
          updatedAt: new Date(),
        },
      });
    }

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
