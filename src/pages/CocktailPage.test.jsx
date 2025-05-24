import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CocktailPage from './CocktailPage';
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

describe('CocktailPage', () => {
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

  const testCocktailId = 'mojito'; // A valid cocktail ID from your data
  const nonExistentCocktailId = 'nonexistentcocktail';

  it('renders details for a valid cocktail', () => {
    renderWithProviders(<CocktailPage />, { route: `/cocktails/${testCocktailId}`, path: '/cocktails/:cocktailId' });

    const cocktail = cocktailsData.find(c => c.id === testCocktailId);
    
    expect(screen.getByRole('heading', { name: new RegExp(cocktail.name, 'i') })).toBeInTheDocument();
    expect(screen.getByAltText(cocktail.name)).toBeInTheDocument(); // Check for the image
    
    cocktail.ingredients.forEach(ingredient => {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    });
    
    expect(screen.getByText(cocktail.instructions)).toBeInTheDocument();
  });

  it('renders a loading or "not found" message for a non-existent cocktail', () => {
    renderWithProviders(<CocktailPage />, { route: `/cocktails/${nonExistentCocktailId}`, path: '/cocktails/:cocktailId' });

    // The CocktailDetail component has a specific message for when a cocktail is not found/loading.
    // "Select a cocktail to see the details, or loading..."
    expect(screen.getByText(/Select a cocktail to see the details, or loading.../i)).toBeInTheDocument();
    
    // Ensure no specific details of another cocktail (e.g., Mojito) are shown
    expect(screen.queryByRole('heading', { name: /Mojito/i })).not.toBeInTheDocument();
  });
});
