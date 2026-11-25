import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sandbox-only overrides. Unset (or any value other than "1") keeps Vite defaults.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1'
const sandboxDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // The preview proxy forwards a rotating <port>-<sandbox>.domain host; allow the wildcard
    // plus the additional-hosts env var Vite reads on its own.
    allowedHosts:
      previewMode && sandboxDomain ? [`.${sandboxDomain}`, 'localhost', '127.0.0.1'] : undefined,
    watch: previewMode ? { usePolling: true, interval: 300 } : undefined,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
