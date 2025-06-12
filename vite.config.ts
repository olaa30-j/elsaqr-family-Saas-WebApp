import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['swiper'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://sass35.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          'Access-Control-Allow-Credentials': 'true',
          'x-vercel-project-id': 'prj_VaPLcjU0YuySg8W4r9muXxSohZYr'
        }
      }
    }
  }
})