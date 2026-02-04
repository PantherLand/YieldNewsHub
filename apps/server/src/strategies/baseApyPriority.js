import { filterDirectStablePools, rankPools, logTvl } from './common.js';

export const baseApyPriorityStrategy = {
  id: 'base-apy-priority',
  name: 'Base APY Priority',
  description: '基础优先：先看基础 APY，再看奖励 APY 和 TVL。 / Base-first: prioritize base APY, then reward APY and TVL.',
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
