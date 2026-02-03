import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

// Morpho-inspired Design System
const theme = {
  // Colors - inspired by Blue Morpho butterfly
  colors: {
    // Backgrounds
    bgPrimary: '#0a0e14',
    bgSecondary: '#111827',
    bgCard: 'rgba(17, 24, 39, 0.8)',
    bgCardHover: 'rgba(30, 41, 59, 0.9)',
    bgInput: 'rgba(15, 23, 42, 0.9)',

    // Primary blue gradient
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    accent: '#0ea5e9',

    // Text
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    // Borders
    border: 'rgba(71, 85, 105, 0.4)',
    borderHover: 'rgba(59, 130, 246, 0.5)',

    // Status
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    gradientDark: 'linear-gradient(180deg, #0a0e14 0%, #111827 100%)',
    gradientGlow: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
  },

  // Typography
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Border radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Transitions
  transition: {
    fast: 'all 0.15s ease',
    normal: 'all 0.25s ease',
    slow: 'all 0.4s ease',
  },
};

// Custom Logo SVG Component - Morpho butterfly inspired with yield chart
function LogoIcon({ size = 40 }) {
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
        {/* Main blue gradient */}
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        {/* Glow effect */}
        <radialGradient id="glowGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
        </radialGradient>
        {/* Left wing gradient */}
        <linearGradient id="wingLeft" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        {/* Right wing gradient */}
        <linearGradient id="wingRight" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        {/* Chart line gradient */}
        <linearGradient id="chartGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        {/* Shine effect */}
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {/* Drop shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0ea5e9" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background circle with gradient */}
      <circle cx="24" cy="24" r="23" fill="url(#bgGrad)" />

      {/* Inner glow */}
      <circle cx="24" cy="24" r="20" fill="url(#glowGrad)" />

      {/* Butterfly wings - left */}
      <path
        d="M24 24 C18 18, 8 16, 6 24 C4 32, 14 34, 24 24"
        fill="url(#wingLeft)"
        opacity="0.9"
        filter="url(#shadow)"
      />

      {/* Butterfly wings - right */}
      <path
        d="M24 24 C30 18, 40 16, 42 24 C44 32, 34 34, 24 24"
        fill="url(#wingRight)"
        opacity="0.9"
        filter="url(#shadow)"
      />

      {/* Butterfly body - center */}
      <ellipse cx="24" cy="24" rx="2.5" ry="8" fill="#f0f9ff" opacity="0.95" />

      {/* Yield chart line - upward trend */}
      <path
        d="M10 34 L16 30 L22 32 L28 26 L34 22 L38 14"
        stroke="url(#chartGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#shadow)"
      />

      {/* Chart end point glow */}
      <circle cx="38" cy="14" r="3" fill="#34d399" opacity="0.8" />
      <circle cx="38" cy="14" r="1.5" fill="#ecfdf5" />

      {/* Top shine effect */}
      <ellipse cx="18" cy="14" rx="8" ry="4" fill="url(#shine)" />

      {/* Subtle ring */}
      <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="0.5" opacity="0.2" fill="none" />
    </svg>
  );
}

// Common styles
const styles = {
  container: {
    fontFamily: theme.fonts.sans,
    minHeight: '100vh',
    background: theme.colors.gradientDark,
    color: theme.colors.textPrimary,
    padding: theme.spacing.lg,
    position: 'relative',
  },

  glowOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '400px',
    background: theme.colors.gradientGlow,
    pointerEvents: 'none',
    zIndex: 0,
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
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
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: '24px',
    fontWeight: 700,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: '14px',
    marginTop: '4px',
  },

  nav: {
    display: 'flex',
    gap: theme.spacing.sm,
    background: theme.colors.bgCard,
    padding: '6px',
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.border}`,
  },

  navButton: (active) => ({
    padding: '10px 20px',
    borderRadius: theme.radius.md,
    border: 'none',
    background: active ? theme.colors.gradientPrimary : 'transparent',
    color: active ? '#fff' : theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: theme.transition.fast,
  }),

  refreshButton: {
    padding: '10px 16px',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.bgCard,
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: theme.transition.fast,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  card: {
    background: theme.colors.bgCard,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    backdropFilter: 'blur(12px)',
    overflow: 'hidden',
  },

  error: {
    padding: theme.spacing.md,
    background: 'rgba(239, 68, 68, 0.1)',
    border: `1px solid ${theme.colors.error}`,
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
      default: { background: 'rgba(100, 116, 139, 0.2)', color: theme.colors.textSecondary },
      primary: { background: 'rgba(37, 99, 235, 0.2)', color: theme.colors.primaryLight },
      success: { background: 'rgba(16, 185, 129, 0.2)', color: theme.colors.success },
      warning: { background: 'rgba(245, 158, 11, 0.2)', color: theme.colors.warning },
    };
    return {
      fontSize: '11px',
      padding: '4px 10px',
      borderRadius: theme.radius.full,
      fontWeight: 500,
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

// APY Table Component
function ApyTable({ data }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  const tableStyles = {
    header: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 0.8fr 0.7fr 0.8fr 1.2fr',
      padding: '14px 20px',
      background: 'rgba(15, 23, 42, 0.6)',
      borderBottom: `1px solid ${theme.colors.border}`,
      fontSize: '12px',
      fontWeight: 600,
      color: theme.colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    row: (isHovered) => ({
      display: 'grid',
      gridTemplateColumns: '1.5fr 0.8fr 0.7fr 0.8fr 1.2fr',
      padding: '16px 20px',
      borderBottom: `1px solid ${theme.colors.border}`,
      background: isHovered ? theme.colors.bgCardHover : 'transparent',
      transition: theme.transition.fast,
      cursor: 'default',
    }),
    provider: {
      fontWeight: 600,
      color: theme.colors.textPrimary,
    },
    chain: {
      fontSize: '12px',
      color: theme.colors.textMuted,
      marginTop: '4px',
    },
    symbol: {
      fontFamily: theme.fonts.mono,
      color: theme.colors.accent,
      fontWeight: 500,
    },
    apy: {
      fontWeight: 700,
      fontSize: '16px',
      color: theme.colors.success,
    },
    tvl: {
      fontFamily: theme.fonts.mono,
      color: theme.colors.textSecondary,
    },
    risk: {
      fontSize: '13px',
      color: theme.colors.textMuted,
    },
  };

  return (
    <div style={styles.card}>
      <div style={tableStyles.header}>
        <div>Platform</div>
        <div>Symbol</div>
        <div>APY</div>
        <div>TVL</div>
        <div>Risk Assessment</div>
      </div>
      {data.length === 0 ? (
        <div style={{ padding: theme.spacing.xl, textAlign: 'center', color: theme.colors.textMuted }}>
          No data available
        </div>
      ) : (
        data.map((row, idx) => (
          <div
            key={row.id}
            style={tableStyles.row(hoveredRow === idx)}
            onMouseEnter={() => setHoveredRow(idx)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
              {row.logoUrl ? (
                <img src={row.logoUrl} alt={row.platformName || row.provider} width={22} height={22} style={{ borderRadius: theme.radius.md }} />
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: theme.radius.md, background: theme.colors.border }} />
              )}
              <div>
                <a
                  href={row.platformUrl || row.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...tableStyles.provider, textDecoration: 'none', color: theme.colors.textPrimary }}
                >
                  {row.platformName || row.provider}
                </a>
                <div style={tableStyles.chain}>{row.chain || '—'}</div>
              </div>
            </div>
            <div style={tableStyles.symbol}>{row.symbol}</div>
            <div style={tableStyles.apy}>{row.apy == null ? '—' : `${Number(row.apy).toFixed(2)}%`}</div>
            <div style={tableStyles.tvl}>{fmtUsd(row.tvlUsd)}</div>
            <div style={tableStyles.risk}>{row.riskNote || 'Standard risk'}</div>
          </div>
        ))
      )}
    </div>
  );
}

// News Card Component
function NewsCard({ item }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyles = {
    container: {
      display: 'block',
      padding: theme.spacing.lg,
      background: isHovered ? theme.colors.bgCardHover : theme.colors.bgCard,
      border: `1px solid ${isHovered ? theme.colors.borderHover : theme.colors.border}`,
      borderRadius: theme.radius.lg,
      textDecoration: 'none',
      color: 'inherit',
      transition: theme.transition.normal,
      transform: isHovered ? 'translateY(-2px)' : 'none',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: '16px',
      fontWeight: 600,
      color: theme.colors.textPrimary,
      lineHeight: 1.4,
    },
    score: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      background: item.score >= 8
        ? 'rgba(16, 185, 129, 0.2)'
        : item.score >= 5
          ? 'rgba(245, 158, 11, 0.2)'
          : 'rgba(100, 116, 139, 0.2)',
      borderRadius: theme.radius.full,
      fontSize: '12px',
      fontWeight: 600,
      color: item.score >= 8
        ? theme.colors.success
        : item.score >= 5
          ? theme.colors.warning
          : theme.colors.textMuted,
      whiteSpace: 'nowrap',
    },
    meta: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      fontSize: '13px',
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
    },
    source: {
      color: theme.colors.accent,
      fontWeight: 500,
    },
    summary: {
      fontSize: '14px',
      color: theme.colors.textSecondary,
      lineHeight: 1.6,
      marginBottom: theme.spacing.md,
    },
    tags: {
      display: 'flex',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    tag: {
      fontSize: '11px',
      padding: '4px 10px',
      borderRadius: theme.radius.full,
      background: 'rgba(37, 99, 235, 0.15)',
      color: theme.colors.primaryLight,
      fontWeight: 500,
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
          <span>★</span>
          <span>{item.score}</span>
        </div>
      </div>
      <div style={cardStyles.meta}>
        <span style={cardStyles.source}>{item.source?.name || 'Unknown'}</span>
        <span>•</span>
        <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '—'}</span>
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
    },
    label: {
      color: theme.colors.textSecondary,
      fontSize: '14px',
      fontWeight: 500,
    },
    input: {
      width: '80px',
      padding: '10px 12px',
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.bgInput,
      color: theme.colors.textPrimary,
      fontSize: '14px',
      fontFamily: theme.fonts.mono,
      outline: 'none',
    },
    hint: {
      color: theme.colors.textMuted,
      fontSize: '12px',
    },
    grid: {
      display: 'grid',
      gap: theme.spacing.md,
    },
  };

  return (
    <div>
      <div style={filterStyles.container}>
        <span style={filterStyles.label}>Minimum Score:</span>
        <input
          type="number"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          style={filterStyles.input}
          min={1}
          max={10}
        />
        <span style={filterStyles.hint}>1 = all news, 10 = most important only</span>
      </div>
      <div style={filterStyles.grid}>
        {data.length === 0 ? (
          <div style={{ padding: theme.spacing.xl, textAlign: 'center', color: theme.colors.textMuted }}>
            No news matching your criteria
          </div>
        ) : (
          data.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

// Settings Component
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
    },
    title: {
      fontSize: '18px',
      fontWeight: 700,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.lg,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    icon: {
      fontSize: '24px',
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
      width: '18px',
      height: '18px',
      accentColor: theme.colors.primary,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing.md,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: '12px',
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
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
      marginTop: theme.spacing.lg,
    },
    primaryButton: {
      padding: '12px 24px',
      borderRadius: theme.radius.md,
      border: 'none',
      background: theme.colors.gradientPrimary,
      color: '#fff',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: theme.transition.fast,
    },
    secondaryButton: {
      padding: '12px 24px',
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
      background: 'transparent',
      color: theme.colors.textSecondary,
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: theme.transition.fast,
    },
    message: (isError) => ({
      fontSize: '13px',
      color: isError ? theme.colors.error : theme.colors.success,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    }),
    note: {
      marginTop: theme.spacing.lg,
      padding: theme.spacing.md,
      background: 'rgba(245, 158, 11, 0.1)',
      borderRadius: theme.radius.md,
      border: `1px solid rgba(245, 158, 11, 0.3)`,
      fontSize: '13px',
      color: theme.colors.warning,
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
      setMsg(j.ok ? '✓ Settings saved successfully' : `Error: ${JSON.stringify(j)}`);
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }
    setLoading(false);
  }

  async function test() {
    setLoading(true);
    setMsg('');
    try {
      const r = await fetch(`${apiBase}/api/integrations/telegram/test`, { method: 'POST' });
      const j = await r.json();
      setMsg(j.ok ? '✓ Test message sent!' : `Error: ${JSON.stringify(j)}`);
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }
    setLoading(false);
  }

  return (
    <div style={settingsStyles.container}>
      <div style={settingsStyles.title}>
        <span style={settingsStyles.icon}>✈</span>
        Telegram Integration
      </div>

      <div style={settingsStyles.section}>
        <label style={settingsStyles.label}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={settingsStyles.checkbox}
          />
          Enable Telegram notifications for important news
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
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        <button onClick={test} disabled={loading} style={settingsStyles.secondaryButton}>
          Send Test Message
        </button>
        {msg && (
          <div style={settingsStyles.message(msg.includes('Error'))}>
            {msg}
          </div>
        )}
      </div>

      <div style={settingsStyles.note}>
        <strong>Note:</strong> This is an MVP feature. Telegram credentials are stored in the database.
        For production use, consider implementing proper secret management.
      </div>
    </div>
  );
}

// Stats Bar Component
function StatsBar({ apyCount, newsCount }) {
  const statsStyles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    card: {
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md,
      padding: theme.spacing.lg,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    icon: {
      width: '48px',
      height: '48px',
      borderRadius: theme.radius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
    },
    label: {
      fontSize: '13px',
      color: theme.colors.textMuted,
      marginBottom: '4px',
    },
    value: {
      fontSize: '24px',
      fontWeight: 700,
      color: theme.colors.textPrimary,
    },
  };

  return (
    <div style={statsStyles.container}>
      <div style={statsStyles.card}>
        <div style={{ ...statsStyles.icon, background: 'rgba(16, 185, 129, 0.2)' }}>📈</div>
        <div>
          <div style={statsStyles.label}>Active Yield Opportunities</div>
          <div style={statsStyles.value}>{apyCount}</div>
        </div>
      </div>
      <div style={statsStyles.card}>
        <div style={{ ...statsStyles.icon, background: 'rgba(37, 99, 235, 0.2)' }}>📰</div>
        <div>
          <div style={statsStyles.label}>News Articles</div>
          <div style={statsStyles.value}>{newsCount}</div>
        </div>
      </div>
      <div style={statsStyles.card}>
        <div style={{ ...statsStyles.icon, background: 'rgba(245, 158, 11, 0.2)' }}>🔄</div>
        <div>
          <div style={statsStyles.label}>Data Updates</div>
          <div style={statsStyles.value}>Real-time</div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [tab, setTab] = useState('apy');
  const [apy, setApy] = useState([]);
  const [news, setNews] = useState([]);
  const [minScore, setMinScore] = useState(6);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const tabs = useMemo(() => [
    { id: 'apy', name: 'Yield Opportunities', icon: '📊' },
    { id: 'news', name: 'Market News', icon: '📰' },
    { id: 'settings', name: 'Settings', icon: '⚙' },
  ], []);

  async function loadApy() {
    const r = await fetch(`${API_BASE}/api/apy?limit=50`);
    const j = await r.json();
    setApy(j.items || []);
  }

  async function loadNews() {
    const r = await fetch(`${API_BASE}/api/news?limit=80&minScore=${minScore}`);
    const j = await r.json();
    setNews(j.items || []);
  }

  async function refreshData() {
    setLoading(true);
    try {
      setErr('');
      await Promise.all([loadApy(), loadNews()]);
    } catch (e) {
      setErr(String(e?.message || e));
    }
    setLoading(false);
  }

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === 'news') loadNews().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minScore, tab]);

  return (
    <div style={styles.container}>
      {/* Glow effect */}
      <div style={styles.glowOverlay} />

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <LogoIcon size={48} />
            </div>
            <div>
              <h1 style={styles.title}>YieldNewsHub</h1>
              <div style={styles.subtitle}>Low-risk stablecoin yields & market intelligence</div>
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
                  <span style={{ marginRight: '6px' }}>{t.icon}</span>
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
              }}
            >
              <span style={{
                display: 'inline-block',
                animation: loading ? 'spin 1s linear infinite' : 'none',
              }}>↻</span>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats */}
        {tab !== 'settings' && (
          <StatsBar apyCount={apy.length} newsCount={news.length} />
        )}

        {/* Error */}
        {err && <div style={styles.error}>⚠ {err}</div>}

        {/* Content */}
        {tab === 'apy' && <ApyTable data={apy} />}
        {tab === 'news' && <NewsList data={news} minScore={minScore} setMinScore={setMinScore} />}
        {tab === 'settings' && <Settings apiBase={API_BASE} />}

        {/* Footer */}
        <div style={styles.footer}>
          <div>
            <span style={{ color: theme.colors.accent }}>●</span> Connected to: <code style={{
              fontFamily: theme.fonts.mono,
              background: theme.colors.bgCard,
              padding: '2px 8px',
              borderRadius: theme.radius.sm,
              marginLeft: '4px',
            }}>{API_BASE}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            <span>Built with 💙 for DeFi</span>
            <span style={styles.badge('primary')}>v1.0 MVP</span>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: ${theme.colors.bgPrimary};
        }

        input:focus {
          border-color: ${theme.colors.borderHover} !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        button:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.colors.bgSecondary};
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.colors.border};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.textMuted};
        }
      `}</style>
    </div>
  );
}

export default App;
