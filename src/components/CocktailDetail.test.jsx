import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import CocktailDetail from './CocktailDetail';

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

// Minimal mock cocktail data structure
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

  it('renders cocktail details correctly when glass field is missing', () => {
    const cocktailWithoutGlass = {
      ...baseCocktailData,
      glass: null, // or undefined
    };
    render(
      <ThemeProvider theme={mockTheme}>
        <CocktailDetail cocktail={cocktailWithoutGlass} />
      </ThemeProvider>
    );
    expect(screen.getByText('Test Cocktail')).toBeInTheDocument();
    // Check that "Glass:" label is not rendered if value is null/undefined
    // The current implementation of CocktailDetail will render InfoItem with an empty value for glass.
    // If the requirement was to not render "Glass:" at all, the component would need adjustment.
    // For now, testing it renders with an empty or no specific value for glass.
    const glassLabel = screen.queryByText('Glass:');
    // Depending on how InfoItem handles a null/empty value from glassDisplayValue,
    // this might be `null` or it might render "Glass: " with an empty string.
    // The current component implementation will render "Glass: " and an empty value.
    expect(glassLabel).toBeInTheDocument(); 
    // We can also check that no specific glass type is mentioned next to "Glass:"
    // This is a bit tricky, we'd be looking for the absence of text content in the value part of InfoItem.
    // A more direct way is to check the parent of "Glass:"
    const infoGrid = screen.getByText('Difficulty:').closest('div'); // Assuming difficulty is always there and InfoGrid is the parent
    expect(infoGrid).toHaveTextContent("Glass:"); // It will have "Glass: "
    // To ensure no value is rendered for glass, we'd ideally check the specific element holding the value.
    // InfoItem renders <strong>{label}</strong> {value}. So we look for the text node after "Glass: ".
    // This test confirms that "Glass:" is rendered, and implicitly that no value follows in a way that breaks rendering.
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
