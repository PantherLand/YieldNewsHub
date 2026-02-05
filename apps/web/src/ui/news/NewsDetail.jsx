import React, { useState } from 'react';
import { useLanguage } from '../../i18n/index.js';
import { theme } from '../../styles/index.js';
import { formatNewsTime } from './formatNewsTime.js';

export function NewsDetail({ item, onBack }) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: 'rgba(0, 255, 136, 0.1)', color: theme.colors.neonGreen, border: 'rgba(0, 255, 136, 0.3)' };
    if (score >= 5) return { bg: 'rgba(255, 136, 0, 0.1)', color: theme.colors.neonOrange, border: 'rgba(255, 136, 0, 0.3)' };
    return { bg: 'rgba(100, 116, 139, 0.1)', color: theme.colors.textMuted, border: 'rgba(100, 116, 139, 0.2)' };
  };

  const scoreStyle = getScoreColor(item.score);

  const detailStyles = {
    container: {
      padding: theme.spacing.lg,
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.lg,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: '10px 16px',
      marginBottom: theme.spacing.lg,
      background: 'transparent',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md,
      color: theme.colors.textSecondary,
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: theme.transition.normal,
    },
    backButtonHover: {
      background: theme.colors.bgCardHover,
      borderColor: theme.colors.cyberPurple,
      color: theme.colors.cyberPurpleLight,
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: '20px',
      fontWeight: 700,
      color: theme.colors.textPrimary,
      lineHeight: 1.4,
      marginBottom: theme.spacing.md,
    },
    meta: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    source: {
      color: theme.colors.electricCyanLight,
      fontWeight: 600,
      fontSize: '14px',
    },
    time: {
      color: theme.colors.textMuted,
      fontSize: '13px',
    },
    score: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      background: scoreStyle.bg,
      borderRadius: theme.radius.full,
      fontSize: '12px',
      fontWeight: 700,
      color: scoreStyle.color,
      border: `1px solid ${scoreStyle.border}`,
      fontFamily: theme.fonts.mono,
    },
    content: {
      fontSize: '15px',
      color: theme.colors.textSecondary,
      lineHeight: 1.8,
      marginBottom: theme.spacing.lg,
      whiteSpace: 'pre-wrap',
    },
    tags: {
      display: 'flex',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
      marginBottom: theme.spacing.lg,
    },
    tag: {
      fontSize: '11px',
      padding: '6px 12px',
      borderRadius: theme.radius.full,
      background: 'rgba(168, 85, 247, 0.1)',
      color: theme.colors.cyberPurpleLight,
      fontWeight: 600,
      border: `1px solid ${theme.colors.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    originalLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: '12px 20px',
      background: theme.colors.gradientPrimary,
      border: 'none',
      borderRadius: theme.radius.md,
      color: '#fff',
      fontSize: '13px',
      fontWeight: 700,
      textDecoration: 'none',
      cursor: 'pointer',
      transition: theme.transition.normal,
    },
  };

  return (
    <div>
      <button
        type="button"
        style={{
          ...detailStyles.backButton,
          ...(isHovered ? detailStyles.backButtonHover : {}),
        }}
        onClick={onBack}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span style={{ fontFamily: theme.fonts.mono }}>&lt;-</span>
        {t('newsBackToList')}
      </button>

      <div style={detailStyles.container}>
        <div style={detailStyles.header}>
          <h2 style={detailStyles.title}>{item.title}</h2>
          <div style={detailStyles.meta}>
            <span style={detailStyles.source}>{item.source?.name || t('newsUnknownSource')}</span>
            <span style={{ color: theme.colors.cyberPurple }}>|</span>
            <span style={detailStyles.time}>{formatNewsTime(item.publishedAt)}</span>
            <div style={detailStyles.score}>
              <span style={{ filter: 'brightness(1.5)' }}>*</span>
              <span>{item.score}</span>
            </div>
          </div>
        </div>

        {item.tags?.length > 0 && (
          <div style={detailStyles.tags}>
            {item.tags.map((tag) => (
              <span key={tag} style={detailStyles.tag}>{tag}</span>
            ))}
          </div>
        )}

        {item.summary && (
          <div style={detailStyles.content}>{item.summary}</div>
        )}

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            style={detailStyles.originalLink}
          >
            {t('newsViewOriginal')}
            <span style={{ fontFamily: theme.fonts.mono }}>-&gt;</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default NewsDetail;
