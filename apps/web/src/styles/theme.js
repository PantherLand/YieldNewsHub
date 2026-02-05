// ============================================
// YIELDNEWSHUB CYBERPUNK DESIGN SYSTEM
// Brand Guide v2.0 - Monochrome + Neon Purple
// ============================================

export const theme = {
  colors: {
    // Primary Accent (Cyberpunk Signature - Neon Purple)
    accent: '#A855F7',
    accentLight: '#C084FC',
    accentDark: '#7C3AED',
    accentMuted: 'rgba(168, 85, 247, 0.6)',

    // Secondary Accent (Electric Violet)
    secondary: '#8B5CF6',
    secondaryLight: '#A78BFA',
    secondaryDark: '#6D28D9',

    // Background Colors (Monochrome - Pure Dark)
    bgDeep: '#000000',
    bgDark: '#0A0A0A',
    bgCard: '#111111',
    bgCardHover: '#1A1A1A',
    bgInput: '#0D0D0D',
    bgSurface: '#141414',
    bgElevated: '#1C1C1C',

    // Gray Scale (Neutral)
    gray50: '#FAFAFA',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray400: '#A1A1AA',
    gray500: '#71717A',
    gray600: '#52525B',
    gray700: '#3F3F46',
    gray800: '#27272A',
    gray900: '#18181B',

    // Semantic Colors (Muted + Neon Accent)
    success: '#22C55E',
    successMuted: 'rgba(34, 197, 94, 0.15)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorMuted: 'rgba(239, 68, 68, 0.15)',
    info: '#A855F7',
    infoMuted: 'rgba(168, 85, 247, 0.15)',

    // Text Colors (High Contrast)
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textDisabled: '#52525B',
    textAccent: '#A855F7',

    // Border Colors
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.15)',
    borderAccent: 'rgba(168, 85, 247, 0.4)',
    borderAccentStrong: 'rgba(168, 85, 247, 0.8)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #A855F7 0%, #6D28D9 100%)',
    gradientSecondary: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    gradientDark: 'linear-gradient(180deg, #000000 0%, #0A0A0A 50%, #111111 100%)',
    gradientGlow: 'radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
    gradientCard: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
    gradientSurface: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
    gradientShine: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',

    // Glow Effects (Neon Purple)
    glowAccent: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.15), 0 0 60px rgba(168, 85, 247, 0.05)',
    glowAccentSubtle: '0 0 10px rgba(168, 85, 247, 0.25)',
    glowAccentStrong: '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.25)',
    glowSuccess: '0 0 15px rgba(34, 197, 94, 0.4)',
    glowError: '0 0 15px rgba(239, 68, 68, 0.4)',
    glowWhite: '0 0 10px rgba(255, 255, 255, 0.1)',

    // Special Effects
    scanline: 'rgba(168, 85, 247, 0.03)',
    noise: 'rgba(255, 255, 255, 0.02)',
  },

  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace",
    display: "'Space Grotesk', 'Inter', sans-serif",
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  spacing: {
    px: '1px',
    0: '0',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.6)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
    accent: '0 4px 14px rgba(168, 85, 247, 0.25)',
    accentLg: '0 8px 30px rgba(168, 85, 247, 0.35)',
  },

  transition: {
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  zIndex: {
    behind: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    toast: 1600,
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Semantic theme aliases for common patterns
export const semanticTheme = {
  surface: {
    background: theme.colors.bgDeep,
    foreground: theme.colors.textPrimary,
    muted: theme.colors.gray800,
    mutedForeground: theme.colors.textMuted,
    accent: theme.colors.accent,
    accentForeground: theme.colors.textPrimary,
  },

  card: {
    background: theme.colors.bgCard,
    foreground: theme.colors.textPrimary,
    border: theme.colors.border,
    hoverBackground: theme.colors.bgCardHover,
    hoverBorder: theme.colors.borderAccent,
  },

  button: {
    primary: {
      background: theme.colors.gradientPrimary,
      foreground: theme.colors.textPrimary,
      hover: theme.colors.glowAccent,
    },
    secondary: {
      background: theme.colors.gray800,
      foreground: theme.colors.textPrimary,
      hover: theme.colors.gray700,
    },
    ghost: {
      background: 'transparent',
      foreground: theme.colors.textSecondary,
      hover: theme.colors.gray800,
    },
  },

  input: {
    background: theme.colors.bgInput,
    foreground: theme.colors.textPrimary,
    border: theme.colors.border,
    focusBorder: theme.colors.borderAccent,
    placeholder: theme.colors.textMuted,
  },

  table: {
    header: theme.colors.bgSurface,
    row: theme.colors.bgCard,
    rowHover: theme.colors.bgCardHover,
    border: theme.colors.borderSubtle,
  },
};

export default theme;
