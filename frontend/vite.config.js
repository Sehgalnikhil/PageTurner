import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['react-icons'],
          'vendor-ui': ['notistack'],
          'vendor-net': ['axios'],
        },
      },
    },
  },
  server: {
    warmup: {
      clientFiles: ['./src/main.jsx', './src/App.jsx', './src/pages/Home.jsx'],
    },
  },
});
