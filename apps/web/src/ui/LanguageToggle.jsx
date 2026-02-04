import React from 'react';
import { useLanguage, LANGUAGES } from '../i18n/index.js';

// Cyberpunk theme tokens (matching App.jsx design system)
const theme = {
  colors: {
    cyberPurple: '#A855F7',
    cyberPurpleDark: '#7C3AED',
    electricCyan: '#06B6D4',
    bgCard: '#12101F',
    bgCardHover: '#1A1730',
    textPrimary: '#F8FAFC',
    textSecondary: '#A0AEC0',
    textMuted: '#64748B',
    border: 'rgba(168, 85, 247, 0.2)',
    borderHover: 'rgba(168, 85, 247, 0.5)',
  },
  fonts: {
    mono: "'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace",
  },
  radius: {
    md: '12px',
  },
  transition: {
    fast: 'all 0.15s ease-out',
  },
};

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      title={language === 'en' ? 'Switch to Chinese' : '\u5207\u6362\u5230\u82f1\u6587'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 14px',
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.bgCard,
        color: theme.colors.textSecondary,
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        transition: theme.transition.fast,
        fontFamily: theme.fonts.mono,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.colors.borderHover;
        e.currentTarget.style.background = theme.colors.bgCardHover;
        e.currentTarget.style.color = theme.colors.textPrimary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
        e.currentTarget.style.background = theme.colors.bgCard;
        e.currentTarget.style.color = theme.colors.textSecondary;
      }}
    >
      <GlobeIcon />
      <span style={{ minWidth: '32px', textAlign: 'center' }}>
        {LANGUAGES[language].nativeName}
      </span>
    </button>
  );
}

// Globe Icon SVG
function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default LanguageToggle;
