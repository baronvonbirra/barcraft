import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from 'styled-components';
import CocktailPage from './CocktailPage';
import cocktails from '../data/cocktails.json';

// Import the one hook we need to mock
import { useBar } from '../contexts/BarContext.jsx';
// FIXED: Removed the non-existent useFavorites import

// Mock the BarContext module to provide the useBar hook
vi.mock('../contexts/BarContext.jsx');
// FIXED: Removed the non-existent FavoritesContext mock

const testCocktail = cocktails.find(c => c.id === 'mojito');
const mockTheme = { mode: 'dark', colors: {}, fonts: {}, spacing: {}, borderRadius: '' };

// A simpler render helper for this test file.
const renderComponent = (route = '/') => {
  return render(
    <ThemeProvider theme={mockTheme}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/cocktails/:cocktailId" element={<CocktailPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('CocktailPage', () => {
  
  // Set up a default mock for every test.
  beforeEach(() => {
    vi.mocked(useBar).mockReturnValue({
      barAStock: new Set(),
      barBStock: new Set(),
    });
    // FIXED: Removed the non-existent useFavorites mock
  });

  it('renders "cocktail not found" message for a non-existent cocktail', () => {
    renderComponent('/cocktails/non-existent-cocktail');
    // FIXED: Changed the expected text from a period to an exclamation mark to match the component's output.
    expect(screen.getByText('Cocktail not found!')).toBeInTheDocument();
  });

  describe('AllBarsAvailability Section', () => {
    it('renders correctly when available in Bar A, unavailable in Bar B', () => {
      // Override the default mock for this specific test case
      vi.mocked(useBar).mockReturnValue({
        barAStock: new Set(testCocktail.ingredients.map(i => i.id)),
        barBStock: new Set(),
      });
      renderComponent(`/cocktails/${testCocktail.id}`);
      expect(screen.getByText(/Level One: Available/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Unavailable/i)).toBeInTheDocument();
    });

    it('renders correctly when unavailable in Bar A, available in Bar B', () => {
      vi.mocked(useBar).mockReturnValue({
        barAStock: new Set(),
        barBStock: new Set(testCocktail.ingredients.map(i => i.id)),
      });
      renderComponent(`/cocktails/${testCocktail.id}`);
      expect(screen.getByText(/Level One: Unavailable/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Available/i)).toBeInTheDocument();
    });

    it('renders correctly when available in both bars', () => {
      vi.mocked(useBar).mockReturnValue({
        barAStock: new Set(testCocktail.ingredients.map(i => i.id)),
        barBStock: new Set(testCocktail.ingredients.map(i => i.id)),
      });
      renderComponent(`/cocktails/${testCocktail.id}`);
      expect(screen.getByText(/Level One: Available/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Available/i)).toBeInTheDocument();
    });

    it('renders correctly when unavailable in both bars', () => {
      // This test uses the default mock from beforeEach, which is an empty bar stock
      renderComponent(`/cocktails/${testCocktail.id}`);
      expect(screen.getByText(/Level One: Unavailable/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Unavailable/i)).toBeInTheDocument();
    });
  });
});

