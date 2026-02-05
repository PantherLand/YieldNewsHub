import React, { useState, useEffect } from 'react';
import { theme, styles } from '../styles/index.js';
import { useLanguage } from '../i18n/index.js';
import { ProtocolLogo, ChainLogo } from '../components/index.js';
import { fmtUsd, tvlHeat } from '../utils/index.js';
import { getChainLogo, getChainColor, CHAIN_LOGOS } from './logos.js';

// APY Table Component with Cyberpunk styling - Mobile Responsive
export function ApyTable({
  data,
  sortBy = 'apy',
  apySortDirection = 'desc',
  tvlSortDirection = 'desc',
  onToggleApySort,
  onToggleTvlSort,
}) {
  const { t } = useLanguage();
  const [hoveredRow, setHoveredRow] = useState(null);

  const getProtocolName = (row) => {
    if (row?.platformName) return row.platformName;
    const provider = String(row?.provider || '').trim();
    if (!provider) return t('genericProtocol');
    return provider
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const getActionText = (row) => `${t('actionLinkTo')} ${getProtocolName(row)}`;

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

        <div style={tableStyles.mobileCardBody}>
          <div style={tableStyles.mobileCardStat}>
            <span style={tableStyles.mobileCardLabel}>Asset</span>
            <span style={tableStyles.symbol}>{row.symbol}</span>
          </div>
          <div style={tableStyles.mobileCardStat}>
            <span style={tableStyles.mobileCardLabel}>TVL</span>
            <span style={tableStyles.tvl}>
              {fmtUsd(row.tvlUsd)} {tvlHeat(row.tvlUsd)}
            </span>
          </div>
          <div style={tableStyles.mobileCardStat}>
            <span style={tableStyles.mobileCardLabel}>APY</span>
            <span style={{ ...tableStyles.apy, fontSize: '14px' }}>
              {row.apy == null ? '...' : `${Number(row.apy).toFixed(2)}%`}
            </span>
          </div>
        </div>

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
        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
          <ProtocolLogo row={row} />
          <div>
            <div style={tableStyles.provider}>
              {row.platformName || row.provider}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={tableStyles.chainBadge(chainColor)}>
            <ChainLogo src={chainLogoSrc} label={row.chainName || row.chain} />
            {row.chainName || row.chain || '...'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={tableStyles.symbol}>{row.symbol}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={tableStyles.apy}>
            {row.apy == null ? '...' : `${Number(row.apy).toFixed(2)}%`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={tableStyles.tvl}>
            {fmtUsd(row.tvlUsd)} {tvlHeat(row.tvlUsd)}
          </div>
        </div>

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
                color: sortBy === 'apy' ? theme.colors.electricCyanLight : theme.colors.textMuted,
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
              <span>{apySortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onToggleTvlSort && onToggleTvlSort()}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                color: sortBy === 'tvl' ? theme.colors.electricCyanLight : theme.colors.textMuted,
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
              <span>{t('tableTvl')}</span>
              <span>{tvlSortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
            </button>
          </div>
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

export default ApyTable;
