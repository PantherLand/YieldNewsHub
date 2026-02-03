import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    // Railway serves the app on a public host; allow it for Vite preview.
    // You can tighten this to specific domains later.
    allowedHosts: 'all',
  },
});
