import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock useLocation
// We need to control the pathname value returned by useLocation
let mockPathname = '/initial';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useLocation: () => ({ pathname: mockPathname }), 
}));

describe('ScrollToTop', () => {
  beforeEach(() => {
    // Reset the mock before each test
    global.scrollTo.mockClear();
  });

  it('calls window.scrollTo(0, 0) on initial render', () => {
    mockPathname = '/initial';
    render(
      <MemoryRouter initialEntries={[mockPathname]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(global.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('calls window.scrollTo(0, 0) when pathname changes', () => {
    mockPathname = '/first-path';
    const { rerender } = render(
      <MemoryRouter initialEntries={[mockPathname]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    // Called once on initial render
    expect(global.scrollTo).toHaveBeenCalledTimes(1);
    expect(global.scrollTo).toHaveBeenLastCalledWith(0, 0);

    // Simulate a path change
    mockPathname = '/second-path';
    
    // Rerender with a new key to ensure the component remounts and useEffect runs,
    // or by directly changing the context if useLocation was provided via a Context Provider.
    // Simply changing mockPathname and calling rerender without a key change might not trigger useEffect
    // if React doesn't see a prop change for ScrollToTop itself.
    // The dependency for useEffect in ScrollToTop is `pathname` from `useLocation()`.
    // We need to make sure useLocation() provides a new value.
    rerender(
      <MemoryRouter initialEntries={[mockPathname]}> {/* initialEntries helps set up the router's internal state */}
        <ScrollToTop />
      </MemoryRouter>
    );
    
    // It should be called again because the pathname (dependency of useEffect) has changed.
    // The key is that the `useLocation` hook itself must return a new `pathname` value.
    // Our mock setup for useLocation ensures it returns the current `mockPathname`.
    expect(global.scrollTo).toHaveBeenCalledTimes(2); // Once for initial, once for path change
    expect(global.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });

  it('calls window.scrollTo(0,0) multiple times for multiple path changes', () => {
    mockPathname = '/path-a';
    const { rerender } = render(
      <MemoryRouter initialEntries={[mockPathname]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(global.scrollTo).toHaveBeenCalledTimes(1);

    mockPathname = '/path-b';
    rerender(
      <MemoryRouter initialEntries={[mockPathname]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(global.scrollTo).toHaveBeenCalledTimes(2);

    mockPathname = '/path-c';
    rerender(
      <MemoryRouter initialEntries={[mockPathname]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(global.scrollTo).toHaveBeenCalledTimes(3);
    expect(global.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });
});
