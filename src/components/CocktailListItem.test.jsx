import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BarContext } from '../contexts/BarContext';
import CocktailListItem from './CocktailListItem';

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
    text: '#EAEAEA', textOffset: '#A0A0A0', onPrimary: '#FFFFFF', onSurface: '#EAEAEA', border: '#3A3F4B', error: '#E74C3C'
  },
  fonts: { main: "'Inter', sans-serif", headings: "'Poppins', sans-serif" },
  spacing: { xs: '4px', small: '8px', medium: '16px', large: '24px' },
  shadows: { small: '0 2px 4px rgba(0,0,0,0.2)', medium: '0 4px 8px rgba(0,0,0,0.3)' },
  borderRadius: '8px',
};

// Custom render function that includes all necessary providers
const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      <MemoryRouter>
        <BarContext.Provider value={providerProps}>
          {ui}
        </BarContext.Provider>
      </MemoryRouter>
    </ThemeProvider>,
    renderOptions
  );
};

describe('CocktailListItem', () => {
  const cocktailWithImage = { id: 'mojito', name: 'Mojito', image: 'mojito.jpg', ingredients: [{ id: 'rum', isEssential: true }] };
  const cocktailWithoutImage = { id: 'daiquiri', name: 'Daiquiri', image: null, ingredients: [{ id: 'gin', isEssential: true }] };

  const defaultProviderProps = {
    barAStock: new Set(),
    barBStock: new Set(),
    isFavorite: () => false,
    toggleFavorite: () => {},
  };

  it('renders cocktail name and link correctly', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithImage} />, { providerProps: defaultProviderProps });
    const linkElement = screen.getByRole('link', { name: /Mojito/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/cocktails/${cocktailWithImage.id}`);
    expect(screen.getByText(cocktailWithImage.name)).toBeInTheDocument();
  });

  it('displays the cocktail image if available', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithImage} />, { providerProps: defaultProviderProps });
    const image = screen.getByAltText(cocktailWithImage.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', `mock_path_to/${cocktailWithImage.image}`);
  });

  it('displays the placeholder image if cocktail image is missing', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithoutImage} />, { providerProps: defaultProviderProps });
    const image = screen.getByAltText(cocktailWithoutImage.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mock_path_to/placeholder.png');
  });

  describe('Bar Availability Icons', () => {
    const cocktailForTest = {
      id: 'test-cocktail',
      name: 'Test Cocktail',
      image: 'test.jpg',
      ingredients: [{ id: 'ingredientA', name: 'Ingredient A', isEssential: true }]
    };

    it('renders correctly when available in Bar A, unavailable in Bar B', () => {
      const providerProps = {
        ...defaultProviderProps,
        barAStock: new Set(['ingredientA']),
        barBStock: new Set(['ingredientB']),
      };
      renderWithProviders(<CocktailListItem cocktail={cocktailForTest} />, { providerProps });
      expect(screen.getByTitle("Level One: Available")).toBeInTheDocument();
      expect(screen.getByTitle("The Glitch: Unavailable")).toBeInTheDocument();
    });

    it('renders correctly when unavailable in Bar A, available in Bar B', () => {
      const providerProps = {
        ...defaultProviderProps,
        barAStock: new Set(['ingredientB']),
        barBStock: new Set(['ingredientA']),
      };
      renderWithProviders(<CocktailListItem cocktail={cocktailForTest} />, { providerProps });
      expect(screen.getByTitle("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByTitle("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders correctly when available in both bars', () => {
      const providerProps = {
        ...defaultProviderProps,
        barAStock: new Set(['ingredientA']),
        barBStock: new Set(['ingredientA']),
      };
      renderWithProviders(<CocktailListItem cocktail={cocktailForTest} />, { providerProps });
      expect(screen.getByTitle("Level One: Available")).toBeInTheDocument();
      expect(screen.getByTitle("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders correctly when unavailable in both bars', () => {
      const providerProps = {
        ...defaultProviderProps,
        barAStock: new Set(['ingredientB']),
        barBStock: new Set(['ingredientC']),
      };
      renderWithProviders(<CocktailListItem cocktail={cocktailForTest} />, { providerProps });
      expect(screen.getByTitle("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByTitle("The Glitch: Unavailable")).toBeInTheDocument();
    });
  });
});
