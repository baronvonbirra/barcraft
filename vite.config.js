// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path'; // Make sure to import the 'path' module

export default defineConfig({
  base: '/barcraft/',
  plugins: [react(), svgr()],

  // This block sets up the '@' path alias for the entire application and tests.
  // This was the missing piece of the configuration.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // This block is the corrected configuration for Vitest.
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,

    // This mapper solves all static asset import errors,
    // including the conflict with the svgr plugin.
    moduleNameMapper: {
      // Mocks files imported as URLs (e.g., import img from './logo.png')
      '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/fileMock.js',

      // Mocks SVGs imported as React Components (e.g., import { ReactComponent as Logo } from './logo.svg')
      '\\.svg$': '<rootDir>/svgrMock.js',
    },
  },
});
