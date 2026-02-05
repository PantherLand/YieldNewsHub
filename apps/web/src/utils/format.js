export function fmtUsd(x) {
  if (x == null || Number.isNaN(Number(x))) return '-';
  const v = Number(x);
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`;
  return `$${v.toFixed(2)}`;
}

export function tvlHeat(tvlUsd) {
  const v = Number(tvlUsd || 0);
  if (v > 100_000_000) return '\uD83D\uDD25\uD83D\uDD25';
  if (v > 20_000_000) return '\uD83D\uDD25';
  return '';
}
