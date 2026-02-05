import React, { useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/index.js';
import { theme, styles, globalStyles } from '../styles/index.js';
import { useAppStore, useApyStore, useNewsStore, useStrategyStore } from '../stores/index.js';
import { fetchApyData, fetchNewsData, fetchNewsDetail, fetchStrategies } from '../api/index.js';
import { buildNewsSignature } from '../utils/index.js';
import { useInterval } from '../hooks/index.js';
import { POLLING_INTERVALS } from '../config/index.js';
import { parseAppRoute } from './routes.js';

// Components
import { LogoIcon, StatsBar } from '../components/index.js';
import { WalletConnectButton } from '../wallet/WalletConnectButton.jsx';
import { LanguageToggle } from './LanguageToggle.jsx';
import ApyTable from './ApyTable.jsx';
import Settings from './Settings.jsx';
import StrategyPage from './StrategyPage.jsx';
import { NewsList } from './news/NewsList.jsx';
import { NewsDetail } from './news/NewsDetail.jsx';

// Main App Component
function App() {
  const { t, language } = useLanguage();

  // Zustand stores
  const {
    tab,
    selectedNewsId,
    err,
    changeTab,
    openNewsDetail,
    syncFromRoute,
    setError,
    clearError,
  } = useAppStore();

  const {
    apy,
    setApy,
    apyFilter,
    setApyFilter,
    minTvl,
    setMinTvl,
    minApy,
    setMinApy,
    selectedChain,
    setSelectedChain,
    sortBy,
    apySortDirection,
    tvlSortDirection,
    toggleApySort,
    toggleTvlSort,
    getFilteredApy,
    getAvailableChains,
  } = useApyStore();

  const {
    news,
    pendingNews,
    hasPendingNewsUpdate,
    minScore,
    setNews,
    setPendingNews,
    setMinScore,
    applyPendingNews,
    setSelectedNewsFromRoute,
    getSelectedNewsItem,
  } = useNewsStore();

  const {
    strategies,
    strategiesLoading,
    setStrategies,
    setStrategiesLoading,
  } = useStrategyStore();

  // Computed values
  const filteredApy = useMemo(() => getFilteredApy(), [apy, apyFilter, selectedChain, minTvl, minApy, sortBy, apySortDirection, tvlSortDirection]);
  const availableChains = useMemo(() => getAvailableChains(), [apy]);
  const selectedNewsItem = useMemo(() => getSelectedNewsItem(selectedNewsId), [news, selectedNewsId]);

  // Tab definitions
  const tabs = useMemo(() => [
    { id: 'apy', name: t('tabYields'), icon: '$' },
    { id: 'strategy', name: t('tabStrategies'), icon: '%' },
    { id: 'news', name: t('tabNews'), icon: '#' },
    { id: 'settings', name: t('tabConfig'), icon: '*' },
  ], [t]);

  // Data loading functions
  async function loadApy() {
    const data = await fetchApyData(50);
    setApy(data);
  }

  async function loadNews() {
    const data = await fetchNewsData(minScore, language, 80);
    setNews(data);
  }

  async function loadStrategies() {
    setStrategiesLoading(true);
    try {
      const data = await fetchStrategies(10);
      setStrategies(data);
    } finally {
      setStrategiesLoading(false);
    }
  }

  async function refreshData() {
    clearError();
    try {
      await loadApy();
    } catch (e) {
      setError(e.message);
    }
  }

  async function checkNewsUpdates() {
    try {
      const fresh = await fetchNewsData(minScore, language, 80);
      const oldSig = buildNewsSignature(news);
      const newSig = buildNewsSignature(fresh);
      if (oldSig !== newSig) {
        setPendingNews(fresh);
      }
    } catch {
      // Silently ignore polling errors
    }
  }

  async function loadNewsDetailFromRoute(newsId) {
    if (!newsId) return;
    const existing = news.find((item) => String(item.id) === String(newsId));
    if (existing) {
      setSelectedNewsFromRoute(existing);
      return;
    }
    try {
      const item = await fetchNewsDetail(newsId);
      setSelectedNewsFromRoute(item);
    } catch {
      // Silently ignore
    }
  }

  // Initial data load
  useEffect(() => {
    refreshData();
  }, []);

  // Route sync on mount and popstate
  useEffect(() => {
    syncFromRoute();
    const handlePopState = () => syncFromRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (tab === 'news') loadNews().catch(() => {});
    if (tab === 'strategy' && strategies.length === 0) loadStrategies().catch(() => {});
  }, [tab, minScore, language]);

  // Load news detail when selected from route
  useEffect(() => {
    if (tab === 'news' && selectedNewsId) {
      loadNewsDetailFromRoute(selectedNewsId);
    }
  }, [tab, selectedNewsId, news]);

  // News polling
  useInterval(() => checkNewsUpdates(), POLLING_INTERVALS.news, tab === 'news');

  return (
    <div style={styles.container}>
      {/* Cyberpunk background effects */}
      <div style={styles.gridPattern} />
      <div style={styles.glowOverlay} />
      <div style={styles.scanlines} />

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header} className="app-header">
          <button
            type="button"
            onClick={() => changeTab('apy')}
            style={{ ...styles.logo, ...styles.logoButton }}
            className="app-logo logo-home-link"
            aria-label="Go to homepage"
          >
            <div style={styles.logoIcon} className="logo-icon">
              <LogoIcon size={52} />
            </div>
            <div className="logo-text">
              <h1 style={styles.title} className="app-title">{t('title')}</h1>
              <div style={styles.subtitle} className="app-subtitle">{t('subtitle')}</div>
            </div>
          </button>

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

              {/* Chain Filter */}
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
                      <option key={chain} value={chain}>{chain}</option>
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
                }}>{t('filterMinTvl')}</span>
                <input
                  type="number"
                  value={minTvl}
                  onChange={(e) => setMinTvl(Number(e.target.value))}
                  style={{
                    width: '80px',
                    padding: '8px 12px',
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.bgInput,
                    color: theme.colors.neonGreen,
                    fontSize: '14px',
                    fontFamily: theme.fonts.mono,
                    fontWeight: 600,
                    outline: 'none',
                    textAlign: 'center',
                  }}
                  min={0}
                />
                <span style={{ color: theme.colors.textMuted, fontSize: '11px' }}>M</span>
              </div>

              {/* APY Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <span style={{
                  color: theme.colors.textMuted,
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>{t('filterMinApy')}</span>
                <input
                  type="number"
                  value={minApy}
                  onChange={(e) => setMinApy(Number(e.target.value))}
                  style={{
                    width: '80px',
                    padding: '8px 12px',
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.bgInput,
                    color: theme.colors.neonGreen,
                    fontSize: '14px',
                    fontFamily: theme.fonts.mono,
                    fontWeight: 600,
                    outline: 'none',
                    textAlign: 'center',
                  }}
                  min={0}
                />
                <span style={{ color: theme.colors.textMuted, fontSize: '11px' }}>%</span>
              </div>

              {/* Pool count */}
              <div style={{
                marginLeft: 'auto',
                color: theme.colors.textMuted,
                fontSize: '12px',
                fontFamily: theme.fonts.mono,
              }}>
                {filteredApy.length} {t('poolsUnit')}
              </div>
            </div>

            {/* APY Table */}
            <ApyTable
              data={filteredApy}
              sortBy={sortBy}
              apySortDirection={apySortDirection}
              tvlSortDirection={tvlSortDirection}
              onToggleApySort={toggleApySort}
              onToggleTvlSort={toggleTvlSort}
            />
          </div>
        )}

        {tab === 'strategy' && <StrategyPage groups={strategies} loading={strategiesLoading} t={t} />}

        {tab === 'news' && (
          selectedNewsItem ? (
            <NewsDetail
              item={selectedNewsItem}
              onBack={() => changeTab('news')}
            />
          ) : (
            <NewsList
              data={news}
              minScore={minScore}
              setMinScore={setMinScore}
              hasPendingUpdate={hasPendingNewsUpdate}
              pendingCount={pendingNews.length}
              onLoadUpdates={applyPendingNews}
              onViewDetail={openNewsDetail}
            />
          )
        )}

        {tab === 'settings' && <Settings />}

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
            }}>{import.meta.env.VITE_API_BASE || 'http://localhost:8787'}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontFamily: theme.fonts.mono }}>// Built for DeFi</span>
            <span style={styles.badge('pink')}>v1.0</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{globalStyles}</style>
    </div>
  );
}

export default App;
