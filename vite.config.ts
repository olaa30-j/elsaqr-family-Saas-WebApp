import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://saas3-mocha.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'x-vercel-project-id': 'prj_cFdrW8o9HEbJ8ARkZMxH0wlEjlzy'
        }
      }
    }
  }
})
