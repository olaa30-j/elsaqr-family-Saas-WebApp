import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://saas1-five-xi.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        headers: {
          "Access-Control-Allow-Origin": "https://elsaqr-family-saas-web-app-56kk.vercel.app/",
          'Access-Control-Allow-Credentials': 'true',
          'x-vercel-project-id': 'prj_6V4Tsmr9OamQWEBYuvgv6qPVi7ey'
        }
      }
    }
  }
})