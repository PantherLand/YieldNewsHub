import React, { useMemo } from 'react';
import { LOGOS } from './logos.js';
import { useLanguage } from '../i18n/index.js';

const theme = {
  colors: {
    bgCard: 'rgba(15, 23, 42, 0.55)',
    bgCardHover: 'rgba(26, 23, 48, 0.8)',
    border: 'rgba(148, 163, 184, 0.18)',
    borderHover: 'rgba(168, 85, 247, 0.5)',
    textPrimary: 'rgba(248, 250, 252, 0.95)',
    textMuted: 'rgba(148, 163, 184, 0.8)',
    accent: '#60a5fa',
    cyberPurple: '#A855F7',
    gradientPrimary: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #06B6D4 100%)',
  },
  radius: { lg: '14px', md: '10px', full: '999px' },
  spacing: { sm: '8px', md: '12px', lg: '16px' },
  transition: { fast: 'all 0.15s ease' },
};

export default function CexLinks({ items }) {
  const { t } = useLanguage();
  const groups = useMemo(() => {
    const by = new Map();
    for (const it of items || []) {
      const k = it.exchangeKey || it.exchange || 'cex';
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(it);
    }
    return Array.from(by.entries());
  }, [items]);

  return (
    <div style={{ display: 'grid', gap: theme.spacing.lg }}>
      <div style={{ color: theme.colors.textMuted, fontSize: 13, lineHeight: 1.5 }}>
        {t('cexDescription')}
      </div>

      <div className="cex-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: theme.spacing.lg }}>
        {groups.map(([key, rows]) => (
          <div
            key={key}
            className="cex-card"
            style={{
              background: theme.colors.bgCard,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg,
              transition: theme.transition.fast,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: theme.spacing.md }}>
              {LOGOS[key] ? (
                <img
                  src={LOGOS[key]}
                  alt={key}
                  width={28}
                  height={28}
                  style={{ borderRadius: theme.radius.md, flexShrink: 0 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: theme.radius.md,
                  background: theme.colors.gradientPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}>
                  {(key || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ fontWeight: 800, color: theme.colors.textPrimary, letterSpacing: 0.2, fontSize: 15 }}>
                {rows[0]?.exchange || key}
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 12, color: theme.colors.textMuted }}>{rows.length} {t('cexAssets')}</div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {rows.map((r) => (
                <a
                  key={r.exchangeKey + ':' + r.asset}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="cex-asset-link"
                  style={{
                    padding: '8px 14px',
                    borderRadius: theme.radius.full,
                    border: `1px solid ${theme.colors.border}`,
                    background: 'rgba(168, 85, 247, 0.08)',
                    color: theme.colors.textPrimary,
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    transition: theme.transition.fast,
                  }}
                >
                  {r.asset}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ color: theme.colors.textMuted, fontSize: 12, lineHeight: 1.5 }}>
        {t('cexRiskNote')}
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .cex-grid {
            grid-template-columns: 1fr !important;
          }

          .cex-card {
            padding: 14px !important;
          }
        }

        .cex-asset-link:hover {
          background: rgba(168, 85, 247, 0.2) !important;
          border-color: rgba(168, 85, 247, 0.5) !important;
          transform: translateY(-1px);
        }

        .cex-asset-link:active {
          transform: translateY(0);
        }

        .cex-card:hover {
          border-color: rgba(168, 85, 247, 0.3) !important;
        }
      `}</style>
    </div>
  );
}
