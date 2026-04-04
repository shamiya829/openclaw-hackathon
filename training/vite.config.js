import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mort Subite Training',
        short_name: 'MS Training',
        description: 'Staff compliance & training platform',
        theme_color: '#0d0d14',
        background_color: '#0d0d14',
        display: 'standalone',
        start_url: '/',
        icons: []
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
