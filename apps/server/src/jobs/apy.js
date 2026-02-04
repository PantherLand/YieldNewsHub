import fetch from 'node-fetch';
import { prisma } from '../db.js';
import { officialDepositUrl } from '../defiLinks.js';

// APY aggregation:
// - DeFi: DeFiLlama yields API (no key)
// - CeFi: links are served separately (no APY aggregation for now)
//
// DeFiLlama yields API:
// https://yields.llama.fi/pools

// 主流稳定币白名单 - USD 挂钩稳定币
const STABLE_SYMBOLS = new Set([
  // 主流稳定币
  'USDC', 'USDT', 'DAI', 'USDE', 'USDS',
  'FRAX', 'TUSD', 'FDUSD', 'PYUSD', 'USD0', 'USDY',
  'LUSD', 'GUSD', 'BUSD', 'CUSD', 'SUSD', 'EUSD',
  // DeFi 原生稳定币
  'GHO', 'CRVUSD', 'MKUSD', 'DOLA', 'FRAXBP',
  // 收益稳定币变体 (underlying is stablecoin)
  'SUSDE', 'SDAI', 'SUSDS',
  // Aave/Compound 代币化稳定币 (underlying is stablecoin)
  'AUSDC', 'AUSDT', 'ADAI', 'CUSDC', 'CDAI',
  // 其他审计过的稳定币
  'USDP', 'USDD', 'USDA', 'USDB', 'USDM',
  'ALUSD', 'MUSD', 'AGEUR', 'EURT',
]);

// 非稳定币关键词黑名单 - 用于过滤掉包含这些代币的池子
const NON_STABLE_KEYWORDS = new Set([
  // ETH 及其衍生品
  'ETH', 'WETH', 'STETH', 'WSTETH', 'RETH', 'CBETH', 'FRXETH', 'METH', 'EETH', 'WEETH', 'RSETH', 'EZETH',
  // BTC 及其衍生品
  'BTC', 'WBTC', 'TBTC', 'SBTC', 'RENBTC', 'HBTC', 'BTCB', 'CBBTC', 'LBTC',
  // 治理/协议代币
  'CRV', 'CVX', 'AAVE', 'COMP', 'UNI', 'SUSHI', 'BAL', 'CAKE', 'JOE',
  'LINK', 'MKR', 'SNX', 'YFI', 'LDO', 'RPL', 'PENDLE', 'ENA',
  // L1/L2 原生代币
  'MATIC', 'POL', 'ARB', 'OP', 'AVAX', 'FTM', 'SOL', 'BNB', 'ATOM', 'DOT',
  // LP 代币标记
  'LP', 'SLP', 'BPT', 'UNI-V2', 'UNI-V3',
  // 其他波动性资产
  'PEPE', 'SHIB', 'DOGE', 'WLD', 'APT', 'SUI',
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

  // Additional check: reject pools with suspiciously high APY (>50% usually indicates non-stable or ponzi risk)
  if (typeof p.apy === 'number' && p.apy > 50) {
    // Only allow high APY if it's a well-known protocol AND has the stablecoin flag
    const project = String(p.project || '').toLowerCase();
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

  // For pools with DeFiLlama's stablecoin flag
  if (p?.stablecoin === true) {
    // Additional check: ensure no unknown tokens mixed in
    // Allow if at least one recognized stablecoin is present
    const hasStable = parts.some((sym) => isStableSymbol(sym));
    return hasStable;
  }

  // For pools without the stablecoin flag, require ALL tokens to be stablecoins
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
