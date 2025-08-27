import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['socket.io-client', '@apollo/client', 'graphql'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  }
})
