import { theme } from './theme.js';

// CSS Animations and Global Styles
export const globalStyles = `
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

  .logo-home-link:hover,
  .logo-home-link:active {
    transform: none !important;
    box-shadow: none !important;
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
`;

export default globalStyles;
