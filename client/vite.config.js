import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // 👈 This helps React Router handle direct routes
  },
  build: {
    outDir: 'dist', // This ensures the build files are placed in the "dist" folder
  },
})
