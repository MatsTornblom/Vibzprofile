import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use build timestamp only during production builds
const timestamp = process.env.NODE_ENV === 'production' ? new Date().getTime() : 'dev';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        // Add timestamp to chunk names for cache busting in production
        chunkFileNames: `assets/[name]-${timestamp}-[hash].js`,
        entryFileNames: `assets/[name]-${timestamp}-[hash].js`,
        assetFileNames: `assets/[name]-${timestamp}-[hash].[ext]`
      }
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    hmr: {
      clientPort: 443,
      path: 'hmr-ws'
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  }
});