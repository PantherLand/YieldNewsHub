import { theme } from './theme.js';

// Common styles with Monochrome + Neon Purple Cyberpunk theme
export const styles = {
  container: {
    fontFamily: theme.fonts.sans,
    minHeight: '100vh',
    background: theme.colors.bgDeep,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },

  // Subtle glow overlay
  glowOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '600px',
    background: theme.colors.gradientGlow,
    pointerEvents: 'none',
    zIndex: 0,
  },

  // Subtle scanline effect
  scanlines: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      ${theme.colors.scanline} 2px,
      ${theme.colors.scanline} 4px
    )`,
    pointerEvents: 'none',
    zIndex: 1,
    opacity: 0.5,
  },

  // Grid pattern
  gridPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(${theme.colors.border} 1px, transparent 1px),
      linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.3,
  },

  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  logoButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    color: 'inherit',
    cursor: 'pointer',
    textAlign: 'left',
  },

  logoIcon: {
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: `drop-shadow(0 0 12px ${theme.colors.accentMuted})`,
  },

  title: {
    fontSize: '28px',
    fontWeight: 700,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: '-0.5px',
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontSize: '13px',
    marginTop: '4px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },

  nav: {
    display: 'flex',
    gap: theme.spacing.xs,
    background: theme.colors.bgCard,
    padding: '6px',
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.border}`,
    backdropFilter: 'blur(12px)',
  },

  navButton: (active) => ({
    padding: '10px 20px',
    borderRadius: theme.radius.md,
    border: 'none',
    background: active ? theme.colors.gradientPrimary : 'transparent',
    color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    transition: theme.transition.fast,
    boxShadow: active ? theme.colors.glowAccentSubtle : 'none',
    letterSpacing: '0.3px',
  }),

  refreshButton: {
    padding: '10px 18px',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.bgCard,
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: theme.transition.fast,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backdropFilter: 'blur(12px)',
  },

  card: {
    background: theme.colors.bgCard,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    backdropFilter: 'blur(16px)',
    overflow: 'hidden',
    boxShadow: theme.shadows.lg,
  },

  cardHover: {
    background: theme.colors.bgCardHover,
    borderColor: theme.colors.borderAccent,
    boxShadow: `${theme.shadows.lg}, ${theme.colors.glowAccentSubtle}`,
  },

  error: {
    padding: theme.spacing.md,
    background: theme.colors.errorMuted,
    border: `1px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: theme.radius.md,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
  },

  footer: {
    marginTop: theme.spacing.xxl,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.colors.textMuted,
    fontSize: '12px',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },

  badge: (variant = 'default') => {
    const variants = {
      default: {
        background: theme.colors.gray800,
        color: theme.colors.textSecondary,
        border: `1px solid ${theme.colors.border}`,
      },
      primary: {
        background: 'rgba(168, 85, 247, 0.15)',
        color: theme.colors.accentLight,
        border: `1px solid ${theme.colors.borderAccent}`,
      },
      success: {
        background: theme.colors.successMuted,
        color: theme.colors.success,
        border: '1px solid rgba(34, 197, 94, 0.3)',
      },
      warning: {
        background: theme.colors.warningMuted,
        color: theme.colors.warning,
        border: '1px solid rgba(245, 158, 11, 0.3)',
      },
      error: {
        background: theme.colors.errorMuted,
        color: theme.colors.error,
        border: '1px solid rgba(239, 68, 68, 0.3)',
      },
      accent: {
        background: theme.colors.infoMuted,
        color: theme.colors.accent,
        border: `1px solid ${theme.colors.borderAccent}`,
      },
    };
    return {
      fontSize: '11px',
      padding: '5px 12px',
      borderRadius: theme.radius.full,
      fontWeight: 600,
      cursor: 'pointer',
      transition: theme.transition.fast,
      ...variants[variant],
    };
  },

  // Button variants
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 600,
      borderRadius: theme.radius.md,
      border: 'none',
      cursor: 'pointer',
      transition: theme.transition.fast,
    },
    primary: {
      background: theme.colors.gradientPrimary,
      color: theme.colors.textPrimary,
      boxShadow: theme.shadows.accent,
    },
    secondary: {
      background: theme.colors.gray800,
      color: theme.colors.textPrimary,
      border: `1px solid ${theme.colors.border}`,
    },
    ghost: {
      background: 'transparent',
      color: theme.colors.textSecondary,
    },
    outline: {
      background: 'transparent',
      color: theme.colors.accent,
      border: `1px solid ${theme.colors.borderAccent}`,
    },
  },

  // Input styles
  input: {
    base: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      background: theme.colors.bgInput,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md,
      color: theme.colors.textPrimary,
      transition: theme.transition.fast,
      outline: 'none',
    },
    focus: {
      borderColor: theme.colors.borderAccent,
      boxShadow: `0 0 0 3px ${theme.colors.infoMuted}`,
    },
  },

  // Table styles
  table: {
    container: {
      width: '100%',
      overflowX: 'auto',
    },
    base: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    header: {
      background: theme.colors.bgSurface,
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    headerCell: {
      padding: '14px 16px',
      fontSize: '12px',
      fontWeight: 600,
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      textAlign: 'left',
    },
    row: {
      borderBottom: `1px solid ${theme.colors.borderSubtle}`,
      transition: theme.transition.fast,
    },
    rowHover: {
      background: theme.colors.bgCardHover,
    },
    cell: {
      padding: '16px',
      fontSize: '14px',
      color: theme.colors.textPrimary,
    },
  },

  // Stat card
  statCard: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.xs,
      padding: theme.spacing.lg,
      background: theme.colors.bgCard,
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.border}`,
    },
    label: {
      fontSize: '12px',
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    value: {
      fontSize: '28px',
      fontWeight: 700,
      color: theme.colors.textPrimary,
    },
    valueAccent: {
      fontSize: '28px',
      fontWeight: 700,
      color: theme.colors.accent,
    },
    change: (positive) => ({
      fontSize: '13px',
      color: positive ? theme.colors.success : theme.colors.error,
    }),
  },

  // Skeleton loading
  skeleton: {
    base: {
      background: `linear-gradient(90deg, ${theme.colors.gray800} 0%, ${theme.colors.gray700} 50%, ${theme.colors.gray800} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: theme.radius.md,
    },
  },

  // Divider
  divider: {
    width: '100%',
    height: '1px',
    background: theme.colors.border,
    margin: `${theme.spacing.lg} 0`,
  },

  // Link
  link: {
    color: theme.colors.accent,
    textDecoration: 'none',
    transition: theme.transition.fast,
    cursor: 'pointer',
  },

  linkHover: {
    color: theme.colors.accentLight,
    textDecoration: 'underline',
  },
};

export default styles;
