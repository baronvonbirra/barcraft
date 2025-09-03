import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CocktailPage from './CocktailPage';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BarContext } from '../contexts/BarContext';
import cocktailsData from '../data/cocktails.json';

// Mock data and utilities
jest.mock('../data/bar_specific_data.json', () => ({
  bar1: { barName: "Level One" },
  bar2: { barName: "The Glitch" }
}), { virtual: true });

jest.mock('../utils/cocktailImageLoader.js', () => ({
  getImageUrl: jest.fn((imageName) => imageName ? `mock_path_to/${imageName}` : 'mock_path_to/placeholder.png'),
}));

const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1D24', surface: '#282C34', primary: '#3498DB', secondary: '#1ABC9C',
    text: '#EAEAEA', textOffset: '#A0A0A0', onPrimary: '#FFFFFF', onSurface: '#EAEAEA', border: '#3A3F4B', error: '#D32F2F'
  },
  fonts: { main: "'Inter', sans-serif", headings: "'Poppins', sans-serif" },
  spacing: { xs: '4px', small: '8px', medium: '16px', large: '24px' },
  shadows: { small: '0 2px 4px rgba(0,0,0,0.2)', medium: '0 4px 8px rgba(0,0,0,0.3)' },
  borderRadius: '8px',
};

describe('CocktailPage', () => {
  const defaultProviderProps = {
    barAStock: new Set(),
    barBStock: new Set(),
    isFavorite: () => false,
    toggleFavorite: () => {},
  };

  const renderWithProviders = (ui, { route = '/', path = '/', providerProps = defaultProviderProps } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <ThemeProvider theme={mockTheme}>
        <BarContext.Provider value={providerProps}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={ui} />
            </Routes>
          </MemoryRouter>
        </BarContext.Provider>
      </ThemeProvider>
    );
  };

  const testCocktailId = 'mojito';
  const nonExistentCocktailId = 'nonexistentcocktail';

  it('renders "cocktail not found" message for a non-existent cocktail', () => {
    renderWithProviders(<CocktailPage />, { route: `/cocktails/${nonExistentCocktailId}`, path: '/cocktails/:cocktailId' });
    expect(screen.getByText(/Cocktail not found/i)).toBeInTheDocument();
  });

  describe('AllBarsAvailability Section', () => {
    const mojito = cocktailsData.find(c => c.id === 'mojito');
    const essentialIngredient = mojito.ingredients.find(ing => ing.isEssential).id;

    it('renders correctly when available in Bar A, unavailable in Bar B', () => {
      const providerProps = { ...defaultProviderProps, barAStock: new Set([essentialIngredient]) };
      renderWithProviders(<CocktailPage />, { route: `/cocktails/${testCocktailId}`, path: '/cocktails/:cocktailId', providerProps });
      expect(screen.getByText("Level One: Available")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Unavailable")).toBeInTheDocument();
    });

    it('renders correctly when unavailable in Bar A, available in Bar B', () => {
      const providerProps = { ...defaultProviderProps, barBStock: new Set([essentialIngredient]) };
      renderWithProviders(<CocktailPage />, { route: `/cocktails/${testCocktailId}`, path: '/cocktails/:cocktailId', providerProps });
      expect(screen.getByText("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders correctly when available in both bars', () => {
      const providerProps = { ...defaultProviderProps, barAStock: new Set([essentialIngredient]), barBStock: new Set([essentialIngredient]) };
      renderWithProviders(<CocktailPage />, { route: `/cocktails/${testCocktailId}`, path: '/cocktails/:cocktailId', providerProps });
      expect(screen.getByText("Level One: Available")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders correctly when unavailable in both bars', () => {
      renderWithProviders(<CocktailPage />, { route: `/cocktails/${testCocktailId}`, path: '/cocktails/:cocktailId' });
      expect(screen.getByText("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Unavailable")).toBeInTheDocument();
    });
  });
});
