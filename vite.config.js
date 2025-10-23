import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 8002,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  define: {
    'TURNSTILE_SITE_KEY': JSON.stringify(process.env.VITE_TURNSTILE_SITE_KEY || '')
  }
})
