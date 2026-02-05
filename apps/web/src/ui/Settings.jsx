import React, { useState } from 'react';
import { theme, styles } from '../styles/index.js';
import { useLanguage } from '../i18n/index.js';
import { API_BASE } from '../config/index.js';

// Settings Component with Cyberpunk styling
export function Settings() {
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
      const r = await fetch(`${API_BASE}/api/integrations/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, botToken, chatId }),
      });
      const j = await r.json();
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
      const r = await fetch(`${API_BASE}/api/integrations/telegram/test`, { method: 'POST' });
      const j = await r.json();
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

export default Settings;
