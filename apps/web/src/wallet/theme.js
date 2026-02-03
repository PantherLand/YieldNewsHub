import { darkTheme } from '@rainbow-me/rainbowkit';

// Custom cyberpunk theme for RainbowKit modal
export const cyberpunkTheme = darkTheme({
  accentColor: '#A855F7',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Override specific values for cyberpunk aesthetic
cyberpunkTheme.colors.connectButtonBackground = '#12101F';
cyberpunkTheme.colors.connectButtonBackgroundError = 'rgba(255, 51, 102, 0.15)';
cyberpunkTheme.colors.connectButtonInnerBackground = 'linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #06B6D4 100%)';
cyberpunkTheme.colors.connectButtonText = '#F8FAFC';
cyberpunkTheme.colors.connectButtonTextError = '#FF3366';
cyberpunkTheme.colors.connectionIndicator = '#00FF88';
cyberpunkTheme.colors.modalBackground = '#0D0A1A';
cyberpunkTheme.colors.modalBorder = 'rgba(168, 85, 247, 0.3)';
cyberpunkTheme.colors.modalText = '#F8FAFC';
cyberpunkTheme.colors.modalTextSecondary = '#A0AEC0';
cyberpunkTheme.colors.profileAction = '#12101F';
cyberpunkTheme.colors.profileActionHover = '#1A1730';
cyberpunkTheme.colors.selectedOptionBorder = 'rgba(168, 85, 247, 0.5)';
cyberpunkTheme.colors.standby = '#06B6D4';
cyberpunkTheme.shadows.connectButton = '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.1)';
cyberpunkTheme.shadows.dialog = '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(168, 85, 247, 0.15)';
cyberpunkTheme.shadows.profileDetailsAction = '0 0 10px rgba(168, 85, 247, 0.2)';
cyberpunkTheme.shadows.selectedOption = '0 0 10px rgba(168, 85, 247, 0.3)';
cyberpunkTheme.shadows.selectedWallet = '0 0 10px rgba(168, 85, 247, 0.3)';
cyberpunkTheme.shadows.walletLogo = '0 0 10px rgba(168, 85, 247, 0.2)';

export default cyberpunkTheme;
