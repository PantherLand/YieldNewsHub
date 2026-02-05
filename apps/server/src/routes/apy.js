import { Router } from 'express';
import { prisma } from '../db.js';
import {
  ErrorCode,
  ApiError,
  successResponse,
  parsePagination,
  parseNumericRange,
  parseStringFilter,
  buildPaginationMeta,
  asyncHandler,
} from '../api-utils.js';
import { PLATFORM_META, normalizePlatformKey, getChainMeta } from '../platforms.js';
import { getBestDepositUrl } from '../defiLinks.js';
import { analyzeApyOpportunity } from '../apy-intelligence.js';

const router = Router();

/**
 * GET /api/apy
 * Query params:
 *   - limit (default: 50, max: 200)
 *   - offset (default: 0)
 *   - chain (filter by chain, comma-separated, case-insensitive)
 *   - provider (filter by provider, comma-separated, case-insensitive)
 *   - symbol (filter by symbol, comma-separated, case-insensitive)
 *   - source (filter by source: "defillama", "cefi")
 *   - q (search in provider/chain/symbol)
 *   - minApy (minimum APY percentage)
 *   - maxApy (maximum APY percentage)
 *   - minTvl (minimum TVL in USD)
 *   - pureStableOnly (true/false)
 *   - recommendedOnly (true/false, recommended = direct stable only: USDC/USDT/USDE/DAI)
 *   - riskLevel (low|medium|high, comma-separated)
 *   - minQuality (0-100)
 *   - sortBy (field to sort by: "quality","risk","apy","tvl","provider","updatedAt" - default: "quality")
 *   - sortOrder (sort direction: "asc", "desc" - default: "desc")
 */
router.get('/', asyncHandler(async (req, res) => {
  const { limit, offset } = parsePagination(req.query);
  const and = [];

  const toBoolean = (value, fieldName) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['1', 'true', 'yes'].includes(normalized)) return true;
      if (['0', 'false', 'no'].includes(normalized)) return false;
    }
    throw new ApiError(
      ErrorCode.INVALID_PARAMETER,
      `${fieldName} must be true or false`,
      fieldName
    );
  };

  // Build where clause
  const where = {};

  // Chain filter (case-insensitive)
  const chainFilter = parseStringFilter(req.query.chain);
  if (chainFilter) {
    and.push({
      OR: chainFilter.map((chain) => ({
        chain: { equals: chain, mode: 'insensitive' },
      })),
    });
  }

  // Provider filter (case-insensitive)
  const providerFilter = parseStringFilter(req.query.provider);
  if (providerFilter) {
    and.push({
      OR: providerFilter.map((provider) => ({
        provider: { equals: provider, mode: 'insensitive' },
      })),
    });
  }

  // Symbol filter (case-insensitive)
  const symbolFilter = parseStringFilter(req.query.symbol);
  if (symbolFilter) {
    and.push({
      OR: symbolFilter.map((symbol) => ({
        symbol: { equals: symbol, mode: 'insensitive' },
      })),
    });
  }

  // Source filter (case-insensitive)
  const sourceFilter = parseStringFilter(req.query.source);
  if (sourceFilter) {
    and.push({
      OR: sourceFilter.map((source) => ({
        source: { equals: source, mode: 'insensitive' },
      })),
    });
  }

  // Keyword search
  if (req.query.q && typeof req.query.q === 'string' && req.query.q.trim()) {
    const q = req.query.q.trim();
    and.push({
      OR: [
        { provider: { contains: q, mode: 'insensitive' } },
        { symbol: { contains: q, mode: 'insensitive' } },
        { chain: { contains: q, mode: 'insensitive' } },
      ],
    });
  }

  // APY range filter
  const apyRange = parseNumericRange(req.query, 'apy');
  if (apyRange) {
    and.push({ apy: apyRange });
  }

  // TVL range filter
  const tvlRange = parseNumericRange(req.query, 'tvl');
  if (tvlRange) {
    and.push({ tvlUsd: tvlRange });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  const pureStableOnly = toBoolean(req.query.pureStableOnly, 'pureStableOnly');
  const recommendedOnly = toBoolean(req.query.recommendedOnly, 'recommendedOnly');
  const minQuality = req.query.minQuality === undefined
    ? undefined
    : Number(req.query.minQuality);
  if (minQuality !== undefined && (Number.isNaN(minQuality) || minQuality < 0 || minQuality > 100)) {
    throw new ApiError(
      ErrorCode.INVALID_PARAMETER,
      'minQuality must be a number between 0 and 100',
      'minQuality'
    );
  }

  const riskLevelFilter = parseStringFilter(req.query.riskLevel);
  let riskLevels;
  if (riskLevelFilter) {
    riskLevels = riskLevelFilter.map((x) => x.toLowerCase());
    const valid = ['low', 'medium', 'high'];
    const invalid = riskLevels.find((x) => !valid.includes(x));
    if (invalid) {
      throw new ApiError(
        ErrorCode.INVALID_PARAMETER,
        `invalid riskLevel: ${invalid}. valid values: low,medium,high`,
        'riskLevel'
      );
    }
  }

  // Sorting
  const sortBy = req.query.sortBy || 'quality';
  const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
  const sortValue = (item) => {
    if (sortBy === 'quality') return item.qualityScore ?? 0;
    if (sortBy === 'risk') return item.riskScore ?? 0;
    if (sortBy === 'apy') return item.apy ?? -Infinity;
    if (sortBy === 'tvl') return item.tvlUsd ?? -Infinity;
    if (sortBy === 'provider') return (item.provider || '').toLowerCase();
    if (sortBy === 'updatedAt') return new Date(item.updatedAt).getTime();
    return item.qualityScore ?? 0;
  };

  // Fetch candidates first, then apply intelligence filtering/sorting.
  const rawItems = await prisma.apyOpportunity.findMany({ where });

  // Enrich with platform and chain metadata
  let enrichedItems = rawItems.map((it) => {
    const key = normalizePlatformKey(it.provider);
    const meta = key ? PLATFORM_META[key] : null;
    const chainMeta = getChainMeta(it.chain);
    const intelligence = analyzeApyOpportunity(it);

    // Format provider name for display (e.g., "aave-v3" -> "Aave V3")
    const formatProviderName = (provider) => {
      if (!provider) return null;
      return provider
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return {
      ...it,
      platformKey: key,
      platformName: meta?.name || formatProviderName(it.provider),
      logoKey: meta?.logoKey || null,
      logoUrl: meta?.logoUrl || null,
      platformUrl: getBestDepositUrl({
        poolId: it.externalId,
        project: it.provider,
        chain: it.chain,
        symbol: it.symbol,
        adapterUrl: it.url,
      }) || meta?.homeUrl || null,
      chainName: chainMeta?.name || it.chain || null,
      chainLogoKey: chainMeta?.logoKey || null,
      chainLogoUrl: chainMeta?.logoUrl || null,
      chainColor: chainMeta?.color || null,
      pureStable: intelligence.pureStable,
      pureDirectStable: intelligence.pureDirectStable,
      stableRatio: intelligence.stableRatio,
      directStableRatio: intelligence.directStableRatio,
      riskScore: intelligence.riskScore,
      riskLevel: intelligence.riskLevel,
      qualityScore: intelligence.qualityScore,
      recommended: intelligence.recommended,
      tokenParts: intelligence.tokens,
    };
  });

  if (pureStableOnly === true) {
    enrichedItems = enrichedItems.filter((it) => it.pureStable);
  }

  if (recommendedOnly === true) {
    enrichedItems = enrichedItems.filter((it) => it.recommended);
  }

  if (riskLevels && riskLevels.length > 0) {
    const set = new Set(riskLevels);
    enrichedItems = enrichedItems.filter((it) => set.has(String(it.riskLevel || '').toLowerCase()));
  }

  if (minQuality !== undefined) {
    enrichedItems = enrichedItems.filter((it) => (it.qualityScore ?? 0) >= minQuality);
  }

  enrichedItems.sort((a, b) => {
    const av = sortValue(a);
    const bv = sortValue(b);

    if (typeof av === 'string' && typeof bv === 'string') {
      return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }

    const delta = Number(av) - Number(bv);
    if (delta !== 0) return sortOrder === 'asc' ? delta : -delta;

    // Tiebreakers: lower risk, then higher TVL, then higher APY
    if ((a.riskScore ?? 0) !== (b.riskScore ?? 0)) return (a.riskScore ?? 0) - (b.riskScore ?? 0);
    if ((a.tvlUsd ?? 0) !== (b.tvlUsd ?? 0)) return (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0);
    return (b.apy ?? -Infinity) - (a.apy ?? -Infinity);
  });

  const total = enrichedItems.length;
  const pagedItems = enrichedItems.slice(offset, offset + limit);

  res.json(successResponse(
    { items: pagedItems },
    buildPaginationMeta(total, limit, offset)
  ));
}));

export default router;
