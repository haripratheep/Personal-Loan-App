import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
