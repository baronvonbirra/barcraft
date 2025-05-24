import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CategoryPage from './CategoryPage';
import { ThemeProvider } from '../contexts/ThemeContext';
import cocktailsData from '../data/cocktails.json'; // Using actual data

// Mock Theme for testing
const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#121212', surface: '#1E1E1E', primary: '#BB86FC', secondary: '#03DAC6',
    text: '#E0E0E0', onPrimary: '#000000', onSurface: '#FFFFFF', border: '#2c2c2c',
  },
  fonts: { main: 'Arial', headings: 'Georgia' },
  spacing: { small: '8px', medium: '16px', large: '24px' },
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
    // The actual component uses categories.json, so 'Rum-based Cocktails' should appear
    expect(screen.getByRole('heading', { name: /Rum-based Cocktails/i })).toBeInTheDocument();

    const categoryCocktails = cocktailsData.filter(c => c.categoryId === testCategoryId);
    categoryCocktails.forEach(cocktail => {
      expect(screen.getByText(cocktail.name)).toBeInTheDocument();
    });
  });

  it('renders links for cocktails with correct href attributes', () => {
    renderWithProviders(<CategoryPage />, { route: `/category/${testCategoryId}`, path: '/category/:categoryId' });
    
    const categoryCocktails = cocktailsData.filter(c => c.categoryId === testCategoryId);
    categoryCocktails.forEach(cocktail => {
      const linkElement = screen.getByRole('link', { name: new RegExp(cocktail.name, 'i') });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/cocktails/${cocktail.id}`);
    });
  });

  it('displays a message or empty list if the category has no cocktails', () => {
    // Mock cocktailsData to be empty for this specific category or filter returns empty
    const originalCocktails = [...cocktailsData]; // simple backup
    cocktailsData.splice(0, cocktailsData.length); // Clear the array
    // Or, more robustly, mock the import:
    // vi.mock('../data/cocktails.json', () => ({ default: [] }));


    renderWithProviders(<CategoryPage />, { route: `/category/${categoryWithNoCocktails}`, path: '/category/:categoryId' });
    
    // Assuming the page title will still render with the category name
    expect(screen.getByRole('heading', { name: new RegExp(categoryWithNoCocktails, 'i') })).toBeInTheDocument();

    // Check that no cocktail names are rendered (or a specific "no cocktails" message if implemented)
    // For example, if Mojito was a rum cocktail, it shouldn't be here now.
    expect(screen.queryByText('Mojito')).not.toBeInTheDocument();
    
    // If you have a specific message, test for it:
    // expect(screen.getByText(/No cocktails found in this category/i)).toBeInTheDocument();
    // For now, we just check that the list is empty by querying for any cocktail item (which might be complex)
    // or by ensuring known cocktail names are not present.

    // Restore original data if modified in-place for other tests in the same file (if not using vi.mock)
     cocktailsData.push(...originalCocktails);
  });

  it('displays a message or empty list for a non-existent category', () => {
    renderWithProviders(<CategoryPage />, { route: `/category/nonexistentcategory`, path: '/category/:categoryId' });
    expect(screen.getByRole('heading', { name: /NONEXISTENTCATEGORY/i })).toBeInTheDocument(); // Based on current component logic
    expect(screen.queryByText('Mojito')).not.toBeInTheDocument(); // No cocktails should be listed
  });
});
