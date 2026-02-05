import React from 'react';
import { theme } from '../styles/index.js';
import { useLanguage } from '../i18n/index.js';

export function StatsBar({ apyCount, newsCount }) {
  const { t } = useLanguage();
  const statsStyles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    card: (accent) => ({
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      borderLeft: `3px solid ${accent}`,
    }),
    iconBox: (gradient, glow) => ({
      width: '52px',
      height: '52px',
      borderRadius: theme.radius.md,
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      boxShadow: glow,
      flexShrink: 0,
    }),
    label: {
      fontSize: '12px',
      color: theme.colors.textMuted,
      marginBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 600,
    },
    value: {
      fontSize: '28px',
      fontWeight: 800,
      color: theme.colors.textPrimary,
      fontFamily: theme.fonts.mono,
      letterSpacing: '-1px',
    },
  };

  const stats = [
    {
      label: t('statsYieldOpportunities'),
      value: apyCount,
      icon: '$',
      accent: theme.colors.neonGreen,
      gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
      glow: theme.colors.glowGreen,
    },
    {
      label: t('statsNewsAlerts'),
      value: newsCount,
      icon: '#',
      accent: theme.colors.cyberPurple,
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)',
      glow: theme.colors.glowPurple,
    },
    {
      label: t('statsTracking'),
      value: 'LIVE',
      icon: '>',
      accent: theme.colors.electricCyan,
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%)',
      glow: theme.colors.glowCyan,
    },
  ];

  return (
    <div style={statsStyles.container} className="stats-container">
      {stats.map((stat, idx) => (
        <div key={idx} style={statsStyles.card(stat.accent)} className="stat-card">
          <div style={statsStyles.iconBox(stat.gradient, stat.glow)}>
            {stat.icon}
          </div>
          <div>
            <div style={statsStyles.label}>{stat.label}</div>
            <div style={statsStyles.value}>{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
