import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    // Railway serves the app on a public host; allow this host for Vite preview.
    allowedHosts: ['yieldnewshub-production.up.railway.app'],
  },
});
