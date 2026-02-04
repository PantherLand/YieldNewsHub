import { filterDirectStablePools, rankPools, logTvl } from './common.js';

export const baseApyPriorityStrategy = {
  id: 'base-apy-priority',
  name: 'Base APY Priority',
  description: '优先基础 APY，其次奖励 APY 和 TVL，接近你给的参考策略。',
  run(allPools, top) {
    const pools = filterDirectStablePools(allPools, {
      minTvlUsd: 5_000_000,
      requireSingleExposure: true,
      requireNoIl: true,
      allowOutlier: false,
    });

    return rankPools(
      pools,
      (p) => (p.apyBase || 0) + (p.apyReward || 0) * 0.1 + logTvl(p),
      top
    );
  },
};
