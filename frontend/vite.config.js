import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Uporabi runtimeCaching za izključitev API zahtev in drugih datotek
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly', // API zahteve gredo direktno na omrežje, brez predpomnjenja
          },
          {
            urlPattern: /\.(?:map)$/,
            handler: 'NetworkOnly', // Izključi .map datoteke iz predpomnjenja
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'icons/*.png'],
      manifest: {
        name: 'SmartHabit',
        short_name: 'SmartHabit',
        start_url: '/',
        display: 'standalone',
        background_color: '#f3f4f6',
        theme_color: '#60a5fa',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      srcDir: 'public',
      filename: 'service-worker.js',
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
});