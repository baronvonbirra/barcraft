import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { ThemeProvider } from 'styled-components'; // ThemeProvider is needed for styled-components
import categoriesData from '@/data/categories.json'; // Using actual data for simplicity here

import cocktailsData from '@/data/cocktails.json'; // Import cocktails data
import placeholderImage from '@/assets/cocktails/placeholder.png'; // Direct import for mocking

// Updated Mock Theme for testing, aligned with new ThemeContext
const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1D24', surface: '#282C34', primary: '#3498DB', secondary: '#1ABC9C',
    text: '#EAEAEA', textOffset: '#A0A0A0', onPrimary: '#FFFFFF', onSurface: '#EAEAEA', border: '#3A3F4B',
  },
  fonts: { main: "'Inter', sans-serif", headings: "'Poppins', sans-serif" },
  spacing: { xs: '4px', small: '8px', medium: '16px', large: '24px', xl: '32px', xxl: '48px' },
  shadows: { small: '0 2px 4px rgba(0,0,0,0.2)', medium: '0 4px 8px rgba(0,0,0,0.3)' },
  borderRadius: '8px',
};

// Mock categories.json if it were a dynamic import or fetch
// vi.mock('../data/categories.json', () => ({
//   default: [
//     { id: 'rum', name: 'Rum-based Cocktails' },
//     { id: 'whiskey', name: 'Whiskey-based Cocktails' },
//   ],
// }));

describe('HomePage', () => {
  const renderWithProviders = (ui) => {
    return render(
      <ThemeProvider theme={mockTheme}> {/* Use mockTheme or a simplified theme for testing */}
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  it('renders the main heading', () => {
    renderWithProviders(<HomePage />);
    // Check for the new section titles
    expect(screen.getByRole('heading', { name: /Cocktail of the Week/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Or Browse by Category/i })).toBeInTheDocument();
  });

  it('renders a list of categories', () => {
    renderWithProviders(<HomePage />);
    // Check for a few category names from the actual data
    categoriesData.slice(0, 3).forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('renders links for categories with correct href attributes', () => {
    renderWithProviders(<HomePage />);
    categoriesData.forEach(category => {
      // Escape special characters in category.name for RegExp
      const escapedCategoryName = category.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match category name within the link's accessible name, accommodating icon alt text
      const linkElement = screen.getByRole('link', { name: new RegExp(escapedCategoryName, 'i') });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/category/${category.id}`);
    });
  });

  describe('Cocktail of the Week Section', () => {
    const featuredCocktail = cocktailsData[0];

    it('renders the section title', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByRole('heading', { name: /Cocktail of the Week/i })).toBeInTheDocument();
    });

    it('displays the featured cocktail\'s name', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByRole('heading', { name: new RegExp(featuredCocktail.name, 'i') })).toBeInTheDocument();
    });

    it('displays the featured cocktail\'s image', () => {
      renderWithProviders(<HomePage />);
      const image = screen.getByAltText(new RegExp(featuredCocktail.name, 'i'));
      expect(image).toBeInTheDocument();
      if (featuredCocktail.image) {
        expect(image).toHaveAttribute('src', featuredCocktail.image);
      } else {
        expect(image).toHaveAttribute('src', placeholderImage);
      }
    });

    it('displays the featured cocktail\'s description', () => {
      renderWithProviders(<HomePage />);
      // Using a regex to find part of the description, as it might be long
      expect(screen.getByText(new RegExp(featuredCocktail.description.substring(0, 50), 'i'))).toBeInTheDocument();
    });

    it('renders a "View Recipe" link pointing to the correct cocktail detail page', () => {
      renderWithProviders(<HomePage />);
      const linkElement = screen.getByRole('link', { name: /View Recipe/i });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/cocktails/${featuredCocktail.id}`);
    });
  });
});
