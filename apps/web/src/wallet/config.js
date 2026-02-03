import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, optimism, polygon, base, bsc } from 'wagmi/chains';

// RainbowKit configuration with popular DeFi chains
export const config = getDefaultConfig({
  appName: 'YieldNewsHub',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, arbitrum, optimism, polygon, base, bsc],
  ssr: false,
});
