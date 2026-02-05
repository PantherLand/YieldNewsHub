// ============================================
// YIELDNEWSHUB CYBERPUNK DESIGN SYSTEM
// Brand Guide v1.0 - Cyberpunk Finance Theme
// ============================================

export const theme = {
  colors: {
    // Primary Colors (Cyberpunk Signature)
    cyberPurple: '#A855F7',
    cyberPurpleLight: '#C084FC',
    cyberPurpleDark: '#7C3AED',
    electricCyan: '#06B6D4',
    electricCyanLight: '#22D3EE',
    neonPink: '#FF007A',
    neonPinkLight: '#FF3399',

    // Background Colors (Deep & Dark)
    bgDeep: '#050508',
    bgDark: '#0D0A1A',
    bgCard: '#12101F',
    bgCardHover: '#1A1730',
    bgInput: '#0F0D1A',

    // Semantic Colors (Neon)
    neonGreen: '#00FF88',
    neonGreenMuted: '#10B981',
    neonOrange: '#FF8800',
    neonRed: '#FF3366',

    // Text Colors
    textPrimary: '#F8FAFC',
    textSecondary: '#A0AEC0',
    textMuted: '#64748B',

    // Border Colors
    border: 'rgba(168, 85, 247, 0.2)',
    borderHover: 'rgba(168, 85, 247, 0.5)',
    borderCyan: 'rgba(6, 182, 212, 0.4)',
    borderPink: 'rgba(255, 0, 122, 0.3)',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #06B6D4 100%)',
    gradientPink: 'linear-gradient(135deg, #FF007A 0%, #A855F7 100%)',
    gradientCyan: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
    gradientDark: 'linear-gradient(180deg, #050508 0%, #0D0A1A 50%, #12101F 100%)',
    gradientGlow: 'radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.15) 0%, rgba(6, 182, 212, 0.08) 40%, transparent 70%)',
    gradientCard: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',

    // Glow Effects
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.1)',
    glowCyan: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.1)',
    glowPink: '0 0 20px rgba(255, 0, 122, 0.4)',
    glowGreen: '0 0 15px rgba(0, 255, 136, 0.4)',
  },

  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace",
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  transition: {
    fast: 'all 0.15s ease-out',
    normal: 'all 0.25s ease-out',
    slow: 'all 0.4s ease-out',
  },
};

export default theme;
