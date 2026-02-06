import { Router } from 'express';
import { prisma } from '../db.js';
import { successResponse, asyncHandler } from '../api-utils.js';
import { cache } from '../cache.js';
import { getCexLinks } from '../constants/index.js';
import { refreshAllStrategies } from '../strategies/index.js';
import { pollNewsOnce } from '../jobs/news.js';
import { pollApyOnce } from '../jobs/apy.js';
import { config } from '../config/index.js';

const router = Router();

/**
 * GET /api/sources
 * Returns all news and APY data sources
 */
router.get('/sources', asyncHandler(async (_req, res) => {
  const news = await prisma.newsSource.findMany({ orderBy: { name: 'asc' } });
  const apy = await prisma.apySource.findMany({ orderBy: { name: 'asc' } });
  res.json(successResponse({ news, apy }));
}));

/**
 * GET /api/cex-links
 * Returns click-through links for CEX earn pages (no APY aggregation).
 */
router.get('/cex-links', asyncHandler(async (_req, res) => {
  const cacheKey = 'cex:links';

  // Try cache first
  let links = cache.get(cacheKey);
  if (!links) {
    links = getCexLinks();
    cache.set(cacheKey, links, config.cache.cexLinksTtl);
  }

  res.json(successResponse({ items: links }));
}));

/**
 * GET /api/cache/stats
 * Returns cache statistics
 */
router.get('/cache/stats', asyncHandler(async (_req, res) => {
  const stats = cache.stats();
  res.json(successResponse(stats));
}));

/**
 * POST /api/cache/clear
 * Clear all cache (admin only in production)
 */
router.post('/cache/clear', asyncHandler(async (_req, res) => {
  cache.clear();
  res.json(successResponse({ message: 'Cache cleared successfully' }));
}));

/**
 * POST /api/cache/refresh
 * Manually trigger cache refresh
 */
router.post('/cache/refresh', asyncHandler(async (_req, res) => {
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
router.post('/jobs/news', asyncHandler(async (_req, res) => {
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
router.post('/jobs/apy', asyncHandler(async (_req, res) => {
  const result = await pollApyOnce();
  res.json(successResponse({
    message: 'APY polling completed',
    ...result,
  }));
}));

export default router;
