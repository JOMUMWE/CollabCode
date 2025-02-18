import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // server: {
  //   allowedHosts: ['5174-jomumwe-collabcode-kswko7rn7zm.ws-eu117.gitpod.io']
  // },
})
