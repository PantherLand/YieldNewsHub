import { Router } from 'express';
import {
  ErrorCode,
  ApiError,
  successResponse,
  asyncHandler,
} from '../api-utils.js';
import { runStrategyById } from '../strategies/index.js';
import { config } from '../config/index.js';

const router = Router();

// Strategy route definitions
const STRATEGY_ROUTES = [
  { path: '/base-apy-priority', id: 'base-apy-priority' },
  { path: '/conservative-core', id: 'conservative-core' },
  { path: '/liquidity-bluechip', id: 'liquidity-bluechip' },
  { path: '/reward-balanced', id: 'reward-balanced' },
  { path: '/opportunistic-guarded', id: 'opportunistic-guarded' },
];

function parseStrategyTop(queryTop) {
  if (queryTop === undefined || queryTop === null || queryTop === '') {
    return config.api.defaultStrategyTop;
  }
  const top = Number(queryTop);
  if (!Number.isInteger(top) || top < 1 || top > config.api.maxStrategyTop) {
    throw new ApiError(
      ErrorCode.INVALID_PARAMETER,
      `top must be an integer between 1 and ${config.api.maxStrategyTop}`,
      'top'
    );
  }
  return top;
}

// Register all strategy routes
for (const { path, id } of STRATEGY_ROUTES) {
  router.get(path, asyncHandler(async (req, res) => {
    const top = parseStrategyTop(req.query.top);
    const result = await runStrategyById(id, top);
    if (!result) {
      throw new ApiError(ErrorCode.NOT_FOUND, `strategy not found: ${id}`, 'strategyId', 404);
    }
    res.json(successResponse({
      category: 'strategy',
      ...result,
    }));
  }));
}

export default router;
