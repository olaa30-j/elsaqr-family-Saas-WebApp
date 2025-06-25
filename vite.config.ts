import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['swiper'],
  },
  server: {
    proxy: {
      '/google-script': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/google-script/, ''),
        headers: {
          "Origin": "https://elsaqr-family-saas-web-app-56kk.vercel.app",
          "Access-Control-Allow-Origin": "https://elsaqr-family-saas-web-app-56kk.vercel.app",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "x-vercel-project-id": "prj_cvNtKP4hZcK2nwGOm04G0N4FyxLr"
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://elsaqr-family-saas-web-app-56kk.vercel.app');
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://elsaqr-family-saas-web-app-56kk.vercel.app';
          });
        }
      },
      '/api': {
        target: 'https://backend-tests-delta.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        headers: {
          "x-vercel-project-id": "prj_a8J10S0lW2iSCK4mDyT3PHAYx6Lv"
        }
      }
    },
    cors: {
      origin: 'http://localhost:5173',
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  }
});