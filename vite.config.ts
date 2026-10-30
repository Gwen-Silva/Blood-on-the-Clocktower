import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// CI selects the Pages project path; development remains at the origin root.
const base = process.env.VITE_BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon-source.svg', 'apple-touch-icon.png'],
      workbox: {
        // A release waits until all app windows close. Never interrupt a game.
        skipWaiting: false,
        clientsClaim: false,
        navigateFallback: `${base}index.html`,
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        globIgnores: ['**/game_management.png', '**/roles.png'],
      },
      manifest: {
        name: 'Grimorium',
        short_name: 'Grimorium',
        description: 'A Storyteller companion for Blood on the Clocktower.',
        theme_color: '#0D0D0D',
        background_color: '#0D0D0D',
        display: 'standalone',
        id: base,
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
