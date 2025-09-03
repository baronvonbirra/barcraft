// This file is used to set up the testing environment for Vitest with React Testing Library.

// Extends Vitest's `expect` with custom matchers from jest-dom.
// This allows you to use matchers like .toBeInTheDocument(), .toHaveTextContent(), etc.
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// You can add other global setup configurations here if needed.
// For example, mocking global objects or setting up MSW (Mock Service Worker).
vi.mock('^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$', () => ({
    default: 'test-file-stub',
    __esModule: true,
  }));


// Example: Mocking a global function (if you had one)
// global.myGlobalFunction = vi.fn(); // Using Vitest's vi.fn() for mocking

// Clean up after each test (optional, but good practice with Testing Library)
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup();
// });
