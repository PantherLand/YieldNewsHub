import fetch from 'node-fetch';
import { prisma } from '../db.js';

// APY aggregation:
// - DeFi: DeFiLlama yields API (no key)
// - CeFi: (MVP) curated opportunities with click-through links; APY may be null until integrated.
//
// DeFiLlama yields API:
// https://yields.llama.fi/pools

const STABLE_SYMBOLS = new Set(['USDC', 'USDT', 'DAI', 'USDE', 'USDS', 'FRAX', 'TUSD', 'FDUSD', 'PYUSD', 'USD0', 'USDY']);

function isStableSymbol(sym = '') {
  return STABLE_SYMBOLS.has(String(sym).toUpperCase());
}

function parseSymbols(symbol = '') {
  // Accept formats like: "USDC", "USDC-USDT", "USDC/USDT", "USDC+USDT", "USDC, USDT"
  const s = String(symbol || '').toUpperCase();
  return s
    .replace(/\s+/g, '')
    .split(/[-/+,:]/g)
    .filter(Boolean);
}

function isStableOnlyPool(p) {
  // Prefer DeFiLlama's stablecoin flag if present
  if (p?.stablecoin === true) return true;

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

const CEFI_OPPORTUNITIES = [
  {
    externalId: 'binance:earn:stable',
    provider: 'Binance Earn',
    chain: 'CeFi',
    symbol: 'USDT/USDC',
    apy: null,
    tvlUsd: null,
    url: 'https://www.binance.com/en/earn',
    riskNote: 'CeFi (custody risk). APY integration pending; click through to view current rates.',
    source: 'cefi',
  },
  {
    externalId: 'okx:earn:stable',
    provider: 'OKX Earn',
    chain: 'CeFi',
    symbol: 'USDT/USDC',
    apy: null,
    tvlUsd: null,
    url: 'https://www.okx.com/earn',
    riskNote: 'CeFi (custody risk). APY integration pending; click through to view current rates.',
    source: 'cefi',
  },
  {
    externalId: 'bybit:earn:stable',
    provider: 'Bybit Earn',
    chain: 'CeFi',
    symbol: 'USDT/USDC',
    apy: null,
    tvlUsd: null,
    url: 'https://www.bybit.com/en/earn/',
    riskNote: 'CeFi (custody risk). APY integration pending; click through to view current rates.',
    source: 'cefi',
  },
];

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

    // pick stable-only pools, sort by apy, require tvl threshold
    const filtered = pools
      .filter((p) => isStableOnlyPool(p))
      .filter((p) => typeof p.apy === 'number' && p.apy >= 0)
      .filter((p) => (p.tvlUsd ?? 0) >= 1_000_000)
      .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0))
      .slice(0, 80);

    for (const p of filtered) {
      const externalId = p.pool;
      const url = llamaPoolUrl(p.pool);
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

    // Seed/refresh CeFi click-through opportunities (APY may be null)
    for (const c of CEFI_OPPORTUNITIES) {
      await prisma.apyOpportunity.upsert({
        where: { externalId: c.externalId },
        update: {
          provider: c.provider,
          chain: c.chain,
          symbol: c.symbol,
          apy: c.apy,
          tvlUsd: c.tvlUsd,
          url: c.url,
          riskNote: c.riskNote,
          source: c.source,
          updatedAt: new Date(),
        },
        create: {
          externalId: c.externalId,
          provider: c.provider,
          chain: c.chain,
          symbol: c.symbol,
          apy: c.apy,
          tvlUsd: c.tvlUsd,
          url: c.url,
          riskNote: c.riskNote,
          source: c.source,
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
