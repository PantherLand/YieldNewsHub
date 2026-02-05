import { theme } from './theme.js';

// Common styles with Cyberpunk theme
export const styles = {
  container: {
    fontFamily: theme.fonts.sans,
    minHeight: '100vh',
    background: theme.colors.gradientDark,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },

  // Cyberpunk glow overlay
  glowOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '500px',
    background: theme.colors.gradientGlow,
    pointerEvents: 'none',
    zIndex: 0,
  },

  // Scanline effect
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
      rgba(168, 85, 247, 0.02) 2px,
      rgba(168, 85, 247, 0.02) 4px
    )`,
    pointerEvents: 'none',
    zIndex: 1,
  },

  // Grid pattern
  gridPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
    zIndex: 0,
  },

  content: {
    maxWidth: '1280px',
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
    filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))',
  },

  title: {
    fontSize: '28px',
    fontWeight: 800,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    letterSpacing: '-0.5px',
    textShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
  },

  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: '13px',
    marginTop: '4px',
    letterSpacing: '0.5px',
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
    color: active ? '#fff' : theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    transition: theme.transition.fast,
    boxShadow: active ? theme.colors.glowPurple : 'none',
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
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
  },

  error: {
    padding: theme.spacing.md,
    background: 'rgba(255, 51, 102, 0.1)',
    border: `1px solid ${theme.colors.borderPink}`,
    borderRadius: theme.radius.md,
    color: theme.colors.neonRed,
    marginBottom: theme.spacing.lg,
    boxShadow: '0 0 20px rgba(255, 51, 102, 0.1)',
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
        background: 'rgba(100, 116, 139, 0.15)',
        color: theme.colors.textSecondary,
        border: '1px solid rgba(100, 116, 139, 0.2)',
      },
      primary: {
        background: 'rgba(168, 85, 247, 0.15)',
        color: theme.colors.cyberPurpleLight,
        border: `1px solid ${theme.colors.border}`,
      },
      success: {
        background: 'rgba(0, 255, 136, 0.1)',
        color: theme.colors.neonGreen,
        border: '1px solid rgba(0, 255, 136, 0.2)',
      },
      warning: {
        background: 'rgba(255, 136, 0, 0.1)',
        color: theme.colors.neonOrange,
        border: '1px solid rgba(255, 136, 0, 0.2)',
      },
      pink: {
        background: 'rgba(255, 0, 122, 0.1)',
        color: theme.colors.neonPink,
        border: `1px solid ${theme.colors.borderPink}`,
      },
      cyan: {
        background: 'rgba(6, 182, 212, 0.1)',
        color: theme.colors.electricCyanLight,
        border: `1px solid ${theme.colors.borderCyan}`,
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
};

export default styles;
