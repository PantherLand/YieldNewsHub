import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { prisma } from './db.js';
import { DEFAULT_NEWS_SOURCES } from './sources.js';
import { pollNewsOnce } from './jobs/news.js';
import { pollApyOnce } from './jobs/apy.js';
import { pushTelegram } from './telegram.js';
import { runStrategyById, refreshAllStrategies } from './strategies/index.js';
import { cache } from './cache.js';
import {
  ErrorCode,
  ApiError,
  successResponse,
  parsePagination,
  parseNumericRange,
  parseStringFilter,
  buildPaginationMeta,
  errorHandler,
  asyncHandler,
} from './api-utils.js';
import { analyzeApyOpportunity } from './apy-intelligence.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: process.env.WEB_ORIGIN || true,
    credentials: true,
  })
);

app.get('/healthz', (_req, res) => res.json({ success: true, data: { ok: true } }));

// --- APIs

/**
 * GET /api/news
 * Query params:
 *   - limit (default: 50, max: 200)
 *   - offset (default: 0)
 *   - minScore (default: 0)
 *   - source (filter by source name, comma-separated)
 *   - tags (filter by tags, comma-separated)
 *   - q (search in title)
 *   - language (filter by language: "en", "zh", or "all" - default: "all")
 */
app.get('/api/news', asyncHandler(async (req, res) => {
  const { limit, offset } = parsePagination(req.query);
  const minScore = Math.max(0, Number(req.query.minScore) || 0);

  // Build where clause
  const where = {
    score: { gte: minScore },
  };

  // Language filter - define Chinese and English sources
  const CHINESE_SOURCES = ['律动BlockBeats', '區塊客 Blockcast', '金色财经快讯'];
  const language = req.query.language?.toLowerCase() || 'all';

  if (language === 'zh') {
    // Chinese only - filter to Chinese sources
    where.source = {
      name: { in: CHINESE_SOURCES },
    };
  } else if (language === 'en') {
    // English only - exclude Chinese sources
    where.source = {
      name: { notIn: CHINESE_SOURCES },
    };
  }
  // If language === 'all' or not specified, show all sources

  // Source filter (can override language filter if explicitly specified)
  const sourceFilter = parseStringFilter(req.query.source);
  if (sourceFilter) {
    where.source = {
      name: { in: sourceFilter },
    };
  }

  // Tags filter (contains any of the specified tags)
  const tagsFilter = parseStringFilter(req.query.tags);
  if (tagsFilter) {
    where.tags = { hasSome: tagsFilter };
  }

  // Title search
  if (req.query.q && typeof req.query.q === 'string' && req.query.q.trim()) {
    where.title = {
      contains: req.query.q.trim(),
      mode: 'insensitive',
    };
  }

  // Get total count for pagination
  const total = await prisma.newsItem.count({ where });

  // Get items
  const items = await prisma.newsItem.findMany({
    where,
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    skip: offset,
    take: limit,
    include: { source: true },
  });

  res.json(successResponse(
    { items },
    buildPaginationMeta(total, limit, offset)
  ));
}));

/**
 * GET /api/news/:id
 */
app.get('/api/news/:id', asyncHandler(async (req, res) => {
  const id = String(req.params.id || '').trim();
  if (!id) {
    throw new ApiError(ErrorCode.INVALID_PARAMETER, 'news id is required', 'id');
  }

  const item = await prisma.newsItem.findUnique({
    where: { id },
    include: { source: true },
  });

  if (!item) {
    throw new ApiError(ErrorCode.NOT_FOUND, `news not found: ${id}`, 'id', 404);
  }

  res.json(successResponse({ item }));
}));

import { PLATFORM_META, normalizePlatformKey, getChainMeta } from './platforms.js';
import { getBestDepositUrl } from './defiLinks.js';
import { getCexLinks } from './cexLinks.js';

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
app.get('/api/apy', asyncHandler(async (req, res) => {
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
  // Current dataset size is small, so in-memory post-processing keeps query API flexible.
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
      // Use meta name if available, otherwise format the raw provider name
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
      // Chain metadata
      chainName: chainMeta?.name || it.chain || null,
      chainLogoKey: chainMeta?.logoKey || null,
      chainLogoUrl: chainMeta?.logoUrl || null,
      chainColor: chainMeta?.color || null,
      // Intelligence fields for better filtering UX
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

const STRATEGY_ROUTE_MAP = [
  ['/api/strategy/base-apy-priority', 'base-apy-priority'],
  ['/api/strategy/conservative-core', 'conservative-core'],
  ['/api/strategy/liquidity-bluechip', 'liquidity-bluechip'],
  ['/api/strategy/reward-balanced', 'reward-balanced'],
  ['/api/strategy/opportunistic-guarded', 'opportunistic-guarded'],
];

function parseStrategyTop(queryTop) {
  if (queryTop === undefined || queryTop === null || queryTop === '') return 10;
  const top = Number(queryTop);
  if (!Number.isInteger(top) || top < 1 || top > 30) {
    throw new ApiError(
      ErrorCode.INVALID_PARAMETER,
      'top must be an integer between 1 and 30',
      'top'
    );
  }
  return top;
}

for (const [routePath, strategyId] of STRATEGY_ROUTE_MAP) {
  app.get(routePath, asyncHandler(async (req, res) => {
    const top = parseStrategyTop(req.query.top);
    const result = await runStrategyById(strategyId, top);
    if (!result) {
      throw new ApiError(ErrorCode.NOT_FOUND, `strategy not found: ${strategyId}`, 'strategyId', 404);
    }
    res.json(successResponse({
      category: 'strategy',
      ...result,
    }));
  }));
}

/**
 * GET /api/sources
 * Returns all news and APY data sources
 */
app.get('/api/sources', asyncHandler(async (_req, res) => {
  const news = await prisma.newsSource.findMany({ orderBy: { name: 'asc' } });
  const apy = await prisma.apySource.findMany({ orderBy: { name: 'asc' } });
  res.json(successResponse({ news, apy }));
}));

/**
 * GET /api/cex-links
 * Returns click-through links for CEX earn pages (no APY aggregation).
 */
app.get('/api/cex-links', asyncHandler(async (_req, res) => {
  const cacheKey = 'cex:links';

  // Try cache first (1 hour TTL)
  let links = cache.get(cacheKey);
  if (!links) {
    links = getCexLinks();
    cache.set(cacheKey, links, 60 * 60_000); // 1 hour
  }

  res.json(successResponse({ items: links }));
}));

/**
 * GET /api/cache/stats
 * Returns cache statistics
 */
app.get('/api/cache/stats', asyncHandler(async (_req, res) => {
  const stats = cache.stats();
  res.json(successResponse(stats));
}));

/**
 * POST /api/cache/clear
 * Clear all cache (admin only in production)
 */
app.post('/api/cache/clear', asyncHandler(async (_req, res) => {
  cache.clear();
  res.json(successResponse({ message: 'Cache cleared successfully' }));
}));

/**
 * POST /api/cache/refresh
 * Manually trigger cache refresh
 */
app.post('/api/cache/refresh', asyncHandler(async (_req, res) => {
  const results = await refreshAllStrategies();
  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  res.json(successResponse({
    message: 'Cache refresh completed',
    succeeded,
    failed,
    details: results,
  }));
}));

/**
 * POST /api/jobs/news
 * Manually trigger news polling
 */
app.post('/api/jobs/news', asyncHandler(async (_req, res) => {
  const result = await pollNewsOnce();
  res.json(successResponse({
    message: 'News polling completed',
    ...result,
  }));
}));

/**
 * POST /api/jobs/apy
 * Manually trigger APY polling
 */
app.post('/api/jobs/apy', asyncHandler(async (_req, res) => {
  await pollApyOnce();
  res.json(successResponse({
    message: 'APY polling completed',
  }));
}));

/**
 * POST /api/integrations/telegram
 * Configure Telegram integration
 */
app.post('/api/integrations/telegram', asyncHandler(async (req, res) => {
  const { enabled, botToken, chatId } = req.body || {};

  // Validation
  if (typeof enabled !== 'boolean') {
    throw new ApiError(
      ErrorCode.INVALID_PARAMETER,
      'enabled must be a boolean',
      'enabled'
    );
  }
  if (typeof botToken !== 'string' || !botToken.trim()) {
    throw new ApiError(
      ErrorCode.INVALID_PARAMETER,
      'botToken must be a non-empty string',
      'botToken'
    );
  }
  if (typeof chatId !== 'string' || !chatId.trim()) {
    throw new ApiError(
      ErrorCode.INVALID_PARAMETER,
      'chatId must be a non-empty string',
      'chatId'
    );
  }

  const existing = await prisma.telegramIntegration.findFirst();
  const row = await prisma.telegramIntegration.upsert({
    where: { id: existing?.id || '___missing___' },
    update: { enabled, botToken, chatId },
    create: { enabled, botToken, chatId },
  }).catch(async () => {
    if (existing) return existing;
    return prisma.telegramIntegration.create({ data: { enabled, botToken, chatId } });
  });

  res.json(successResponse({
    integration: { id: row.id, enabled: row.enabled, chatId: row.chatId }
  }));
}));

/**
 * POST /api/integrations/telegram/test
 * Send a test message via Telegram
 */
app.post('/api/integrations/telegram/test', asyncHandler(async (_req, res) => {
  const r = await pushTelegram('YieldNewsHub test message');
  if (r.ok) {
    res.json(successResponse({ message: 'Test message sent successfully' }));
  } else {
    throw new ApiError(
      ErrorCode.INTERNAL_ERROR,
      r.reason || 'Failed to send test message',
      null,
      500
    );
  }
}));

// Global error handler (must be last middleware)
app.use(errorHandler);

// --- bootstrap
async function ensureSeedData() {
  // News sources - sync to add new sources while keeping existing ones
  console.log('[bootstrap] Syncing news sources...');
  const existingSources = await prisma.newsSource.findMany();
  const existingNames = new Set(existingSources.map(s => s.name));

  for (const source of DEFAULT_NEWS_SOURCES) {
    if (!existingNames.has(source.name)) {
      await prisma.newsSource.create({ data: source });
      console.log(`[bootstrap] + Added news source: ${source.name}`);
    }
  }

  const totalSources = await prisma.newsSource.count();
  console.log(`[bootstrap] ✓ ${totalSources} news sources ready`);

  // APY sources
  const apyExisting = await prisma.apySource.count();
  if (apyExisting === 0) {
    await prisma.apySource.createMany({
      data: [
        { name: 'DeFiLlama', url: 'https://yields.llama.fi/pools', enabled: true },
      ],
    });
  }
}

async function main() {
  await ensureSeedData();

  // Jobs
  const newsCron = process.env.NEWS_POLL_CRON || '*/5 * * * *';
  const apyCron = process.env.APY_POLL_CRON || '0 * * * *';
  const cacheCron = process.env.CACHE_REFRESH_CRON || '0 * * * *'; // Every hour

  // News polling job
  cron.schedule(newsCron, async () => {
    await pollNewsOnce({
      pushFn: async ({ title, url, score }) => {
        // For MVP, push to default telegram only if configured.
        await pushTelegram(`📰 ${title}\nscore=${score}\n${url}`);
      },
    });
  });

  // APY data polling job
  cron.schedule(apyCron, async () => {
    await pollApyOnce();
  });

  // Cache refresh job - runs after APY data is updated
  cron.schedule(cacheCron, async () => {
    console.log('[cache] Refreshing strategy caches...');
    try {
      const results = await refreshAllStrategies();
      const succeeded = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      console.log(`[cache] Strategy cache refresh completed: ${succeeded} succeeded, ${failed} failed`);
    } catch (error) {
      console.error('[cache] Strategy cache refresh failed:', error.message);
    }
  });

  // kick once at boot
  pollNewsOnce().catch(() => {});
  pollApyOnce().catch(() => {});

  // Initial cache warm-up (run after APY data loads)
  setTimeout(() => {
    refreshAllStrategies()
      .then(results => {
        const succeeded = results.filter(r => r.success).length;
        console.log(`[cache] Initial cache warm-up completed: ${succeeded} strategies cached`);
      })
      .catch(error => {
        console.error('[cache] Initial cache warm-up failed:', error.message);
      });
  }, 5000); // Wait 5 seconds for APY data to load

  const port = Number(process.env.PORT || 8787);
  app.listen(port, () => console.log(`YieldNewsHub server listening on :${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
