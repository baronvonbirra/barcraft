import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { vi } from 'vitest';
import CocktailDetail from './CocktailDetail';

// Manually mock the image import to bypass the import issue.
vi.mock('../assets/cocktails/placeholder.jpg', () => ({
  default: 'mocked-placeholder-image.jpg',
}));

const mockTheme = {
  spacing: { xs: '0.25rem', small: '0.5rem', medium: '1rem', large: '1.5rem' },
  colors: { 
    surface: '#282C34', 
    border: '#3A3F4B', 
    text: '#EAEAEA', 
    primary: '#3498DB', 
    secondary: '#1ABC9C',
    background: '#1A1D24',
    textOffset: '#A0A0A0',
    onPrimary: '#FFFFFF'
  },
  fonts: { main: 'Arial, sans-serif', headings: 'Poppins, sans-serif' },
  borderRadius: '8px',
  shadows: { medium: '0 4px 6px rgba(0,0,0,0.1)' }
};

const baseCocktailData = {
  id: 'test-cocktail',
  name: 'Test Cocktail',
  image: 'test.jpg',
  description: 'A test description.',
  history: 'A test history.',
  difficulty: 'Easy',
  flavorProfile: ['Sweet', 'Sour'],
  tags: ['Test', 'Mock'],
  ingredients: [{ name: 'Test Ingredient', quantity: '1' }],
  toolsNeeded: ['Shaker'],
  instructions: 'Mix it well.'
};

describe('CocktailDetail', () => {
  it('renders cocktail details correctly with a single glass type', () => {
    const cocktailWithSingleGlass = {
      ...baseCocktailData,
      glass: 'Highball glass',
    };
    render(
      <ThemeProvider theme={mockTheme}>
        <CocktailDetail cocktail={cocktailWithSingleGlass} />
      </ThemeProvider>
    );
    expect(screen.getByText('Test Cocktail')).toBeInTheDocument();
    expect(screen.getByText('Glass:')).toBeInTheDocument();
    expect(screen.getByText('Highball glass')).toBeInTheDocument();
  });

  it('renders cocktail details correctly with an array of glass types', () => {
    const cocktailWithArrayGlass = {
      ...baseCocktailData,
      glass: ['Coupe', 'Martini glass'],
    };
    render(
      <ThemeProvider theme={mockTheme}>
        <CocktailDetail cocktail={cocktailWithArrayGlass} />
      </ThemeProvider>
    );
    expect(screen.getByText('Test Cocktail')).toBeInTheDocument();
    expect(screen.getByText('Glass:')).toBeInTheDocument();
    expect(screen.getByText('Coupe, Martini glass')).toBeInTheDocument();
  });

  // --- THIS IS THE CORRECTED TEST ---
  it('does NOT render the glass information when the glass field is missing', () => {
    const cocktailWithoutGlass = {
      ...baseCocktailData,
      glass: null, 
    };
    render(
      <ThemeProvider theme={mockTheme}>
        <CocktailDetail cocktail={cocktailWithoutGlass} />
      </ThemeProvider>
    );
    expect(screen.getByText('Test Cocktail')).toBeInTheDocument();
    // FIXED: The component correctly does not render the label, so the test
    // should assert that the label is NOT in the document.
    const glassLabel = screen.queryByText('Glass:');
    expect(glassLabel).not.toBeInTheDocument(); 
  });

  it('renders "Cocktail not found." when no cocktail data is provided', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <CocktailDetail cocktail={null} />
      </ThemeProvider>
    );
    expect(screen.getByText('Cocktail not found.')).toBeInTheDocument();
  });
});
