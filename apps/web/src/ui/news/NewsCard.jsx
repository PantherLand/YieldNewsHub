import React, { useState } from 'react';
import { useLanguage } from '../../i18n/index.js';
import { theme } from '../../styles/index.js';
import { SUMMARY_MAX_LENGTH } from '../../config/index.js';
import { formatNewsTime } from './formatNewsTime.js';

export function NewsCard({ item, onViewDetail }) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: 'rgba(0, 255, 136, 0.1)', color: theme.colors.neonGreen, border: 'rgba(0, 255, 136, 0.3)' };
    if (score >= 5) return { bg: 'rgba(255, 136, 0, 0.1)', color: theme.colors.neonOrange, border: 'rgba(255, 136, 0, 0.3)' };
    return { bg: 'rgba(100, 116, 139, 0.1)', color: theme.colors.textMuted, border: 'rgba(100, 116, 139, 0.2)' };
  };

  const scoreStyle = getScoreColor(item.score);
  const summaryTooLong = item.summary && item.summary.length > SUMMARY_MAX_LENGTH;
  const displaySummary = summaryTooLong
    ? item.summary.slice(0, SUMMARY_MAX_LENGTH) + '...'
    : item.summary;

  const cardStyles = {
    container: {
      display: 'block',
      padding: theme.spacing.lg,
      background: isHovered
        ? `linear-gradient(135deg, ${theme.colors.bgCardHover} 0%, rgba(168, 85, 247, 0.05) 100%)`
        : theme.colors.bgCard,
      border: `1px solid ${isHovered ? theme.colors.borderHover : theme.colors.border}`,
      borderRadius: theme.radius.lg,
      textDecoration: 'none',
      color: 'inherit',
      transition: theme.transition.normal,
      transform: isHovered ? 'translateY(-3px)' : 'none',
      boxShadow: isHovered ? theme.colors.glowPurple : '0 4px 16px rgba(0, 0, 0, 0.2)',
      borderLeft: isHovered ? `3px solid ${theme.colors.cyberPurple}` : '3px solid transparent',
      cursor: 'pointer',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: '15px',
      fontWeight: 600,
      color: theme.colors.textPrimary,
      lineHeight: 1.5,
    },
    score: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      background: scoreStyle.bg,
      borderRadius: theme.radius.full,
      fontSize: '12px',
      fontWeight: 700,
      color: scoreStyle.color,
      whiteSpace: 'nowrap',
      border: `1px solid ${scoreStyle.border}`,
      fontFamily: theme.fonts.mono,
    },
    meta: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      fontSize: '12px',
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
    },
    source: {
      color: theme.colors.electricCyanLight,
      fontWeight: 600,
    },
    summary: {
      fontSize: '13px',
      color: theme.colors.textSecondary,
      lineHeight: 1.7,
      marginBottom: theme.spacing.md,
    },
    readMore: {
      color: theme.colors.cyberPurpleLight,
      fontWeight: 600,
      marginLeft: '4px',
    },
    tags: {
      display: 'flex',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    tag: {
      fontSize: '10px',
      padding: '4px 10px',
      borderRadius: theme.radius.full,
      background: 'rgba(168, 85, 247, 0.1)',
      color: theme.colors.cyberPurpleLight,
      fontWeight: 600,
      border: `1px solid ${theme.colors.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  const handleClick = (event) => {
    event.preventDefault();
    onViewDetail(item);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      style={cardStyles.container}
      onClick={handleClick}
      onKeyDown={(event) => event.key === 'Enter' && handleClick(event)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={cardStyles.header}>
        <div style={cardStyles.title}>{item.title}</div>
        <div style={cardStyles.score}>
          <span style={{ filter: 'brightness(1.5)' }}>*</span>
          <span>{item.score}</span>
        </div>
      </div>
      <div style={cardStyles.meta}>
        <span style={cardStyles.source}>{item.source?.name || t('newsUnknownSource')}</span>
        <span style={{ color: theme.colors.cyberPurple }}>|</span>
        <span>{formatNewsTime(item.publishedAt)}</span>
      </div>
      {item.summary && (
        <div style={cardStyles.summary}>
          {displaySummary}
          {summaryTooLong && <span style={cardStyles.readMore}>{t('newsReadMore')}</span>}
        </div>
      )}
      {item.tags?.length > 0 && (
        <div style={cardStyles.tags}>
          {item.tags.map((tag) => (
            <span key={tag} style={cardStyles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsCard;
