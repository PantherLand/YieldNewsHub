import React, { useEffect, useMemo, useState } from 'react';
import { LOGOS, CHAIN_LOGOS, CHAIN_COLORS, getChainLogo, getChainColor } from './logos.js';
import StrategyPage from './StrategyPage.jsx';
import { WalletConnectButton } from '../wallet/WalletConnectButton.jsx';
import { LanguageToggle } from './LanguageToggle.jsx';
import { useLanguage } from '../i18n/index.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';
const STRATEGY_ENDPOINTS = [
  '/api/strategy/base-apy-priority',
  '/api/strategy/conservative-core',
  '/api/strategy/liquidity-bluechip',
  '/api/strategy/reward-balanced',
  '/api/strategy/opportunistic-guarded',
];
const TAB_ROUTE_MAP = {
  apy: '/apy',
  strategy: '/strategy',
  news: '/news',
  settings: '/settings',
};

function getTabFromPath(pathname = '') {
  const normalizedPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (normalizedPath === '/strategy' || normalizedPath.startsWith('/strategy/')) return 'strategy';
  if (normalizedPath === '/news' || normalizedPath.startsWith('/news/')) return 'news';
  if (normalizedPath === '/settings' || normalizedPath.startsWith('/settings/')) return 'settings';
  if (normalizedPath === '/apy' || normalizedPath.startsWith('/apy/')) return 'apy';
  return 'apy';
}

function getRouteFromTab(tabId) {
  return TAB_ROUTE_MAP[tabId] || TAB_ROUTE_MAP.apy;
}

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

function buildNewsSignature(items = []) {
  return (items || [])
    .slice(0, 20)
    .map((item) => `${item.id || item.url || ''}|${item.publishedAt || ''}|${item.score || ''}`)
    .join('||');
}

function buildProtocolLogoCandidates(row = {}) {
  const candidates = [];
  const push = (url) => {
    if (!url || typeof url !== 'string') return;
    if (!candidates.includes(url)) candidates.push(url);
  };

  if (row.logoKey && LOGOS[row.logoKey]) push(LOGOS[row.logoKey]);
  if (row.logoUrl) push(row.logoUrl);

  const providerRaw = String(row.provider || '').toLowerCase().trim();
  const platformKey = String(row.platformKey || '').toLowerCase().trim();
  const slugs = new Set();
  if (providerRaw) slugs.add(providerRaw.replace(/[^a-z0-9-]/g, ''));
  if (platformKey) slugs.add(platformKey.replace(/[^a-z0-9-]/g, ''));

  for (const slug of Array.from(slugs)) {
    if (!slug) continue;
    push(`https://icons.llama.fi/${slug}.jpg`);
    push(`https://icons.llama.fi/${slug}.png`);
    const withoutVersion = slug.replace(/-v\d+$/g, '');
    if (withoutVersion && withoutVersion !== slug) {
      push(`https://icons.llama.fi/${withoutVersion}.jpg`);
      push(`https://icons.llama.fi/${withoutVersion}.png`);
    }
  }

  return candidates;
}

function ProtocolLogo({ row }) {
  const candidates = useMemo(() => buildProtocolLogoCandidates(row), [row]);
  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    setLogoIndex(0);
  }, [candidates.join('|')]);

  if (logoIndex >= candidates.length) {
    return (
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
        flexShrink: 0,
      }}>
        {(row.platformName || row.provider || '?').charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={candidates[logoIndex]}
      alt={row.platformName || row.provider}
      width={32}
      height={32}
      style={{
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.bgInput,
        flexShrink: 0,
      }}
      onError={() => {
        setLogoIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : candidates.length));
      }}
    />
  );
}

function ChainLogo({ src, label }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        lineHeight: 1,
        background: 'rgba(100, 116, 139, 0.2)',
        color: theme.colors.textMuted,
        border: `1px solid ${theme.colors.border}`,
      }}>
        {(label || '?').charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={label}
      width={12}
      height={12}
      style={{ borderRadius: '50%' }}
      onError={() => setFailed(true)}
    />
  );
}

// APY Table Component with Cyberpunk styling - Mobile Responsive
function ApyTable({ data, apySortDirection = 'desc', onToggleApySort }) {
  const { t } = useLanguage();
  const [hoveredRow, setHoveredRow] = useState(null);

  const getProtocolName = (row) => {
    if (row?.platformName) return row.platformName;
    const provider = String(row?.provider || '').trim();
    if (!provider) return 'protocol';
    return provider
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const getActionText = (row) => `Link to ${getProtocolName(row)}`;

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
    // Mobile card layout
    mobileCard: (isHovered) => ({
      padding: '16px',
      borderBottom: `1px solid ${theme.colors.border}`,
      background: isHovered
        ? `linear-gradient(135deg, ${theme.colors.bgCardHover} 0%, rgba(168, 85, 247, 0.05) 100%)`
        : 'transparent',
      transition: theme.transition.fast,
      borderLeft: isHovered ? `3px solid ${theme.colors.cyberPurple}` : '3px solid transparent',
    }),
    mobileCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
      gap: '12px',
    },
    mobileCardBody: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '12px',
    },
    mobileCardStat: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    mobileCardLabel: {
      fontSize: '10px',
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
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

  // Check if mobile using window width (will be handled by CSS media queries for initial render)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile card render
  const renderMobileCard = (row, idx) => {
    const chainColor = getChainColor(row.chain) || row.chainColor || null;
    const chainLogoSrc = row.chainLogoUrl || getChainLogo(row.chain) || (row.chainLogoKey && CHAIN_LOGOS[row.chainLogoKey?.toLowerCase()]);

    return (
      <div
        key={row.id}
        style={tableStyles.mobileCard(hoveredRow === idx)}
        onTouchStart={() => setHoveredRow(idx)}
        onTouchEnd={() => setHoveredRow(null)}
      >
        {/* Header: Protocol + APY */}
        <div style={tableStyles.mobileCardHeader}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <ProtocolLogo row={row} />
            <div style={{ minWidth: 0 }}>
              <div style={{ ...tableStyles.provider, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {row.platformName || row.provider}
              </div>
              <div style={tableStyles.chainBadge(chainColor)}>
                <ChainLogo src={chainLogoSrc} label={row.chainName || row.chain} />
                {row.chainName || row.chain || '...'}
              </div>
            </div>
          </div>
          <div style={{ ...tableStyles.apy, fontSize: '18px', whiteSpace: 'nowrap' }}>
            {row.apy == null ? '...' : `${Number(row.apy).toFixed(2)}%`}
          </div>
        </div>

        {/* Body: Stats */}
        <div style={tableStyles.mobileCardBody}>
          <div style={tableStyles.mobileCardStat}>
            <span style={tableStyles.mobileCardLabel}>Asset</span>
            <span style={tableStyles.symbol}>{row.symbol}</span>
          </div>
          <div style={tableStyles.mobileCardStat}>
            <span style={tableStyles.mobileCardLabel}>TVL</span>
            <span style={tableStyles.tvl}>{fmtUsd(row.tvlUsd)}</span>
          </div>
          <div style={tableStyles.mobileCardStat}>
            <span style={tableStyles.mobileCardLabel}>APY</span>
            <span style={{ ...tableStyles.apy, fontSize: '14px' }}>
              {row.apy == null ? '...' : `${Number(row.apy).toFixed(2)}%`}
            </span>
          </div>
        </div>

        {/* Action */}
        <a
          href={row.platformUrl || row.url || '#'}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 16px',
            borderRadius: theme.radius.md,
            background: theme.colors.gradientPrimary,
            color: '#fff',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            transition: theme.transition.fast,
            width: '100%',
          }}
        >
          {getActionText(row)}
          <span style={{ fontSize: '12px' }}>&rarr;</span>
        </a>
      </div>
    );
  };

  // Desktop row render
  const renderDesktopRow = (row, idx) => {
    const chainColor = getChainColor(row.chain) || row.chainColor || null;
    const chainLogoSrc = row.chainLogoUrl || getChainLogo(row.chain) || (row.chainLogoKey && CHAIN_LOGOS[row.chainLogoKey?.toLowerCase()]);

    return (
      <div
        key={row.id}
        style={tableStyles.row(hoveredRow === idx)}
        onMouseEnter={() => setHoveredRow(idx)}
        onMouseLeave={() => setHoveredRow(null)}
      >
        {/* Protocol */}
        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
          <ProtocolLogo row={row} />
          <div>
            <div style={tableStyles.provider}>
              {row.platformName || row.provider}
            </div>
          </div>
        </div>

        {/* Chain */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={tableStyles.chainBadge(chainColor)}>
            <ChainLogo src={chainLogoSrc} label={row.chainName || row.chain} />
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
            {getActionText(row)}
            <span style={{ fontSize: '10px' }}>&rarr;</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.card}>
      {/* Desktop header - hidden on mobile */}
      {!isMobile && (
        <div style={tableStyles.header} className="desktop-only">
          <div>{t('tableProtocol')}</div>
          <div>{t('tableChain')}</div>
          <div>{t('tableAsset')}</div>
          <div>
            <button
              type="button"
              onClick={() => onToggleApySort && onToggleApySort()}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                color: theme.colors.textMuted,
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{t('tableApy')}</span>
              <span>{apySortDirection === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>
          <div>{t('tableTvl')}</div>
          <div>{t('tableAction')}</div>
        </div>
      )}
      {data.length === 0 ? (
        <div style={{
          padding: theme.spacing.xl,
          textAlign: 'center',
          color: theme.colors.textMuted,
          background: theme.colors.gradientCard,
        }}>
          <div style={{ fontSize: '24px', marginBottom: theme.spacing.sm }}>...</div>
          {t('noData')}
        </div>
      ) : (
        data.map((row, idx) => isMobile ? renderMobileCard(row, idx) : renderDesktopRow(row, idx))
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
function NewsList({ data, minScore, setMinScore, hasPendingUpdate, pendingCount, onLoadUpdates }) {
  const { language, t } = useLanguage();
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
        {language === 'zh' && (
          <div style={{
            marginLeft: 'auto',
            padding: '6px 12px',
            background: 'rgba(255, 136, 0, 0.1)',
            border: '1px solid rgba(255, 136, 0, 0.3)',
            borderRadius: theme.radius.md,
            color: theme.colors.neonOrange,
            fontSize: '11px',
            fontWeight: 600,
          }}>
            📰 新闻内容为英文原文
          </div>
        )}
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
  const { t } = useLanguage();
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
        <span>{t('settingsTelegramTitle')}</span>
      </div>

      <div style={settingsStyles.section}>
        <label style={settingsStyles.label}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={settingsStyles.checkbox}
          />
          {t('settingsTelegramDescription')}
        </label>
      </div>

      <div style={settingsStyles.grid}>
        <div style={settingsStyles.inputGroup}>
          <div style={settingsStyles.inputLabel}>{t('settingsBotToken')}</div>
          <input
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder={t('settingsBotTokenPlaceholder')}
            style={settingsStyles.input}
          />
        </div>
        <div style={settingsStyles.inputGroup}>
          <div style={settingsStyles.inputLabel}>{t('settingsChatId')}</div>
          <input
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder={t('settingsChatIdPlaceholder')}
            style={settingsStyles.input}
          />
        </div>
      </div>

      <div style={settingsStyles.actions}>
        <button onClick={save} disabled={loading} style={settingsStyles.primaryButton}>
          {loading ? t('settingsSaving') : t('settingsSave')}
        </button>
        <button onClick={test} disabled={loading} style={settingsStyles.secondaryButton}>
          {loading ? t('settingsTesting') : t('settingsTest')}
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

// Main App Component
function App() {
  const { t } = useLanguage();
  const [tab, setTab] = useState(() => {
    if (typeof window === 'undefined') return 'apy';
    return getTabFromPath(window.location.pathname);
  });
  const [apy, setApy] = useState([]);
  const [news, setNews] = useState([]);
  const [pendingNews, setPendingNews] = useState([]);
  const [hasPendingNewsUpdate, setHasPendingNewsUpdate] = useState(false);
  const [strategies, setStrategies] = useState([]);
  const [strategiesLoading, setStrategiesLoading] = useState(false);
  const [minScore, setMinScore] = useState(6);
  const [err, setErr] = useState('');
  // Default to 'dex' filter for DeFi stablecoin yields
  const [apyFilter, setApyFilter] = useState('dex');
  // TVL and APY filters
  const [minTvl, setMinTvl] = useState(1); // in millions
  const [minApy, setMinApy] = useState(3); // in percentage
  const [apySortDirection, setApySortDirection] = useState('desc');
  // Chain filter
  const [selectedChain, setSelectedChain] = useState('all');

  // Get available chains from data
  const availableChains = useMemo(() => {
    const chains = new Set();
    apy.forEach((item) => {
      if (item.chain && item.chain.toLowerCase() !== 'cefi') {
        chains.add(item.chain);
      }
    });
    return Array.from(chains).sort();
  }, [apy]);

  const tabs = useMemo(() => [
    { id: 'apy', name: t('tabYields'), icon: '$' },
    { id: 'strategy', name: t('tabStrategies'), icon: 'S' },
    { id: 'news', name: t('tabNews'), icon: '#' },
    { id: 'settings', name: t('tabConfig'), icon: '>' },
  ], [t]);

  function changeTab(nextTab, { replace = false } = {}) {
    setTab(nextTab);
    if (typeof window === 'undefined') return;
    const nextPath = getRouteFromTab(nextTab);
    if (window.location.pathname === nextPath) return;
    if (replace) {
      window.history.replaceState({}, '', nextPath);
    } else {
      window.history.pushState({}, '', nextPath);
    }
  }

  async function loadApy() {
    const r = await fetch(`${API_BASE}/api/apy?limit=50`);
    const j = await r.json();
    // Support both old format (j.items) and new format (j.data.items)
    setApy(j.data?.items || j.items || []);
  }

  async function fetchNewsData(score = minScore) {
    const r = await fetch(`${API_BASE}/api/news?limit=80&minScore=${score}`);
    const j = await r.json();
    return j.data?.items || j.items || [];
  }

  async function loadNews() {
    const items = await fetchNewsData(minScore);
    setNews(items);
    setPendingNews([]);
    setHasPendingNewsUpdate(false);
    return items;
  }

  function applyPendingNews() {
    if (!pendingNews.length) return;
    setNews(pendingNews);
    setPendingNews([]);
    setHasPendingNewsUpdate(false);
  }

  async function checkNewsUpdates() {
    const latest = await fetchNewsData(minScore);
    if (!news.length) {
      setNews(latest);
      return;
    }

    const latestSignature = buildNewsSignature(latest);
    const currentSignature = buildNewsSignature(news);
    if (!latestSignature || latestSignature === currentSignature) return;

    setPendingNews(latest);
    setHasPendingNewsUpdate(true);
  }

  async function loadStrategies() {
    setStrategiesLoading(true);
    try {
      const responses = await Promise.all(
        STRATEGY_ENDPOINTS.map((path) => fetch(`${API_BASE}${path}?top=10`))
      );
      const payloads = await Promise.all(responses.map((r) => r.json()));
      const items = payloads
        .map((j) => j.data || null)
        .filter(Boolean);
      setStrategies(items);
    } finally {
      setStrategiesLoading(false);
    }
  }

  async function refreshData() {
    try {
      setErr('');
      await Promise.all([loadApy(), loadNews(), loadStrategies()]);
    } catch (e) {
      setErr(String(e?.message || e));
    }
  }

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const routeTab = getTabFromPath(window.location.pathname);
    if (routeTab !== tab) {
      setTab(routeTab);
    } else {
      const canonicalPath = getRouteFromTab(tab);
      if (window.location.pathname !== canonicalPath) {
        window.history.replaceState({}, '', canonicalPath);
      }
    }

    const onPopState = () => {
      setTab(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [tab]);

  const filteredApy = useMemo(() => {
    let result = apy;

    // Apply type filter
    if (apyFilter === 'cex') {
      result = result.filter((x) => String(x.chain || '').toLowerCase() === 'cefi');
    } else if (apyFilter === 'dex') {
      result = result.filter((x) => String(x.chain || '').toLowerCase() !== 'cefi');
    }

    // Apply chain filter (only for DEX)
    if (apyFilter === 'dex' && selectedChain !== 'all') {
      result = result.filter((x) => x.chain === selectedChain);
    }

    // Apply TVL filter (minTvl is in millions)
    if (minTvl > 0) {
      result = result.filter((x) => (x.tvlUsd || 0) >= minTvl * 1_000_000);
    }

    // Apply APY filter
    if (minApy > 0) {
      result = result.filter((x) => (x.apy || 0) >= minApy);
    }

    const sorted = [...result].sort((a, b) => {
      const av = Number(a.apy ?? -Infinity);
      const bv = Number(b.apy ?? -Infinity);
      if (av !== bv) return apySortDirection === 'asc' ? av - bv : bv - av;
      return (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0);
    });

    return sorted;
  }, [apy, apyFilter, selectedChain, minTvl, minApy, apySortDirection]);

  function toggleApySort() {
    setApySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }

  useEffect(() => {
    if (tab === 'news') loadNews().catch(() => {});
    if (tab === 'strategy' && strategies.length === 0) loadStrategies().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minScore, tab]);

  useEffect(() => {
    if (tab !== 'news') return undefined;

    const timer = window.setInterval(() => {
      checkNewsUpdates().catch(() => {});
    }, 60_000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, minScore, news]);

  return (
    <div style={styles.container}>
      {/* Cyberpunk background effects */}
      <div style={styles.gridPattern} />
      <div style={styles.glowOverlay} />
      <div style={styles.scanlines} />

      <div style={styles.content}>
        {/* Header - Mobile Responsive */}
        <div style={styles.header} className="app-header">
          <div style={styles.logo} className="app-logo">
            <div style={styles.logoIcon} className="logo-icon">
              <LogoIcon size={52} />
            </div>
            <div className="logo-text">
              <h1 style={styles.title} className="app-title">{t('title')}</h1>
              <div style={styles.subtitle} className="app-subtitle">{t('subtitle')}</div>
            </div>
          </div>

          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexWrap: 'wrap' }}>
            <div style={styles.nav} className="nav-tabs">
              {tabs.map(tabItem => (
                <button
                  key={tabItem.id}
                  onClick={() => changeTab(tabItem.id)}
                  style={styles.navButton(tab === tabItem.id)}
                  className="nav-button"
                >
                  <span className="nav-icon" style={{
                    marginRight: '6px',
                    opacity: 0.7,
                    fontFamily: theme.fonts.mono,
                  }}>{tabItem.icon}</span>
                  <span className="nav-text">{tabItem.name}</span>
                </button>
              ))}
            </div>

            <div className="header-buttons" style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
              <LanguageToggle />
              <div className="wallet-button">
                <WalletConnectButton />
              </div>
            </div>
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
            <div className="filter-bar" style={{
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
                }}>{t('filterType')}</span>
                {[
                  { id: 'all', label: t('filterAll') },
                  { id: 'dex', label: t('filterDex') },
                  { id: 'cex', label: t('filterCex') },
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

              {/* Chain Filter - only show for DEX */}
              {apyFilter === 'dex' && availableChains.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <span style={{
                    color: theme.colors.textMuted,
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>{t('filterChain')}</span>
                  <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.bgInput,
                      color: theme.colors.textPrimary,
                      fontSize: '12px',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer',
                      minWidth: '120px',
                    }}
                  >
                    <option value="all">{t('filterAllChains')}</option>
                    {availableChains.map((chain) => (
                      <option key={chain} value={chain} style={{
                        color: CHAIN_COLORS[chain] || theme.colors.textPrimary,
                      }}>
                        {chain}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
            {apyFilter === 'cex' ? (
              <div
                style={{
                  ...styles.card,
                  padding: theme.spacing.xl,
                  textAlign: 'center',
                  background: theme.colors.gradientCard,
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: theme.spacing.sm }}>🏗</div>
                <div style={{ color: theme.colors.electricCyanLight, fontSize: '16px', fontWeight: 700, marginBottom: 6 }}>
                  {t('cexBuildingSoon')}
                </div>
                <div style={{ color: theme.colors.textMuted, fontSize: '12px' }}>
                  {t('cexDescription')}
                </div>
              </div>
            ) : (
              <ApyTable
                data={filteredApy}
                apySortDirection={apySortDirection}
                onToggleApySort={toggleApySort}
              />
            )}
          </div>
        )}
        {tab === 'strategy' && <StrategyPage groups={strategies} loading={strategiesLoading} t={t} />}
        {tab === 'news' && (
          <NewsList
            data={news}
            minScore={minScore}
            setMinScore={setMinScore}
            hasPendingUpdate={hasPendingNewsUpdate}
            pendingCount={pendingNews.length}
            onLoadUpdates={applyPendingNews}
          />
        )}
        {tab === 'settings' && <Settings apiBase={API_BASE} />}

        {/* Footer */}
        <div style={styles.footer} className="app-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
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
              wordBreak: 'break-all',
            }}>{API_BASE}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexWrap: 'wrap', justifyContent: 'center' }}>
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

        /* ==================== MOBILE RESPONSIVE STYLES ==================== */

        /* Tablet and below (< 1024px) */
        @media (max-width: 1024px) {
          .app-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }

          .header-actions {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }

        /* Mobile (< 768px) */
        @media (max-width: 768px) {
          .app-header {
            padding: 0 !important;
          }

          .app-logo {
            gap: 12px !important;
          }

          .logo-icon {
            width: 40px !important;
            height: 40px !important;
          }

          .logo-icon svg {
            width: 40px !important;
            height: 40px !important;
          }

          .app-title {
            font-size: 20px !important;
          }

          .app-subtitle {
            font-size: 11px !important;
            display: none;
          }

          .header-actions {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }

          .nav-tabs {
            width: 100% !important;
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            padding: 4px !important;
          }

          .nav-button {
            padding: 8px 4px !important;
            font-size: 11px !important;
            justify-content: center !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2px !important;
          }

          .nav-icon {
            margin-right: 0 !important;
            font-size: 14px !important;
          }

          .nav-text {
            font-size: 10px !important;
          }

          .header-buttons {
            width: 100% !important;
            display: flex !important;
            gap: 8px !important;
          }

          .refresh-button {
            flex: 1 !important;
            justify-content: center !important;
          }

          .wallet-button {
            flex: 1 !important;
          }

          .wallet-button > div,
          .wallet-button button {
            width: 100% !important;
            justify-content: center !important;
          }

          /* Stats bar */
          .stats-container {
            grid-template-columns: 1fr !important;
          }

          /* Filter bar on mobile */
          .filter-bar {
            flex-direction: column !important;
            gap: 12px !important;
          }

          /* Footer on mobile */
          .app-footer {
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center !important;
          }
        }

        /* Small mobile (< 480px) */
        @media (max-width: 480px) {
          .app-title {
            font-size: 18px !important;
          }

          .nav-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .nav-button {
            padding: 10px 8px !important;
          }

          .refresh-text {
            display: none;
          }

          .refresh-button {
            padding: 10px 14px !important;
            min-width: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
