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
        target: 'https://saas9u.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          'Access-Control-Allow-Credentials': 'true',
          'x-vercel-project-id': 'prj_4BsT4GnZLxvNRyZ3cqieEMDzbJa1'
        }
      }
    }
  }
})