import React from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './wallet/config.js';
import { cyberpunkTheme } from './wallet/theme.js';
import { LanguageProvider } from './i18n/index.js';
import App from './ui/App.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <RainbowKitProvider theme={cyberpunkTheme} modalSize="compact">
            <App />
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </React.StrictMode>
);
