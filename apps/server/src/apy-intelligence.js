const STABLE_TOKEN_ALIASES = new Map([
  ['USDCE', 'USDC'],
  ['USDC0', 'USDC'],
  ['USDT0', 'USDT'],
  ['USDTE', 'USDT'],
  ['DAIE', 'DAI'],
  ['AUSDCN', 'AUSDC'],
  ['AUSDTN', 'AUSDT'],
  ['ADAIN', 'ADAI'],
]);

const STABLE_TOKENS = new Set([
  'USDC', 'USDT', 'DAI', 'USDE', 'USDS',
  'FRAX', 'TUSD', 'FDUSD', 'PYUSD', 'LUSD',
  'GUSD', 'BUSD', 'CUSD', 'SUSD', 'EUSD',
  'GHO', 'CRVUSD', 'DOLA', 'USDP',
  'SUSDE', 'SDAI', 'SUSDS',
  'AUSDC', 'AUSDT', 'ADAI', 'CUSDC', 'CDAI',
]);

const DIRECT_STABLE_TOKENS = new Set(['USDC', 'USDT', 'USDE', 'DAI']);

const VOLATILE_TOKENS = new Set([
  'ETH', 'WETH', 'STETH', 'WSTETH', 'RETH', 'CBETH', 'FRXETH', 'METH', 'EETH', 'WEETH',
  'BTC', 'WBTC', 'TBTC', 'SBTC', 'RENBTC', 'HBTC', 'BTCB', 'CBBTC',
  'CRV', 'CVX', 'AAVE', 'COMP', 'UNI', 'SUSHI', 'BAL', 'CAKE', 'JOE',
  'LINK', 'MKR', 'SNX', 'YFI', 'LDO', 'RPL', 'PENDLE', 'ENA',
  'MATIC', 'POL', 'ARB', 'OP', 'AVAX', 'FTM', 'SOL', 'BNB', 'ATOM', 'DOT',
  'PEPE', 'SHIB', 'DOGE', 'WLD', 'APT', 'SUI',
]);

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

export function parseSymbols(symbol = '') {
  return String(symbol || '')
    .toUpperCase()
    .split(/[-/+:,\s_]+/g)
    .map((token) => token.replace(/[^A-Z0-9]/g, ''))
    .filter(Boolean);
}

function normalizeToken(token = '') {
  let t = String(token || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!t) return '';

  if (STABLE_TOKEN_ALIASES.has(t)) {
    return STABLE_TOKEN_ALIASES.get(t);
  }

  if (t.endsWith('E') && STABLE_TOKENS.has(t.slice(0, -1))) {
    return t.slice(0, -1);
  }

  if (/^USDC\d+$/.test(t)) return 'USDC';
  if (/^USDT\d+$/.test(t)) return 'USDT';

  return t;
}

export function analyzeSymbol(symbol = '') {
  const tokens = parseSymbols(symbol).map(normalizeToken).filter(Boolean);
  if (!tokens.length) {
    return {
      tokens: [],
      stableTokens: [],
      directStableTokens: [],
      volatileTokens: [],
      stableRatio: 0,
      directStableRatio: 0,
      pureStable: false,
      pureDirectStable: false,
      hasVolatileToken: false,
    };
  }

  const stableTokens = tokens.filter((token) => STABLE_TOKENS.has(token));
  const directStableTokens = tokens.filter((token) => DIRECT_STABLE_TOKENS.has(token));
  const volatileTokens = tokens.filter((token) => VOLATILE_TOKENS.has(token));
  const stableRatio = stableTokens.length / tokens.length;
  const directStableRatio = directStableTokens.length / tokens.length;
  const pureStable = stableTokens.length === tokens.length;
  const pureDirectStable = directStableTokens.length === tokens.length;

  return {
    tokens,
    stableTokens,
    directStableTokens,
    volatileTokens,
    stableRatio,
    directStableRatio,
    pureStable,
    pureDirectStable,
    hasVolatileToken: volatileTokens.length > 0,
  };
}

function apySuitability(apy) {
  if (apy == null || Number.isNaN(Number(apy))) return 0;
  const v = Number(apy);
  if (v <= 0) return 0;
  if (v < 2) return v * 5;
  if (v <= 8) return 10 + (v - 2) * 3;
  if (v <= 15) return 28 - (v - 8) * 1.5;
  if (v <= 30) return 17.5 - (v - 15);
  return 0;
}

function tvlScore(tvlUsd) {
  if (tvlUsd == null || Number.isNaN(Number(tvlUsd)) || Number(tvlUsd) <= 0) return 0;
  return Math.min(30, Math.log10(Number(tvlUsd) + 1) * 6);
}

export function analyzeApyOpportunity(row) {
  const symbolAnalysis = analyzeSymbol(row?.symbol || '');
  const apy = row?.apy == null ? null : Number(row.apy);
  const tvlUsd = row?.tvlUsd == null ? 0 : Number(row.tvlUsd);
  const provider = String(row?.provider || '').toLowerCase();
  const chain = String(row?.chain || '').toLowerCase();
  const trustedProtocol = TRUSTED_PROTOCOLS.has(provider);
  const chainRiskClass = LOW_RISK_CHAINS.has(chain)
    ? 'low'
    : MEDIUM_RISK_CHAINS.has(chain)
      ? 'medium'
      : 'unknown';

  let riskScore = 35;
  if (symbolAnalysis.pureDirectStable) riskScore -= 15;
  else if (symbolAnalysis.pureStable) riskScore -= 6;
  else riskScore += 25;
  if (!symbolAnalysis.pureDirectStable) riskScore += 10;
  if (symbolAnalysis.hasVolatileToken) riskScore += 25;

  if (tvlUsd >= 50_000_000) riskScore -= 15;
  else if (tvlUsd >= 10_000_000) riskScore -= 10;
  else if (tvlUsd >= 5_000_000) riskScore -= 5;
  else if (tvlUsd < 1_000_000) riskScore += 20;
  else riskScore += 8;

  if (apy != null) {
    if (apy > 25) riskScore += 30;
    else if (apy > 15) riskScore += 20;
    else if (apy > 10) riskScore += 12;
    else if (apy >= 2 && apy <= 10) riskScore -= 5;
    else if (apy < 1) riskScore += 8;
  }

  if (trustedProtocol) riskScore -= 10;
  else riskScore += 8;

  if (chainRiskClass === 'low') riskScore -= 8;
  else if (chainRiskClass === 'unknown') riskScore += 8;

  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));
  const riskLevel = riskScore <= 30 ? 'low' : riskScore <= 60 ? 'medium' : 'high';

  let qualityScore = 0;
  if (symbolAnalysis.pureDirectStable) qualityScore += 35;
  else if (symbolAnalysis.pureStable) qualityScore += 20;
  else qualityScore += Math.round(symbolAnalysis.stableRatio * 10);
  qualityScore += Math.round(symbolAnalysis.directStableRatio * 10);
  qualityScore += tvlScore(tvlUsd);
  qualityScore += apySuitability(apy);
  if (trustedProtocol) qualityScore += 8;
  if (chainRiskClass === 'low') qualityScore += 6;
  else if (chainRiskClass === 'medium') qualityScore += 3;
  if (symbolAnalysis.hasVolatileToken) qualityScore -= 25;
  if (!symbolAnalysis.pureStable) qualityScore -= 20;
  if (!symbolAnalysis.pureDirectStable) qualityScore -= 12;
  qualityScore = Math.max(0, Math.min(100, Math.round(qualityScore)));

  const recommended = Boolean(
    symbolAnalysis.pureDirectStable &&
    riskLevel !== 'high' &&
    qualityScore >= 60 &&
    tvlUsd >= 5_000_000 &&
    apy != null &&
    apy >= 2 &&
    apy <= 20
  );

  return {
    tokens: symbolAnalysis.tokens,
    pureStable: symbolAnalysis.pureStable,
    pureDirectStable: symbolAnalysis.pureDirectStable,
    stableRatio: Number(symbolAnalysis.stableRatio.toFixed(2)),
    directStableRatio: Number(symbolAnalysis.directStableRatio.toFixed(2)),
    riskScore,
    riskLevel,
    qualityScore,
    recommended,
  };
}
