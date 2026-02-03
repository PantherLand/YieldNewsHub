import React, { useMemo } from 'react';
import { LOGOS } from './logos.js';

const theme = {
  colors: {
    bgCard: 'rgba(15, 23, 42, 0.55)',
    border: 'rgba(148, 163, 184, 0.18)',
    textPrimary: 'rgba(248, 250, 252, 0.95)',
    textMuted: 'rgba(148, 163, 184, 0.8)',
    accent: '#60a5fa',
  },
  radius: { lg: '14px', md: '10px', full: '999px' },
  spacing: { md: '12px', lg: '16px' },
  transition: { fast: 'all 0.15s ease' },
};

export default function CexLinks({ items }) {
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
      <div style={{ color: theme.colors.textMuted, fontSize: 13 }}>
        CEX is links-only for now (no API integration). Click to open the exchange Earn page and deposit the selected stablecoin.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: theme.spacing.lg }}>
        {groups.map(([key, rows]) => (
          <div key={key} style={{ background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, padding: theme.spacing.lg }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: theme.spacing.md }}>
              {LOGOS[key] ? (
                <img src={LOGOS[key]} width={22} height={22} style={{ borderRadius: theme.radius.md }} />
              ) : null}
              <div style={{ fontWeight: 800, color: theme.colors.textPrimary, letterSpacing: 0.2 }}>
                {rows[0]?.exchange || key}
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 12, color: theme.colors.textMuted }}>{rows.length} assets</div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {rows.map((r) => (
                <a
                  key={r.exchangeKey + ':' + r.asset}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '6px 10px',
                    borderRadius: theme.radius.full,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary,
                    textDecoration: 'none',
                    fontSize: 13,
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

      <div style={{ color: theme.colors.textMuted, fontSize: 12 }}>
        Risk note: CEX products involve custody/credit risk. Always verify product type (flexible/locked) and terms on the exchange.
      </div>
    </div>
  );
}
