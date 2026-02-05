import React from 'react';
import { useLanguage } from '../../i18n/index.js';
import { theme } from '../../styles/index.js';
import { NewsCard } from './NewsCard.jsx';

export function NewsList({
  data,
  minScore,
  setMinScore,
  hasPendingUpdate,
  pendingCount,
  onLoadUpdates,
  onViewDetail,
}) {
  const { t } = useLanguage();
  const filterStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
      flexWrap: 'wrap',
      padding: theme.spacing.md,
      background: theme.colors.bgCard,
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
    },
    label: {
      color: theme.colors.textMuted,
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
    },
    input: {
      width: '64px',
      padding: '8px 10px',
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.bgInput,
      color: theme.colors.neonGreen,
      fontSize: '14px',
      fontFamily: theme.fonts.mono,
      fontWeight: 600,
      outline: 'none',
      textAlign: 'center',
    },
    hint: {
      color: theme.colors.textMuted,
      fontSize: '11px',
    },
    grid: {
      display: 'grid',
      gap: theme.spacing.md,
    },
    updateBanner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      background: 'rgba(0, 255, 136, 0.08)',
      borderRadius: theme.radius.md,
      border: '1px solid rgba(0, 255, 136, 0.28)',
      color: theme.colors.neonGreen,
    },
    updateButton: {
      border: 'none',
      borderRadius: theme.radius.md,
      background: theme.colors.gradientPrimary,
      color: '#fff',
      padding: '8px 12px',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer',
    },
  };

  return (
    <div>
      {hasPendingUpdate && (
        <div style={filterStyles.updateBanner}>
          <span style={{ fontSize: '12px', fontWeight: 700 }}>
            {t('newsUpdatesReady')} ({pendingCount})
          </span>
          <button type="button" style={filterStyles.updateButton} onClick={onLoadUpdates}>
            {t('newsLoadUpdates')}
          </button>
        </div>
      )}
      <div style={filterStyles.container}>
        <span style={filterStyles.label}>{t('newsMinScoreLabel')}</span>
        <input
          type="number"
          value={minScore}
          onChange={(event) => setMinScore(Number(event.target.value))}
          style={filterStyles.input}
          min={1}
          max={10}
        />
        <span style={filterStyles.hint}>{t('newsMinScoreHint')}</span>
      </div>
      <div style={filterStyles.grid}>
        {data.length === 0 ? (
          <div style={{
            padding: theme.spacing.xl,
            textAlign: 'center',
            color: theme.colors.textMuted,
            background: theme.colors.bgCard,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{ fontSize: '24px', marginBottom: theme.spacing.sm }}>...</div>
            {t('newsNoResults')}
          </div>
        ) : (
          data.map((item) => (
            <NewsCard key={item.id} item={item} onViewDetail={onViewDetail} />
          ))
        )}
      </div>
    </div>
  );
}

export default NewsList;
