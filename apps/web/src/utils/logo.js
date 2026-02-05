import { LOGOS } from '../ui/logos.js';

export function buildProtocolLogoCandidates(row = {}) {
  const candidates = [];
  const push = (url) => {
    if (!url || typeof url !== 'string') return;
    if (!candidates.includes(url)) candidates.push(url);
  };

  if (row.logoKey && LOGOS[row.logoKey]) push(LOGOS[row.logoKey]);
  if (row.logoUrl) push(row.logoUrl);

  const providerRaw = String(row.provider || '').toLowerCase().trim();
  const platformKey = String(row.platformKey || '').toLowerCase().trim();
  const slugs = new Set();
  if (providerRaw) slugs.add(providerRaw.replace(/[^a-z0-9-]/g, ''));
  if (platformKey) slugs.add(platformKey.replace(/[^a-z0-9-]/g, ''));

  for (const slug of Array.from(slugs)) {
    if (!slug) continue;
    push(`https://icons.llama.fi/${slug}.jpg`);
    push(`https://icons.llama.fi/${slug}.png`);
    const withoutVersion = slug.replace(/-v\d+$/g, '');
    if (withoutVersion && withoutVersion !== slug) {
      push(`https://icons.llama.fi/${withoutVersion}.jpg`);
      push(`https://icons.llama.fi/${withoutVersion}.png`);
    }
  }

  return candidates;
}
