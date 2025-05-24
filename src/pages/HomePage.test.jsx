import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { ThemeProvider } from '../contexts/ThemeContext'; // ThemeProvider is needed for styled-components
import categoriesData from '../data/categories.json'; // Using actual data for simplicity here

// Mock the ThemeContext if needed, or wrap with actual ThemeProvider
const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#121212', surface: '#1E1E1E', primary: '#BB86FC', secondary: '#03DAC6',
    text: '#E0E0E0', onPrimary: '#000000', onSurface: '#FFFFFF', border: '#2c2c2c',
  },
  fonts: { main: 'Arial', headings: 'Georgia' },
  spacing: { small: '8px', medium: '16px', large: '24px' },
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
    expect(screen.getByRole('heading', { name: /Cocktail Categories/i })).toBeInTheDocument();
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
      const linkElement = screen.getByRole('link', { name: category.name });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/category/${category.id}`);
    });
  });
});
