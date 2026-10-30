import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execFileSync } from 'node:child_process'

// CI selects the Pages project path; development remains at the origin root.
const base = process.env.VITE_BASE_PATH || '/'
const gitSha = execFileSync(
  'git',
  [
    '-c',
    `safe.directory=${process.cwd().replaceAll('\\', '/')}`,
    'rev-parse',
    'HEAD',
  ],
  { encoding: 'utf8' },
).trim()
if (process.env.GITHUB_SHA && process.env.GITHUB_SHA !== gitSha)
  throw new Error('Build commit does not match the checked-out commit')

// https://vite.dev/config/
export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
  base,
  define: { __BUILD_SHA__: JSON.stringify(gitSha) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icon-source.svg', 'apple-touch-icon.png'],
      workbox: {
        // A release waits until all app windows close. Never interrupt a game.
        skipWaiting: false,
        clientsClaim: false,
        importScripts: ['sw-update-guard.js'],
        navigateFallback: `${base}index.html`,
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        globIgnores: ['**/game_management.png', '**/roles.png'],
      },
      manifest: {
        name: 'Grimorium',
        short_name: 'Grimorium',
        description: 'Um companheiro do Narrador para Blood on the Clocktower.',
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
