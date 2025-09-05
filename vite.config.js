import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';

// This is the modern, bulletproof way to get the directory name with ES Modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This is the simplified main Vite config file.
// It is now only responsible for your application, not the tests.
export default defineConfig({
  base: '/barcraft/',
  plugins: [react(), svgr()],

  // This alias setup is essential for your application's imports
  // and will be correctly used by your code editor and build process.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['i18next-http-backend'],
  },
});

