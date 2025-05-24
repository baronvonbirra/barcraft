// This file is used to set up the testing environment for Vitest with React Testing Library.

// Extends Vitest's `expect` with custom matchers from jest-dom.
// This allows you to use matchers like .toBeInTheDocument(), .toHaveTextContent(), etc.
import '@testing-library/jest-dom';

// You can add other global setup configurations here if needed.
// For example, mocking global objects or setting up MSW (Mock Service Worker).

// Example: Mocking a global function (if you had one)
// global.myGlobalFunction = vi.fn(); // Using Vitest's vi.fn() for mocking

// Clean up after each test (optional, but good practice with Testing Library)
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup();
// });
