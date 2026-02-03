import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

function fmtUsd(x) {
  if (x == null || Number.isNaN(Number(x))) return '-';
  const v = Number(x);
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`;
  return `$${v.toFixed(2)}`;
}

function App() {
  const [tab, setTab] = useState('apy');
  const [apy, setApy] = useState([]);
  const [news, setNews] = useState([]);
  const [minScore, setMinScore] = useState(6);
  const [err, setErr] = useState('');

  const tabs = useMemo(() => [
    { id: 'apy', name: 'Stablecoin APY' },
    { id: 'news', name: 'Market News' },
    { id: 'settings', name: 'Settings' },
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

  useEffect(() => {
    (async () => {
      try {
        setErr('');
        await loadApy();
        await loadNews();
      } catch (e) {
        setErr(String(e?.message || e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === 'news') loadNews().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minScore, tab]);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial', padding: 18, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ margin: '6px 0 6px' }}>YieldNewsHub</h1>
      <div style={{ color: '#666', marginBottom: 14 }}>Low-risk stable APY aggregation + market-moving news (MVP)</div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #ddd', background: tab === t.id ? '#111' : '#fff', color: tab === t.id ? '#fff' : '#111', cursor: 'pointer' }}>
            {t.name}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => (tab === 'apy' ? loadApy() : loadNews())}
          style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {err ? <div style={{ padding: 10, border: '1px solid #f3c', color: '#a00', borderRadius: 10, marginBottom: 12 }}>{err}</div> : null}

      {tab === 'apy' && (
        <div style={{ border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr 0.6fr 0.8fr 1fr', padding: '10px 12px', background: '#fafafa', borderBottom: '1px solid #eee', fontWeight: 700 }}>
            <div>Provider</div>
            <div>Symbol</div>
            <div>APY</div>
            <div>TVL</div>
            <div>Risk Note</div>
          </div>
          {apy.map(row => (
            <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr 0.6fr 0.8fr 1fr', padding: '10px 12px', borderBottom: '1px solid #f1f1f1' }}>
              <div>
                <div style={{ fontWeight: 650 }}>{row.provider}</div>
                <div style={{ color: '#666', fontSize: 12 }}>{row.chain || '—'}</div>
              </div>
              <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{row.symbol}</div>
              <div style={{ fontWeight: 700 }}>{(row.apy ?? 0).toFixed(2)}%</div>
              <div>{fmtUsd(row.tvlUsd)}</div>
              <div style={{ color: '#444', fontSize: 13 }}>{row.riskNote || '—'}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'news' && (
        <div>
          <div style={{ marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ color: '#444' }}>Min score:</div>
            <input type="number" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} style={{ width: 90, padding: 8, borderRadius: 10, border: '1px solid #ddd' }} />
            <div style={{ color: '#666', fontSize: 12 }}>Higher = more important (keyword-based MVP)</div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {news.map(item => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer"
                style={{ padding: 12, borderRadius: 12, border: '1px solid #eee', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontWeight: 750 }}>{item.title}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>score {item.score}</div>
                </div>
                <div style={{ color: '#666', marginTop: 4, fontSize: 12 }}>
                  {item.source?.name || '—'} · {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '—'}
                </div>
                {item.summary ? <div style={{ marginTop: 8, color: '#444' }}>{item.summary}</div> : null}
                {item.tags?.length ? (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {item.tags.map(t => (
                      <span key={t} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, border: '1px solid #eee', color: '#555' }}>{t}</span>
                    ))}
                  </div>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <Settings apiBase={API_BASE} />
      )}

      <div style={{ marginTop: 18, color: '#777', fontSize: 12 }}>
        Server: <code>{API_BASE}</code>
      </div>
    </div>
  );
}

function Settings({ apiBase }) {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [msg, setMsg] = useState('');

  async function save() {
    setMsg('Saving...');
    const r = await fetch(`${apiBase}/api/integrations/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, botToken, chatId }),
    });
    const j = await r.json();
    setMsg(j.ok ? 'Saved.' : `Error: ${JSON.stringify(j)}`);
  }

  async function test() {
    setMsg('Sending test...');
    const r = await fetch(`${apiBase}/api/integrations/telegram/test`, { method: 'POST' });
    const j = await r.json();
    setMsg(JSON.stringify(j));
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 14 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>Telegram Integration (optional, global)</div>
      <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Enable Telegram pushes for important news
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Bot Token</div>
          <input value={botToken} onChange={(e) => setBotToken(e.target.value)} placeholder="123:ABC..." style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Chat ID</div>
          <input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="-100..." style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
        </div>
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <button onClick={save} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #ddd', background: '#111', color: '#fff' }}>Save</button>
        <button onClick={test} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #ddd', background: '#fff' }}>Send test</button>
        <div style={{ color: '#666', fontSize: 12, alignSelf: 'center' }}>{msg}</div>
      </div>
      <div style={{ marginTop: 10, color: '#777', fontSize: 12 }}>
        Note: for MVP this stores Telegram credentials in the database.
      </div>
    </div>
  );
}

export default App;
