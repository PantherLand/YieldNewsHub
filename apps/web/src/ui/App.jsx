import React, { useEffect, useMemo, useState } from 'react';
import { LOGOS, CHAIN_LOGOS, CHAIN_COLORS } from './logos.js';
import CexLinks from './CexLinks.jsx';
import { WalletConnectButton } from '../wallet/WalletConnectButton.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

// ============================================
// YIELDNEWSHUB CYBERPUNK DESIGN SYSTEM
// Brand Guide v1.0 - Cyberpunk Finance Theme
// ============================================

const theme = {
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

// Custom Logo SVG - Cyberpunk Yield Butterfly
function LogoIcon({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Main cyberpunk gradient */}
        <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        {/* Pink accent gradient */}
        <linearGradient id="pinkGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        {/* Cyan wing */}
        <linearGradient id="cyanWing" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        {/* Neon green chart */}
        <linearGradient id="neonChart" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00FF88" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Strong glow */}
        <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#cyberGrad)" />

      {/* Inner dark circle */}
      <circle cx="24" cy="24" r="20" fill="#0D0A1A" opacity="0.6" />

      {/* Left wing */}
      <path
        d="M24 24 C18 17, 6 15, 5 24 C4 33, 16 35, 24 24"
        fill="url(#pinkGrad)"
        opacity="0.9"
        filter="url(#glow)"
      />

      {/* Right wing */}
      <path
        d="M24 24 C30 17, 42 15, 43 24 C44 33, 32 35, 24 24"
        fill="url(#cyanWing)"
        opacity="0.9"
        filter="url(#glow)"
      />

      {/* Body */}
      <ellipse cx="24" cy="24" rx="2" ry="7" fill="#F8FAFC" opacity="0.95" />

      {/* Yield chart line */}
      <path
        d="M10 34 L15 30 L21 32 L27 25 L33 21 L38 13"
        stroke="url(#neonChart)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#strongGlow)"
      />

      {/* Chart end point */}
      <circle cx="38" cy="13" r="3" fill="#00FF88" filter="url(#glow)" />
      <circle cx="38" cy="13" r="1.5" fill="#F8FAFC" />

      {/* Outer ring */}
      <circle cx="24" cy="24" r="22.5" stroke="url(#cyberGrad)" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

// Common styles with Cyberpunk theme
const styles = {
  container: {
    fontFamily: theme.fonts.sans,
    minHeight: '100vh',
    background: theme.colors.gradientDark,
    color: theme.colors.textPrimary,
    padding: theme.spacing.lg,
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

function fmtUsd(x) {
  if (x == null || Number.isNaN(Number(x))) return '-';
  const v = Number(x);
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`;
  return `$${v.toFixed(2)}`;
}

// APY Table Component with Cyberpunk styling
function ApyTable({ data }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  const tableStyles = {
    header: {
      display: 'grid',
      gridTemplateColumns: '1.8fr 0.8fr 0.6fr 0.8fr 0.8fr 1fr',
      padding: '16px 24px',
      background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
      borderBottom: `1px solid ${theme.colors.border}`,
      fontSize: '11px',
      fontWeight: 700,
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    row: (isHovered) => ({
      display: 'grid',
      gridTemplateColumns: '1.8fr 0.8fr 0.6fr 0.8fr 0.8fr 1fr',
      padding: '18px 24px',
      borderBottom: `1px solid ${theme.colors.border}`,
      background: isHovered
        ? `linear-gradient(90deg, ${theme.colors.bgCardHover} 0%, rgba(168, 85, 247, 0.05) 100%)`
        : 'transparent',
      transition: theme.transition.fast,
      cursor: 'default',
      borderLeft: isHovered ? `3px solid ${theme.colors.cyberPurple}` : '3px solid transparent',
    }),
    provider: {
      fontWeight: 600,
      color: theme.colors.textPrimary,
      fontSize: '14px',
    },
    chainBadge: (color) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '10px',
      padding: '3px 8px',
      borderRadius: theme.radius.full,
      background: `${color || theme.colors.cyberPurple}15`,
      color: color || theme.colors.textMuted,
      fontWeight: 600,
      border: `1px solid ${color || theme.colors.cyberPurple}30`,
      marginTop: '4px',
    }),
    symbol: {
      fontFamily: theme.fonts.mono,
      color: theme.colors.electricCyanLight,
      fontWeight: 600,
      fontSize: '13px',
    },
    apy: {
      fontWeight: 700,
      fontSize: '16px',
      color: theme.colors.neonGreen,
      fontFamily: theme.fonts.mono,
      textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
    },
    tvl: {
      fontFamily: theme.fonts.mono,
      color: theme.colors.textSecondary,
      fontSize: '13px',
    },
    action: {
      fontSize: '12px',
    },
  };

  return (
    <div style={styles.card}>
      <div style={tableStyles.header}>
        <div>Protocol</div>
        <div>Chain</div>
        <div>Asset</div>
        <div>APY</div>
        <div>TVL</div>
        <div>Action</div>
      </div>
      {data.length === 0 ? (
        <div style={{
          padding: theme.spacing.xl,
          textAlign: 'center',
          color: theme.colors.textMuted,
          background: theme.colors.gradientCard,
        }}>
          <div style={{ fontSize: '24px', marginBottom: theme.spacing.sm }}>...</div>
          No yield opportunities found
        </div>
      ) : (
        data.map((row, idx) => {
          const chainColor = CHAIN_COLORS[row.chain] || null;
          const logoSrc = (row.logoKey && LOGOS[row.logoKey]) || row.logoUrl;
          const chainLogoSrc = row.chainLogoUrl || (row.chainLogoKey && CHAIN_LOGOS[row.chainLogoKey?.toLowerCase()]);

          return (
            <div
              key={row.id}
              style={tableStyles.row(hoveredRow === idx)}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Protocol */}
              <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={row.platformName || row.provider}
                    width={32}
                    height={32}
                    style={{
                      borderRadius: theme.radius.sm,
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.bgInput,
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: theme.radius.sm,
                    background: theme.colors.gradientPrimary,
                    opacity: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {(row.platformName || row.provider || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={tableStyles.provider}>
                    {row.platformName || row.provider}
                  </div>
                </div>
              </div>

              {/* Chain */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={tableStyles.chainBadge(chainColor)}>
                  {chainLogoSrc && (
                    <img
                      src={chainLogoSrc}
                      alt={row.chainName || row.chain}
                      width={12}
                      height={12}
                      style={{ borderRadius: '50%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  {row.chainName || row.chain || '...'}
                </div>
              </div>

              {/* Asset */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={tableStyles.symbol}>{row.symbol}</div>
              </div>

              {/* APY */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={tableStyles.apy}>
                  {row.apy == null ? '...' : `${Number(row.apy).toFixed(2)}%`}
                </div>
              </div>

              {/* TVL */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={tableStyles.tvl}>{fmtUsd(row.tvlUsd)}</div>
              </div>

              {/* Action */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <a
                  href={row.platformUrl || row.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: theme.radius.md,
                    background: theme.colors.gradientPrimary,
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: theme.transition.fast,
                    boxShadow: hoveredRow === idx ? theme.colors.glowPurple : 'none',
                  }}
                >
                  Deposit
                  <span style={{ fontSize: '10px' }}>&rarr;</span>
                </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// News Card Component with Cyberpunk styling
function NewsCard({ item }) {
  const [isHovered, setIsHovered] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: 'rgba(0, 255, 136, 0.1)', color: theme.colors.neonGreen, border: 'rgba(0, 255, 136, 0.3)' };
    if (score >= 5) return { bg: 'rgba(255, 136, 0, 0.1)', color: theme.colors.neonOrange, border: 'rgba(255, 136, 0, 0.3)' };
    return { bg: 'rgba(100, 116, 139, 0.1)', color: theme.colors.textMuted, border: 'rgba(100, 116, 139, 0.2)' };
  };

  const scoreStyle = getScoreColor(item.score);

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

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      style={cardStyles.container}
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
        <span style={cardStyles.source}>{item.source?.name || 'Unknown'}</span>
        <span style={{ color: theme.colors.cyberPurple }}>|</span>
        <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '...'}</span>
      </div>
      {item.summary && <div style={cardStyles.summary}>{item.summary}</div>}
      {item.tags?.length > 0 && (
        <div style={cardStyles.tags}>
          {item.tags.map(t => (
            <span key={t} style={cardStyles.tag}>{t}</span>
          ))}
        </div>
      )}
    </a>
  );
}

// News List Component
function NewsList({ data, minScore, setMinScore }) {
  const filterStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      background: theme.colors.bgCard,
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
      backdropFilter: 'blur(12px)',
    },
    label: {
      color: theme.colors.textSecondary,
      fontSize: '13px',
      fontWeight: 600,
    },
    input: {
      width: '70px',
      padding: '10px 12px',
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
  };

  return (
    <div>
      <div style={filterStyles.container}>
        <span style={filterStyles.label}>Min Score:</span>
        <input
          type="number"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          style={filterStyles.input}
          min={1}
          max={10}
        />
        <span style={filterStyles.hint}>1 = all | 10 = critical only</span>
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
            No news matching criteria
          </div>
        ) : (
          data.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

// Settings Component with Cyberpunk styling
function Settings({ apiBase }) {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const settingsStyles = {
    container: {
      ...styles.card,
      padding: theme.spacing.lg,
      background: `linear-gradient(135deg, ${theme.colors.bgCard} 0%, rgba(168, 85, 247, 0.03) 100%)`,
    },
    title: {
      fontSize: '20px',
      fontWeight: 700,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.lg,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    icon: {
      width: '40px',
      height: '40px',
      borderRadius: theme.radius.md,
      background: theme.colors.gradientCyan,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      boxShadow: theme.colors.glowCyan,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      color: theme.colors.textSecondary,
      fontSize: '14px',
      cursor: 'pointer',
      marginBottom: theme.spacing.md,
    },
    checkbox: {
      width: '20px',
      height: '20px',
      accentColor: theme.colors.cyberPurple,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing.lg,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: '11px',
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.bgInput,
      color: theme.colors.textPrimary,
      fontSize: '14px',
      fontFamily: theme.fonts.mono,
      outline: 'none',
      transition: theme.transition.fast,
      boxSizing: 'border-box',
    },
    actions: {
      display: 'flex',
      gap: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    primaryButton: {
      padding: '14px 28px',
      borderRadius: theme.radius.md,
      border: 'none',
      background: theme.colors.gradientPrimary,
      color: '#fff',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: theme.transition.fast,
      boxShadow: theme.colors.glowPurple,
      letterSpacing: '0.5px',
    },
    secondaryButton: {
      padding: '14px 28px',
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.borderCyan}`,
      background: 'transparent',
      color: theme.colors.electricCyanLight,
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: theme.transition.fast,
    },
    message: (isError) => ({
      fontSize: '13px',
      color: isError ? theme.colors.neonRed : theme.colors.neonGreen,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      fontFamily: theme.fonts.mono,
    }),
    note: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.md,
      background: 'rgba(255, 136, 0, 0.08)',
      borderRadius: theme.radius.md,
      border: '1px solid rgba(255, 136, 0, 0.2)',
      fontSize: '12px',
      color: theme.colors.neonOrange,
    },
  };

  async function save() {
    setLoading(true);
    setMsg('');
    try {
      const r = await fetch(`${apiBase}/api/integrations/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, botToken, chatId }),
      });
      const j = await r.json();
      // Support both old format (j.ok) and new format (j.success)
      const isSuccess = j.success || j.ok;
      if (isSuccess) {
        setMsg('> Settings saved successfully');
      } else {
        setMsg(`[ ERROR ] ${j.error?.message || JSON.stringify(j.error || j)}`);
      }
    } catch (e) {
      setMsg(`[ ERROR ] ${e.message}`);
    }
    setLoading(false);
  }

  async function test() {
    setLoading(true);
    setMsg('');
    try {
      const r = await fetch(`${apiBase}/api/integrations/telegram/test`, { method: 'POST' });
      const j = await r.json();
      // Support both old format (j.ok) and new format (j.success)
      const isSuccess = j.success || j.ok;
      if (isSuccess) {
        setMsg('> Test message sent!');
      } else {
        setMsg(`[ ERROR ] ${j.error?.message || JSON.stringify(j.error || j)}`);
      }
    } catch (e) {
      setMsg(`[ ERROR ] ${e.message}`);
    }
    setLoading(false);
  }

  return (
    <div style={settingsStyles.container}>
      <div style={settingsStyles.title}>
        <div style={settingsStyles.icon}>T</div>
        <span>Telegram Integration</span>
      </div>

      <div style={settingsStyles.section}>
        <label style={settingsStyles.label}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={settingsStyles.checkbox}
          />
          Enable Telegram notifications for high-priority news
        </label>
      </div>

      <div style={settingsStyles.grid}>
        <div style={settingsStyles.inputGroup}>
          <div style={settingsStyles.inputLabel}>Bot Token</div>
          <input
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder="123456:ABC-DEF..."
            style={settingsStyles.input}
          />
        </div>
        <div style={settingsStyles.inputGroup}>
          <div style={settingsStyles.inputLabel}>Chat ID</div>
          <input
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="-100123456789"
            style={settingsStyles.input}
          />
        </div>
      </div>

      <div style={settingsStyles.actions}>
        <button onClick={save} disabled={loading} style={settingsStyles.primaryButton}>
          {loading ? 'Processing...' : 'Save Config'}
        </button>
        <button onClick={test} disabled={loading} style={settingsStyles.secondaryButton}>
          Test Connection
        </button>
        {msg && (
          <div style={settingsStyles.message(msg.includes('ERROR'))}>
            {msg}
          </div>
        )}
      </div>

      <div style={settingsStyles.note}>
        <strong>[ ! ]</strong> MVP mode: Credentials stored in database. Implement proper secret management for production.
      </div>
    </div>
  );
}

// Stats Bar Component with Cyberpunk styling
function StatsBar({ apyCount, newsCount }) {
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
      label: 'Yield Opportunities',
      value: apyCount,
      icon: '$',
      accent: theme.colors.neonGreen,
      gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
      glow: theme.colors.glowGreen,
    },
    {
      label: 'News Articles',
      value: newsCount,
      icon: '#',
      accent: theme.colors.cyberPurple,
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)',
      glow: theme.colors.glowPurple,
    },
    {
      label: 'Data Feed',
      value: 'LIVE',
      icon: '>',
      accent: theme.colors.electricCyan,
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%)',
      glow: theme.colors.glowCyan,
    },
  ];

  return (
    <div style={statsStyles.container}>
      {stats.map((stat, idx) => (
        <div key={idx} style={statsStyles.card(stat.accent)}>
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

// Main App Component
function App() {
  const [tab, setTab] = useState('apy');
  const [apy, setApy] = useState([]);
  const [news, setNews] = useState([]);
  const [cexLinks, setCexLinks] = useState([]);
  const [minScore, setMinScore] = useState(6);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  // Default to 'dex' filter for DeFi stablecoin yields
  const [apyFilter, setApyFilter] = useState('dex');
  // TVL and APY filters
  const [minTvl, setMinTvl] = useState(1); // in millions
  const [minApy, setMinApy] = useState(3); // in percentage

  const tabs = useMemo(() => [
    { id: 'apy', name: 'Yields', icon: '$' },
    { id: 'cex', name: 'CEX Links', icon: 'C' },
    { id: 'news', name: 'News', icon: '#' },
    { id: 'settings', name: 'Config', icon: '>' },
  ], []);

  async function loadApy() {
    const r = await fetch(`${API_BASE}/api/apy?limit=50`);
    const j = await r.json();
    // Support both old format (j.items) and new format (j.data.items)
    setApy(j.data?.items || j.items || []);
  }

  async function loadNews() {
    const r = await fetch(`${API_BASE}/api/news?limit=80&minScore=${minScore}`);
    const j = await r.json();
    // Support both old format (j.items) and new format (j.data.items)
    setNews(j.data?.items || j.items || []);
  }

  async function loadCexLinks() {
    const r = await fetch(`${API_BASE}/api/cex-links`);
    const j = await r.json();
    setCexLinks(j.data?.items || j.items || []);
  }

  async function refreshData() {
    setLoading(true);
    try {
      setErr('');
      await Promise.all([loadApy(), loadNews(), loadCexLinks()]);
    } catch (e) {
      setErr(String(e?.message || e));
    }
    setLoading(false);
  }

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredApy = useMemo(() => {
    let result = apy;

    // Apply type filter
    if (apyFilter === 'cex') {
      result = result.filter((x) => String(x.chain || '').toLowerCase() === 'cefi');
    } else if (apyFilter === 'dex') {
      result = result.filter((x) => String(x.chain || '').toLowerCase() !== 'cefi');
    }

    // Apply TVL filter (minTvl is in millions)
    if (minTvl > 0) {
      result = result.filter((x) => (x.tvlUsd || 0) >= minTvl * 1_000_000);
    }

    // Apply APY filter
    if (minApy > 0) {
      result = result.filter((x) => (x.apy || 0) >= minApy);
    }

    return result;
  }, [apy, apyFilter, minTvl, minApy]);

  useEffect(() => {
    if (tab === 'news') loadNews().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minScore, tab]);

  return (
    <div style={styles.container}>
      {/* Cyberpunk background effects */}
      <div style={styles.gridPattern} />
      <div style={styles.glowOverlay} />
      <div style={styles.scanlines} />

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <LogoIcon size={52} />
            </div>
            <div>
              <h1 style={styles.title}>YieldNewsHub</h1>
              <div style={styles.subtitle}>// Low-risk stablecoin yields & market intelligence</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            <div style={styles.nav}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={styles.navButton(tab === t.id)}
                >
                  <span style={{
                    marginRight: '6px',
                    opacity: 0.7,
                    fontFamily: theme.fonts.mono,
                  }}>{t.icon}</span>
                  {t.name}
                </button>
              ))}
            </div>

            <button
              onClick={refreshData}
              disabled={loading}
              style={{
                ...styles.refreshButton,
                opacity: loading ? 0.6 : 1,
                borderColor: loading ? theme.colors.borderCyan : theme.colors.border,
              }}
            >
              <span style={{
                display: 'inline-block',
                animation: loading ? 'spin 1s linear infinite' : 'none',
                fontFamily: theme.fonts.mono,
              }}>@</span>
              {loading ? 'Syncing...' : 'Refresh'}
            </button>

            <WalletConnectButton />
          </div>
        </div>

        {/* Stats */}
        {tab !== 'settings' && (
          <StatsBar apyCount={apy.length} newsCount={news.length} />
        )}

        {/* Error */}
        {err && <div style={styles.error}>[ ERROR ] {err}</div>}

        {/* Content */}
        {tab === 'apy' && (
          <div style={{ display: 'grid', gap: theme.spacing.lg }}>
            {/* Filter Bar */}
            <div style={{
              display: 'flex',
              gap: theme.spacing.lg,
              flexWrap: 'wrap',
              alignItems: 'center',
              padding: theme.spacing.md,
              background: theme.colors.bgCard,
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
            }}>
              {/* Type Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <span style={{
                  color: theme.colors.textMuted,
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>Type:</span>
                {[
                  { id: 'all', label: 'ALL' },
                  { id: 'dex', label: 'DEX' },
                  { id: 'cex', label: 'CEX' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setApyFilter(f.id)}
                    style={styles.badge(apyFilter === f.id ? 'cyan' : 'default')}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* TVL Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <span style={{
                  color: theme.colors.textMuted,
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>Min TVL:</span>
                <input
                  type="number"
                  value={minTvl}
                  onChange={(e) => setMinTvl(Math.max(0, Number(e.target.value)))}
                  style={{
                    width: '70px',
                    padding: '8px 10px',
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.bgInput,
                    color: theme.colors.neonGreen,
                    fontSize: '13px',
                    fontFamily: theme.fonts.mono,
                    fontWeight: 600,
                    outline: 'none',
                    textAlign: 'center',
                  }}
                  min={0}
                  step={1}
                />
                <span style={{
                  color: theme.colors.textMuted,
                  fontSize: '11px',
                }}>M</span>
              </div>

              {/* APY Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <span style={{
                  color: theme.colors.textMuted,
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>Min APY:</span>
                <input
                  type="number"
                  value={minApy}
                  onChange={(e) => setMinApy(Math.max(0, Number(e.target.value)))}
                  style={{
                    width: '70px',
                    padding: '8px 10px',
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.bgInput,
                    color: theme.colors.neonGreen,
                    fontSize: '13px',
                    fontFamily: theme.fonts.mono,
                    fontWeight: 600,
                    outline: 'none',
                    textAlign: 'center',
                  }}
                  min={0}
                  step={0.5}
                />
                <span style={{
                  color: theme.colors.textMuted,
                  fontSize: '11px',
                }}>%</span>
              </div>

              {/* Results count */}
              <div style={{
                marginLeft: 'auto',
                color: theme.colors.textMuted,
                fontSize: '12px',
              }}>
                <span style={{ color: theme.colors.electricCyanLight, fontWeight: 600 }}>{filteredApy.length}</span> pools
              </div>
            </div>
            <ApyTable data={filteredApy} />
          </div>
        )}
        {tab === 'cex' && <CexLinks items={cexLinks} />}
        {tab === 'news' && <NewsList data={news} minScore={minScore} setMinScore={setMinScore} />}
        {tab === 'settings' && <Settings apiBase={API_BASE} />}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <span style={{
              color: theme.colors.neonGreen,
              textShadow: `0 0 10px ${theme.colors.neonGreen}`,
              fontFamily: theme.fonts.mono,
            }}>*</span>
            <span>Connected:</span>
            <code style={{
              fontFamily: theme.fonts.mono,
              background: theme.colors.bgCard,
              padding: '4px 10px',
              borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.electricCyanLight,
              fontSize: '11px',
            }}>{API_BASE}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            <span style={{ fontFamily: theme.fonts.mono }}>// Built for DeFi</span>
            <span style={styles.badge('pink')}>v1.0</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(6, 182, 212, 0.2); }
        }

        @keyframes scanlineMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: ${theme.colors.bgDeep};
        }

        /* Custom selection */
        ::selection {
          background: rgba(168, 85, 247, 0.3);
          color: ${theme.colors.textPrimary};
        }

        input:focus {
          border-color: ${theme.colors.borderHover} !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15), ${theme.colors.glowPurple};
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: ${theme.colors.glowPurple};
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.colors.bgDark};
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, ${theme.colors.cyberPurple} 0%, ${theme.colors.electricCyan} 100%);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.cyberPurpleLight};
        }

        /* Number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default App;
