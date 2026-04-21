import { defineConfig } from 'vite';

export default defineConfig({
  base: '/sweets-puzzle/',
  
  server: {
    port: 8080,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
});
