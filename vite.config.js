import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '');
  const backendUrl = env.VITE_API_BASE_URL || 'https://claim-processing-langgraph.vercel.app';

  return defineConfig({
    plugins: [react()],
    build: {
      target: 'es2015',
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
          warn(warning)
        },
      },
    },
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