import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    allowedHosts: ['5173-jomumwe-collabcode-c0ojq6q17ij.ws-eu117.gitpod.io']
  }
})
