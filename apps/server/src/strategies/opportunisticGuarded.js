import { filterDirectStablePools, rankPools, logTvl, chainPenalty } from './common.js';

export const opportunisticGuardedStrategy = {
  id: 'opportunistic-guarded',
  name: 'Opportunistic Guarded',
  description: '进取型：追求更高 APY，但加上 TVL 与风控护栏。',
  run(allPools, top) {
    let pools = filterDirectStablePools(allPools, {
      minTvlUsd: 5_000_000,
      requireSingleExposure: true,
      requireNoIl: true,
      allowOutlier: false,
      minApy: 3.5,
      maxApy: 25,
    }).filter((p) => p.trustedProtocol || p.chainRisk <= 1);

    if (pools.length < Math.min(top, 4)) {
      pools = filterDirectStablePools(allPools, {
        minTvlUsd: 3_000_000,
        requireSingleExposure: true,
        requireNoIl: true,
        allowOutlier: false,
        minApy: 2.5,
        maxApy: 30,
      }).filter((p) => p.chainRisk <= 1 || (p.tvlUsd || 0) >= 25_000_000);
    }

    if (pools.length === 0) {
      pools = filterDirectStablePools(allPools, {
        minTvlUsd: 1_500_000,
        requireSingleExposure: true,
        requireNoIl: true,
        allowOutlier: false,
        minApy: 2,
        maxApy: 40,
      });
    }

    return rankPools(
      pools,
      (p) =>
        (p.apy || 0) * 0.75 +
        (p.apyBase || p.apy || 0) * 0.35 +
        logTvl(p) +
        (p.trustedProtocol ? 2.2 : 0) -
        chainPenalty(p) * 1.1 -
        Math.max(0, (p.apyReward || 0) - 10) * 0.4,
      top
    );
  },
};
