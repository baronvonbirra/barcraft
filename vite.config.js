import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Optional: to use Vitest globals like describe, it, expect without importing them
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Path to your setup file
    // You might want to configure other options like coverage here
  },
});
