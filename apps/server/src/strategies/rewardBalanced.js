import { filterDirectStablePools, rankPools, logTvl, chainPenalty } from './common.js';

export const rewardBalancedStrategy = {
  id: 'reward-balanced',
  name: 'Reward Balanced',
  description: '奖励增强型：接受适度激励 APY，但惩罚过度补贴。 / Reward-balanced: accepts moderate incentive APY but penalizes excessive subsidies.',
  run(allPools, top) {
    let pools = filterDirectStablePools(allPools, {
      minTvlUsd: 10_000_000,
      requireSingleExposure: true,
      requireNoIl: true,
      allowOutlier: false,
      minApy: 2.5,
      maxApy: 22,
    }).filter((p) => {
      const baseApy = p.apyBase || p.apy || 0;
      const rewardApy = p.apyReward || 0;
      return baseApy >= 1.2 && rewardApy <= 18;
    });

    if (pools.length < Math.min(top, 4)) {
      pools = filterDirectStablePools(allPools, {
        minTvlUsd: 5_000_000,
        requireSingleExposure: true,
        requireNoIl: true,
        allowOutlier: false,
        minApy: 2,
        maxApy: 25,
      }).filter((p) => {
        const baseApy = p.apyBase || p.apy || 0;
        const rewardApy = p.apyReward || 0;
        return baseApy >= 1 && rewardApy <= 20;
      });
    }

    if (pools.length === 0) {
      pools = filterDirectStablePools(allPools, {
        minTvlUsd: 2_000_000,
        requireSingleExposure: true,
        requireNoIl: true,
        allowOutlier: false,
        minApy: 1.5,
        maxApy: 35,
      });
    }

    return rankPools(
      pools,
      (p) =>
        (p.apyBase || p.apy || 0) +
        Math.min(p.apyReward || 0, 8) * 0.25 +
        logTvl(p) * 0.9 +
        (p.trustedProtocol ? 1.8 : 0) -
        Math.max(0, (p.apyReward || 0) - 8) * 0.9 -
        chainPenalty(p) * 0.9,
      top
    );
  },
};
