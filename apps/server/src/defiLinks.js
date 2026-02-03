// Map DeFiLlama `project` identifiers to official deposit pages.
// If a project isn't mapped, we fall back to the DeFiLlama pool page.

export const DEFI_PROJECT_LINKS = {
  'aave-v3': 'https://app.aave.com/',
  'morpho-v1': 'https://app.morpho.org/',
  'euler-v2': 'https://app.euler.finance/',
  'yearn-finance': 'https://yearn.fi/',
  'spark': 'https://app.spark.fi/',
};

export function officialDepositUrl(project, { chain, symbol } = {}) {
  const key = String(project || '').toLowerCase();
  const base = DEFI_PROJECT_LINKS[key];
  if (!base) return null;

  // Some apps support deep links; keep simple for MVP.
  // We intentionally avoid guessy query params that may break.
  void chain;
  void symbol;
  return base;
}
