import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PokeApp DevOps PWA',
        short_name: 'PokeDevOps',
        description: 'PWA para examen de DevOps',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // Asegúrate de tener estas imágenes en public/
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [{
          // Estrategia de caché para la PokeAPI
          urlPattern: ({ url }) => url.href.includes('pokeapi.co'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        }],
      },
    })
  ],
})