import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Cyberpunk theme tokens (matching App.jsx design system)
const theme = {
  colors: {
    cyberPurple: '#A855F7',
    cyberPurpleDark: '#7C3AED',
    electricCyan: '#06B6D4',
    electricCyanLight: '#22D3EE',
    neonGreen: '#00FF88',
    bgCard: '#12101F',
    bgInput: '#0F0D1A',
    textPrimary: '#F8FAFC',
    textSecondary: '#A0AEC0',
    textMuted: '#64748B',
    border: 'rgba(168, 85, 247, 0.2)',
    borderHover: 'rgba(168, 85, 247, 0.5)',
    gradientPrimary: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #06B6D4 100%)',
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.1)',
  },
  fonts: {
    mono: "'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace",
  },
  radius: {
    md: '12px',
    full: '9999px',
  },
  transition: {
    fast: 'all 0.15s ease-out',
  },
};

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.gradientPrimary,
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: theme.transition.fast,
                      boxShadow: theme.colors.glowPurple,
                      fontFamily: 'inherit',
                    }}
                  >
                    <WalletIcon />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: theme.radius.md,
                      border: '1px solid rgba(255, 51, 102, 0.5)',
                      background: 'rgba(255, 51, 102, 0.15)',
                      color: '#FF3366',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: theme.transition.fast,
                      fontFamily: 'inherit',
                    }}
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Chain Button */}
                  <button
                    onClick={openChainModal}
                    type="button"
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
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: theme.transition.fast,
                      fontFamily: 'inherit',
                    }}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: chain.iconBackground,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 18, height: 18 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  {/* Account Button */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.borderHover}`,
                      background: theme.colors.bgCard,
                      color: theme.colors.textPrimary,
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: theme.transition.fast,
                      fontFamily: theme.fonts.mono,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: theme.colors.neonGreen,
                        boxShadow: `0 0 8px ${theme.colors.neonGreen}`,
                      }}
                    />
                    {account.displayName}
                    {account.displayBalance && (
                      <span style={{ color: theme.colors.textMuted, marginLeft: '4px' }}>
                        ({account.displayBalance})
                      </span>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

// Wallet Icon SVG
function WalletIcon() {
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
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

export default WalletConnectButton;
