import { filterDirectStablePools, rankPools, logTvl, chainPenalty } from './common.js';

export const conservativeCoreStrategy = {
  id: 'conservative-core',
  name: 'Conservative Core',
  description: '保守型：高 TVL、低链风险、可信协议优先。',
  run(allPools, top) {
    const pools = filterDirectStablePools(allPools, {
      minTvlUsd: 20_000_000,
      requireSingleExposure: true,
      requireNoIl: true,
      allowOutlier: false,
      minApy: 2,
      maxApy: 12,
    }).filter((p) => p.trustedProtocol);

    return rankPools(
      pools,
      (p) =>
        (p.apyBase || 0) * 0.7 +
        (p.apy || 0) * 0.3 +
        logTvl(p) * 1.2 +
        2.5 -
        chainPenalty(p) * 1.4 -
        Math.max(0, (p.apyReward || 0) - 3) * 0.5,
      top
    );
  },
};
