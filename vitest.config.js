import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// This is the modern, bulletproof way to get the directory name with ES Modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    
    // This is the direct, manual alias that Vitest needs.
    // By defining it here explicitly, we remove all guesswork.
    alias: {
      '@': path.resolve(__dirname, './src'),
    },

    // This module mapper for assets is still correct.
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/fileMock.js',
      '\\.svg$': '<rootDir>/svgrMock.js',
    },
  },
});