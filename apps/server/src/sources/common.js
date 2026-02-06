// Shared utilities for third-party API sources

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const cleaned = String(value).trim().replace(/,/g, '');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizePercent(value) {
  const num = toNumber(value);
  if (num === null || num <= 0) return null;
  // Some APIs return APY as ratio (0.0453), some as percent (4.53).
  return num <= 1 ? num * 100 : num;
}

export function pickFirstNumber(...values) {
  for (const value of values) {
    const num = toNumber(value);
    if (num !== null) return num;
  }
  return null;
}

export function pickMaxNumber(...values) {
  const nums = values
    .map((value) => toNumber(value))
    .filter((value) => value !== null && value > 0 && value < 1000);
  if (nums.length === 0) return null;
  return Math.max(...nums);
}

export function inferDirectStableToken(text = '') {
  const normalized = String(text || '').toUpperCase();
  if (/(^|[^A-Z0-9])USDC([^A-Z0-9]|$)/.test(normalized)) return 'USDC';
  if (/(^|[^A-Z0-9])USDT([^A-Z0-9]|$)/.test(normalized)) return 'USDT';
  if (/(^|[^A-Z0-9])USDE([^A-Z0-9]|$)/.test(normalized)) return 'USDE';
  if (/(^|[^A-Z0-9])DAI([^A-Z0-9]|$)/.test(normalized)) return 'DAI';
  // Vault symbols can be wrapper-like (e.g. gtUSDCcore), so use substring fallback.
  if (normalized.includes('USDC')) return 'USDC';
  if (normalized.includes('USDT')) return 'USDT';
  if (normalized.includes('USDE')) return 'USDE';
  if (normalized.includes('DAI')) return 'DAI';
  return null;
}
