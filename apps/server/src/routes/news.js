import { Router } from 'express';
import { prisma } from '../db.js';
import {
  ErrorCode,
  ApiError,
  successResponse,
  parsePagination,
  parseStringFilter,
  buildPaginationMeta,
  asyncHandler,
} from '../api-utils.js';

const router = Router();

// Chinese news sources for language filtering
const CHINESE_SOURCES = ['律动BlockBeats', '區塊客 Blockcast', '金色财经快讯'];

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
router.get('/', asyncHandler(async (req, res) => {
  const { limit, offset } = parsePagination(req.query);
  const minScore = Math.max(0, Number(req.query.minScore) || 0);

  // Build where clause
  const where = {
    score: { gte: minScore },
  };

  // Language filter
  const language = req.query.language?.toLowerCase() || 'all';

  if (language === 'zh') {
    where.source = {
      name: { in: CHINESE_SOURCES },
    };
  } else if (language === 'en') {
    where.source = {
      name: { notIn: CHINESE_SOURCES },
    };
  }

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
router.get('/:id', asyncHandler(async (req, res) => {
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

export default router;
