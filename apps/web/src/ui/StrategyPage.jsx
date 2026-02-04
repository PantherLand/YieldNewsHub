import React, { useEffect, useMemo, useState } from 'react';

const theme = {
  colors: {
    bgCard: 'rgba(15, 23, 42, 0.55)',
    bgCardHover: 'rgba(26, 23, 48, 0.8)',
    border: 'rgba(148, 163, 184, 0.18)',
    textPrimary: 'rgba(248, 250, 252, 0.95)',
    textMuted: 'rgba(148, 163, 184, 0.8)',
    cyan: '#22d3ee',
    green: '#00ff88',
    purple: '#a855f7',
  },
  radius: { lg: '14px', md: '10px', full: '999px' },
  spacing: { sm: '8px', md: '12px', lg: '16px' },
};

function fmtUsd(x) {
  const v = Number(x);
  if (!Number.isFinite(v)) return '$0';
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`;
  return `$${v.toFixed(0)}`;
}

function tvlHeat(tvlUsd) {
  const v = Number(tvlUsd || 0);
  if (v > 100_000_000) return '🔥🔥';
  if (v > 50_000_000) return '🔥';
  return '';
}

const STRATEGY_ORDER = [
  'base-apy-priority',
  'conservative-core',
  'liquidity-bluechip',
  'reward-balanced',
  'opportunistic-guarded',
];

const STRATEGY_I18N = {
  'base-apy-priority': {
    nameKey: 'strategyNameBaseApyPriority',
    descKey: 'strategyDescBaseApyPriority',
  },
  'conservative-core': {
    nameKey: 'strategyNameConservativeCore',
    descKey: 'strategyDescConservativeCore',
  },
  'liquidity-bluechip': {
    nameKey: 'strategyNameLiquidityBluechip',
    descKey: 'strategyDescLiquidityBluechip',
  },
  'reward-balanced': {
    nameKey: 'strategyNameRewardBalanced',
    descKey: 'strategyDescRewardBalanced',
  },
  'opportunistic-guarded': {
    nameKey: 'strategyNameOpportunisticGuarded',
    descKey: 'strategyDescOpportunisticGuarded',
  },
};

const SORT_DEFAULT_DIRECTION = {
  rank: 'asc',
  pool: 'asc',
  chain: 'asc',
  apy: 'desc',
  tvlUsd: 'desc',
  score: 'desc',
};

function compareValues(a, b) {
  const av = a ?? '';
  const bv = b ?? '';
  if (typeof av === 'string' || typeof bv === 'string') {
    return String(av).localeCompare(String(bv));
  }
  return Number(av) - Number(bv);
}

function renderScoreStars(score) {
  const normalized = Math.max(0, Math.min(100, Number(score) || 0));
  let full = 1;
  if (normalized >= 88) full = 5;
  else if (normalized >= 74) full = 4;
  else if (normalized >= 60) full = 3;
  else if (normalized >= 45) full = 2;
  const empty = Math.max(0, 5 - full);
  return `${'★'.repeat(full)}${'☆'.repeat(empty)}`;
}

function getDisplayScore(item) {
  return Number(item?.score ?? item?.scoreNormalized ?? 0);
}

function resolveStrategyName(strategy, t) {
  const id = strategy?.id;
  const key = id ? STRATEGY_I18N[id]?.nameKey : null;
  return key ? t(key) : (strategy?.name || '-');
}

function resolveStrategyDescription(strategy, t) {
  const id = strategy?.id;
  const key = id ? STRATEGY_I18N[id]?.descKey : null;
  return key ? t(key) : (strategy?.description || '');
}

function resolveRowUrl(row) {
  const candidate = row?.platformUrl || row?.url || '';
  if (typeof candidate !== 'string') return null;
  const normalized = candidate.trim();
  return normalized ? normalized : null;
}

export default function StrategyPage({ groups, loading, t }) {
  const orderedGroups = useMemo(() => {
    const map = new Map((groups || []).map((group) => [group.strategy?.id, group]));
    const preferred = STRATEGY_ORDER.map((id) => map.get(id)).filter(Boolean);
    const extras = (groups || []).filter((group) => !STRATEGY_ORDER.includes(group.strategy?.id));
    return [...preferred, ...extras];
  }, [groups]);

  const [activeStrategyId, setActiveStrategyId] = useState(null);
  const [sortBy, setSortBy] = useState('rank');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    if (!orderedGroups.length) return;
    if (!activeStrategyId || !orderedGroups.some((group) => group.strategy?.id === activeStrategyId)) {
      setActiveStrategyId(orderedGroups[0].strategy?.id || null);
    }
  }, [orderedGroups, activeStrategyId]);

  const activeGroup = useMemo(
    () => orderedGroups.find((group) => group.strategy?.id === activeStrategyId) || orderedGroups[0] || null,
    [orderedGroups, activeStrategyId]
  );

  const activeItems = useMemo(() => {
    const withRank = (activeGroup?.items || []).map((item, index) => ({
      ...item,
      __rank: index + 1,
      __poolText: `${item.project || ''} ${item.symbol || ''}`.trim(),
    }));
    if (!withRank.length) return withRank;

    const sorted = [...withRank].sort((a, b) => {
      let result = 0;
      if (sortBy === 'rank') result = compareValues(a.__rank, b.__rank);
      else if (sortBy === 'pool') result = compareValues(a.__poolText, b.__poolText);
      else if (sortBy === 'chain') result = compareValues(a.chain, b.chain);
      else if (sortBy === 'apy') result = compareValues(a.apy, b.apy);
      else if (sortBy === 'tvlUsd') result = compareValues(a.tvlUsd, b.tvlUsd);
      else if (sortBy === 'score') result = compareValues(getDisplayScore(a), getDisplayScore(b));

      if (result === 0) {
        result = compareValues(a.__rank, b.__rank);
      }
      return sortDirection === 'asc' ? result : -result;
    });

    return sorted;
  }, [activeGroup, sortBy, sortDirection]);

  function onSortClick(key) {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortBy(key);
    setSortDirection(SORT_DEFAULT_DIRECTION[key] || 'asc');
  }

  function sortIndicator(key) {
    if (sortBy !== key) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  }

  function renderSortableHeader(key, label) {
    return (
      <button
        type="button"
        onClick={() => onSortClick(key)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: sortBy === key ? theme.colors.cyan : theme.colors.textMuted,
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          cursor: 'pointer',
        }}
      >
        <span>{label}</span>
        <span>{sortIndicator(key)}</span>
      </button>
    );
  }

  return (
    <div style={{ display: 'grid', gap: theme.spacing.lg }}>
      <div style={{ color: theme.colors.textMuted, fontSize: 13, lineHeight: 1.6 }}>
        {t('strategyDescription')}
      </div>

      {loading && (
        <div style={{ color: theme.colors.cyan, fontSize: 13 }}>
          {t('loading')}
        </div>
      )}

      {!!orderedGroups.length && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {orderedGroups.map((group) => {
            const active = group.strategy?.id === (activeGroup?.strategy?.id || '');
            return (
              <button
                key={group.strategy?.id || group.strategy?.name}
                type="button"
                onClick={() => setActiveStrategyId(group.strategy?.id || null)}
                style={{
                  padding: '8px 12px',
                  borderRadius: theme.radius.full,
                  border: `1px solid ${active ? '#22d3ee66' : theme.colors.border}`,
                  background: active ? 'rgba(34, 211, 238, 0.12)' : theme.colors.bgCard,
                  color: active ? theme.colors.cyan : theme.colors.textMuted,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {resolveStrategyName(group.strategy, t)}
              </button>
            );
          })}
        </div>
      )}

      {activeGroup ? (
        <div
          style={{
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: theme.spacing.md }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.colors.textPrimary }}>
              {resolveStrategyName(activeGroup.strategy, t)}
            </div>
            <span
              style={{
                borderRadius: theme.radius.full,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.cyan,
                padding: '2px 10px',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {activeGroup.items?.length || 0} {t('poolsUnit')}
            </span>
            <div style={{ marginLeft: 'auto', color: theme.colors.textMuted, fontSize: 11 }}>
              {t('strategyUpdated')}: {activeGroup.generatedAt ? new Date(activeGroup.generatedAt).toLocaleString() : '-'}
            </div>
          </div>

          <div style={{ color: theme.colors.textMuted, fontSize: 13, marginBottom: theme.spacing.md }}>
            {resolveStrategyDescription(activeGroup.strategy, t)}
          </div>

          {activeGroup.items?.length ? (
            <div style={{ display: 'grid', gap: 8 }}>
              <div
                className="strategy-head"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1.8fr 1fr 1fr 1fr 0.9fr',
                  gap: 8,
                  padding: '8px 12px',
                  color: theme.colors.textMuted,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                <div>{renderSortableHeader('rank', t('strategyColRank'))}</div>
                <div>{renderSortableHeader('pool', t('strategyColPool'))}</div>
                <div>{renderSortableHeader('chain', t('tableChain'))}</div>
                <div>{renderSortableHeader('apy', t('strategyColApy'))}</div>
                <div>{renderSortableHeader('tvlUsd', t('tableTvl'))}</div>
                <div>{renderSortableHeader('score', t('strategyColScore'))}</div>
              </div>

              {activeItems.map((row, idx) => {
                const rowUrl = resolveRowUrl(row);
                const clickable = Boolean(rowUrl);
                const openLink = () => {
                  if (!rowUrl || typeof window === 'undefined') return;
                  window.open(rowUrl, '_blank', 'noopener,noreferrer');
                };

                return (
                  <div
                    key={`${activeGroup.strategy?.id}-${row.pool || row.symbol}-${row.__rank}`}
                    className={`strategy-row${clickable ? ' strategy-row-clickable' : ''}`}
                    onClick={clickable ? openLink : undefined}
                    onKeyDown={clickable ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openLink();
                      }
                    } : undefined}
                    role={clickable ? 'link' : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 1.8fr 1fr 1fr 1fr 0.9fr',
                      gap: 8,
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.bgCardHover,
                      cursor: clickable ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{ color: theme.colors.purple, fontSize: 12, fontWeight: 700 }}>#{idx + 1}</div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: theme.colors.textPrimary, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.project || '-'} • {row.symbol || '-'}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                        {row.trustedProtocol && (
                          <span
                            style={{
                              borderRadius: theme.radius.full,
                              border: `1px solid #00ff8840`,
                              color: theme.colors.green,
                              padding: '1px 8px',
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            {t('strategyTrusted')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ color: theme.colors.textMuted, fontSize: 12 }}>{row.chain || '-'}</div>

                    <div>
                      <div style={{ color: theme.colors.green, fontWeight: 700, fontSize: 13 }}>
                        {Number(row.apy || 0).toFixed(2)}%
                      </div>
                      <div style={{ color: theme.colors.textMuted, fontSize: 11 }}>
                        B {Number(row.apyBase || 0).toFixed(2)} / R {Number(row.apyReward || 0).toFixed(2)}
                      </div>
                    </div>

                    <div style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                      {fmtUsd(row.tvlUsd)} {tvlHeat(row.tvlUsd)}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ color: '#fbbf24', fontSize: 13, letterSpacing: '1px' }}>
                        {renderScoreStars(getDisplayScore(row))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: theme.colors.textMuted, fontSize: 12 }}>{t('strategyNoData')}</div>
          )}
        </div>
      ) : null}

      {!loading && !orderedGroups.length && (
        <div style={{ color: theme.colors.textMuted, fontSize: 12 }}>{t('strategyNoData')}</div>
      )}

      <style>{`
        .strategy-row-clickable:hover {
          border-color: #22d3ee66 !important;
        }

        .strategy-row-clickable:focus-visible {
          outline: 2px solid #22d3ee99;
          outline-offset: 2px;
        }

        @media (max-width: 980px) {
          .strategy-head {
            display: none !important;
          }

          .strategy-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
