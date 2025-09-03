import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CategoryPage from './CategoryPage';
import { ThemeProvider } from 'styled-components';
import cocktailsData from '../data/cocktails.json'; // Using actual data

// Updated Mock Theme for testing, aligned with new ThemeContext
const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1D24',
    surface: '#282C34',
    primary: '#3498DB',
    secondary: '#1ABC9C',
    text: '#EAEAEA',
    textOffset: '#A0A0A0',
    onPrimary: '#FFFFFF',
    onSurface: '#EAEAEA',
    border: '#3A3F4B',
  },
  fonts: {
    main: "'Inter', sans-serif",
    headings: "'Poppins', sans-serif",
  },
  spacing: {
    xs: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xl: '32px',
    xxl: '48px',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.2)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
  },
  borderRadius: '8px',
};

describe('CategoryPage', () => {
  const renderWithProviders = (ui, { route = '/', path = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <ThemeProvider theme={mockTheme}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  const testCategoryId = 'rum'; // Category that has cocktails
  const categoryWithNoCocktails = 'emptycategory'; // A hypothetical category with no cocktails

  it('renders the category title and lists cocktails for a valid category', () => {
    renderWithProviders(<CategoryPage />, { route: `/category/${testCategoryId}`, path: '/category/:categoryId' });

    // Check for category title (assuming it's derived from categories.json or similar)
    // For this test, we'll check if the categoryId (or a transformed version) is in the title
    // The actual component uses categories.json, so 'Rum Cocktails' should appear
    expect(screen.getByRole('heading', { name: /Rum Cocktails/i })).toBeInTheDocument();

    const categoryCocktails = cocktailsData.filter(c => c.categoryId === testCategoryId);
    categoryCocktails.forEach(cocktail => {
      // CocktailListItem might have image alt text, so use regex for name matching
      expect(screen.getByText(new RegExp(cocktail.name, 'i'))).toBeInTheDocument();
    });
  });

  it('renders links for cocktails with correct href attributes', () => {
    renderWithProviders(<CategoryPage />, { route: `/category/${testCategoryId}`, path: '/category/:categoryId' });
    
    const categoryCocktails = cocktailsData.filter(c => c.categoryId === testCategoryId);
    categoryCocktails.forEach(cocktail => {
      // Use RegExp for link name to accommodate potential icon alt text from CocktailListItem
      const escapedCocktailName = cocktail.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkElement = screen.getByRole('link', { name: new RegExp(escapedCocktailName, 'i') });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/cocktails/${cocktail.id}`);
    });
  });

  it('displays "Category Not Found" for a category ID not in categories.json (simulating no cocktails for it)', () => {
    // This test uses 'emptycategory' which is not in categoriesData.json
    // So, the component should render the "Category Not Found" state.
    // The original test's attempt to clear cocktailsData globally was problematic.
    renderWithProviders(<CategoryPage />, { route: `/category/${categoryWithNoCocktails}`, path: '/category/:categoryId' });
    
    expect(screen.getByRole('heading', { name: /Category Not Found/i })).toBeInTheDocument();
    expect(screen.getByText(/The category "emptycategory" does not exist/i)).toBeInTheDocument();
    expect(screen.queryByText('Mojito')).not.toBeInTheDocument();
  });

  it('displays a "category not found" message for a non-existent category', () => {
    renderWithProviders(<CategoryPage />, { route: `/category/nonexistentcategory`, path: '/category/:categoryId' });
    // Assuming CategoryPage shows a specific message for a category ID that doesn't match any in categories.json
    expect(screen.getByRole('heading', { name: /Category Not Found/i })).toBeInTheDocument();
    expect(screen.getByText(/The category "nonexistentcategory" does not exist./i)).toBeInTheDocument();
    expect(screen.queryByText('Mojito')).not.toBeInTheDocument(); // No cocktails should be listed
  });
});
