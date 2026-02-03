import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { prisma } from './db.js';
import { DEFAULT_NEWS_SOURCES } from './sources.js';
import { pollNewsOnce } from './jobs/news.js';
import { pollApyOnce } from './jobs/apy.js';
import { pushTelegram } from './telegram.js';
import {
  ErrorCode,
  ApiError,
  successResponse,
  errorResponse,
  parsePagination,
  parseNumericRange,
  parseStringFilter,
  buildPaginationMeta,
  errorHandler,
  asyncHandler,
} from './api-utils.js';

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
 */
app.get('/api/news', asyncHandler(async (req, res) => {
  const { limit, offset } = parsePagination(req.query);
  const minScore = Math.max(0, Number(req.query.minScore) || 0);

  // Build where clause
  const where = {
    score: { gte: minScore },
  };

  // Source filter
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

import { PLATFORM_META, normalizePlatformKey } from './platforms.js';

/**
 * GET /api/apy
 * Query params:
 *   - limit (default: 50, max: 200)
 *   - offset (default: 0)
 *   - chain (filter by chain, comma-separated, e.g. "Ethereum,Arbitrum")
 *   - provider (filter by provider name, comma-separated)
 *   - symbol (filter by symbol, comma-separated, e.g. "USDC,USDT")
 *   - source (filter by source: "defillama", "cefi")
 *   - minApy (minimum APY percentage)
 *   - maxApy (maximum APY percentage)
 *   - minTvl (minimum TVL in USD)
 *   - sortBy (field to sort by: "apy", "tvl", "provider" - default: "apy")
 *   - sortOrder (sort direction: "asc", "desc" - default: "desc")
 */
app.get('/api/apy', asyncHandler(async (req, res) => {
  const { limit, offset } = parsePagination(req.query);

  // Build where clause
  const where = {};

  // Chain filter
  const chainFilter = parseStringFilter(req.query.chain);
  if (chainFilter) {
    // Handle "CeFi" as a special case (case-insensitive)
    const normalizedChains = chainFilter.map(c =>
      c.toLowerCase() === 'cefi' ? 'CeFi' : c
    );
    where.chain = { in: normalizedChains };
  }

  // Provider filter
  const providerFilter = parseStringFilter(req.query.provider);
  if (providerFilter) {
    where.provider = { in: providerFilter };
  }

  // Symbol filter
  const symbolFilter = parseStringFilter(req.query.symbol);
  if (symbolFilter) {
    where.symbol = { in: symbolFilter };
  }

  // Source filter (defillama or cefi)
  const sourceFilter = parseStringFilter(req.query.source);
  if (sourceFilter) {
    where.source = { in: sourceFilter };
  }

  // APY range filter
  const apyRange = parseNumericRange(req.query, 'apy');
  if (apyRange) {
    where.apy = apyRange;
  }

  // TVL range filter
  const tvlRange = parseNumericRange(req.query, 'tvl');
  if (tvlRange) {
    where.tvlUsd = tvlRange;
  }

  // Sorting
  const sortBy = req.query.sortBy || 'apy';
  const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

  const orderByMap = {
    apy: [{ apy: sortOrder }, { tvlUsd: 'desc' }],
    tvl: [{ tvlUsd: sortOrder }, { apy: 'desc' }],
    provider: [{ provider: sortOrder }, { apy: 'desc' }],
  };
  const orderBy = orderByMap[sortBy] || orderByMap.apy;

  // Get total count for pagination
  const total = await prisma.apyOpportunity.count({ where });

  // Get items
  const items = await prisma.apyOpportunity.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
  });

  // Enrich with platform metadata
  const enrichedItems = items.map((it) => {
    const key = normalizePlatformKey(it.provider) || (it.source === 'defillama' ? 'defillama' : null);
    const meta = key ? PLATFORM_META[key] : null;
    return {
      ...it,
      platformKey: key,
      platformName: meta?.name || null,
      logoKey: meta?.logoKey || null,
      logoUrl: meta?.logoUrl || null,
      platformUrl: it.url || meta?.homeUrl || null,
    };
  });

  res.json(successResponse(
    { items: enrichedItems },
    buildPaginationMeta(total, limit, offset)
  ));
}));

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
  // News sources
  const existing = await prisma.newsSource.count();
  if (existing === 0) {
    await prisma.newsSource.createMany({ data: DEFAULT_NEWS_SOURCES });
  }

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

  cron.schedule(newsCron, async () => {
    await pollNewsOnce({
      pushFn: async ({ title, url, score }) => {
        // For MVP, push to default telegram only if configured.
        await pushTelegram(`📰 ${title}\nscore=${score}\n${url}`);
      },
    });
  });

  cron.schedule(apyCron, async () => {
    await pollApyOnce();
  });

  // kick once at boot
  pollNewsOnce().catch(() => {});
  pollApyOnce().catch(() => {});

  const port = Number(process.env.PORT || 8787);
  app.listen(port, () => console.log(`YieldNewsHub server listening on :${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
