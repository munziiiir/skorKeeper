import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-192x192.png', 'favicon-512x512.png'],
      manifest: {
        name: 'skorKeeper',
        short_name: 'skorKeeper',
        description: 'A fast and simple scoring app',
        start_url: '/',
        display: 'standalone',
        background_color: '#472027',
        theme_color: '#472027',
        icons: [
          {
            src: 'favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
