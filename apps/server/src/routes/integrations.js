import { Router } from 'express';
import { prisma } from '../db.js';
import {
  ErrorCode,
  ApiError,
  successResponse,
  asyncHandler,
} from '../api-utils.js';
import { pushTelegram } from '../telegram.js';

const router = Router();

/**
 * POST /api/integrations/telegram
 * Configure Telegram integration
 */
router.post('/telegram', asyncHandler(async (req, res) => {
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
router.post('/telegram/test', asyncHandler(async (_req, res) => {
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

export default router;
