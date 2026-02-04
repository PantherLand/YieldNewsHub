import { filterDirectStablePools, rankPools, logTvl, chainPenalty } from './common.js';

export const liquidityBluechipStrategy = {
  id: 'liquidity-bluechip',
  name: 'Liquidity Bluechip',
  description: '流动性优先：超大 TVL 池优先，收益其次。',
  run(allPools, top) {
    const pools = filterDirectStablePools(allPools, {
      minTvlUsd: 50_000_000,
      requireSingleExposure: true,
      requireNoIl: true,
      allowOutlier: false,
      minApy: 1.5,
      maxApy: 18,
    }).filter((p) => p.trustedProtocol || (p.tvlUsd || 0) >= 200_000_000);

    return rankPools(
      pools,
      (p) =>
        logTvl(p) * 3 +
        (p.apyBase || 0) * 0.5 +
        (p.apy || 0) * 0.3 +
        (p.trustedProtocol ? 1.5 : 0) -
        chainPenalty(p) * 0.8,
      top
    );
  },
};
