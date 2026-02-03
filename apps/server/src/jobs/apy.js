import fetch from 'node-fetch';
import { prisma } from '../db.js';
import { officialDepositUrl } from '../defiLinks.js';

// APY aggregation:
// - DeFi: DeFiLlama yields API (no key)
// - CeFi: links are served separately (no APY aggregation for now)
//
// DeFiLlama yields API:
// https://yields.llama.fi/pools

// 主流稳定币白名单
const STABLE_SYMBOLS = new Set([
  'USDC', 'USDT', 'DAI', 'USDE', 'USDS',
  'FRAX', 'TUSD', 'FDUSD', 'PYUSD', 'USD0', 'USDY',
  'LUSD', 'GUSD', 'BUSD', 'CUSD', 'SUSD', 'EUSD',
  'GHO', 'CRVUSD', 'MKUSD', 'DOLA',
]);

// 非稳定币关键词黑名单 - 用于过滤掉包含这些代币的池子
const NON_STABLE_KEYWORDS = new Set([
  'ETH', 'WETH', 'STETH', 'WSTETH', 'RETH', 'CBETH', 'FRXETH',
  'BTC', 'WBTC', 'TBTC', 'SBTC', 'RENBTC', 'HBTC',
  'CRV', 'CVX', 'AAVE', 'COMP', 'UNI', 'SUSHI', 'BAL',
  'LINK', 'MKR', 'SNX', 'YFI', 'LDO', 'RPL',
  'MATIC', 'ARB', 'OP', 'AVAX', 'FTM', 'SOL',
  'LP', 'SLP', 'BPT', // LP token markers
]);

function isStableSymbol(sym = '') {
  const s = String(sym).toUpperCase();
  return STABLE_SYMBOLS.has(s);
}

function isNonStableSymbol(sym = '') {
  const s = String(sym).toUpperCase();
  return NON_STABLE_KEYWORDS.has(s);
}

function parseSymbols(symbol = '') {
  // Normalize and extract token-like parts.
  // Examples:
  // - "USDC" => ["USDC"]
  // - "USDC-USDT" => ["USDC","USDT"]
  // - "crvUSD" => ["CRVUSD"]
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

  const parts = parseSymbols(p?.symbol || '');
  if (!parts.length) return false;

  // Reject if any non-stable token is found (ETH, BTC, etc.)
  for (const sym of parts) {
    if (isNonStableSymbol(sym)) return false;
  }

  // 严格要求：所有代币都必须是已知的稳定币
  // 这样可以过滤掉稳定币和其他币的LP，只保留纯稳定币资产
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

// 权威 DeFi 项目白名单 - 仅保留经过审计、TVL 稳定的头部协议
const DEFILLAMA_PROJECT_ALLOWLIST = new Set([
  // Lending protocols
  'aave-v3',
  'compound-v3',
  'morpho',
  'spark',
  'euler-v2',
  // DEX / Yield
  'curve-dex',
  'yearn-finance',
  'convex-finance',
  'pendle',
]);

// 最低 APY 阈值 (3%)
const MIN_APY_THRESHOLD = 3;

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

    // pick stable-only pools with: whitelisted project, TVL >= $1M, APY >= 3%
    // sort by apy desc, limit to top 20
    const filtered = pools
      .filter((p) => isAllowedProject(p.project))
      .filter((p) => isStableOnlyPool(p))
      .filter((p) => typeof p.apy === 'number' && p.apy >= MIN_APY_THRESHOLD)
      .filter((p) => (p.tvlUsd ?? 0) >= 1_000_000)
      .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0))
      .slice(0, 20);

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
