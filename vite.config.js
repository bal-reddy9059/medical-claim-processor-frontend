import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: false,
      host: 'localhost',
      proxy: {
        '/health': { target: backendUrl, changeOrigin: true, secure: false },
        '/api': { target: backendUrl, changeOrigin: true, secure: false },
      },
    },
  });
}