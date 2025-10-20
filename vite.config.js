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
          aws: ['aws-amplify']
        }
      }
    },
    sourcemap: false
  },
  server: {
    host: '0.0.0.0',  // Aceitar conexões de qualquer IP
    port: 5173,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block'
    }
  }
}})

