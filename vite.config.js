import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    'import.meta.env.VITE_AWS_REGION': JSON.stringify(env.VITE_AWS_REGION),
    'import.meta.env.VITE_AWS_USER_POOL_ID': JSON.stringify(env.VITE_AWS_USER_POOL_ID),
    'import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID': JSON.stringify(env.VITE_AWS_USER_POOL_CLIENT_ID)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          aws: ['aws-amplify'],
          charts: ['chart.js', 'react-chartjs-2', 'echarts', 'echarts-for-react']
        }
      }
    },
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'DENY'
    }
  },
  preview: {
    port: 4173,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'DENY'
    }
  }
}})

