import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

global.scrollTo = vi.fn();

let mockPathname = '/initial';
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: () => ({ pathname: mockPathname }),
    };
});

describe('ScrollToTop', () => {
  beforeEach(() => {
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
    expect(global.scrollTo).toHaveBeenCalledTimes(1);
    expect(global.scrollTo).toHaveBeenLastCalledWith(0, 0);

    mockPathname = '/second-path';
    
    rerender(
      <MemoryRouter initialEntries={[mockPathname]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    
    expect(global.scrollTo).toHaveBeenCalledTimes(2);
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
