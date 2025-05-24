import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext'; // Adjust path as needed
import CocktailListItem from './CocktailListItem'; // Adjust path as needed
import PlaceholderImage from '../assets/cocktails/placeholder.png'; // Actual path

// Use the new modern dark theme as the mock theme
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

const renderWithProviders = (ui) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('CocktailListItem', () => {
  const cocktailWithImage = { id: 'mojito', name: 'Mojito', image: 'mojito.jpg' };
  const cocktailWithoutImage = { id: 'daiquiri', name: 'Daiquiri', image: null }; // Or undefined, or empty string

  it('renders cocktail name and link correctly', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithImage} />);
    const linkElement = screen.getByRole('link', { name: /Mojito/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/cocktails/${cocktailWithImage.id}`);
    expect(screen.getByText(cocktailWithImage.name)).toBeInTheDocument();
  });

  it('displays the cocktail image if available', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithImage} />);
    const image = screen.getByAltText(cocktailWithImage.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', cocktailWithImage.image);
  });

  it('displays the placeholder image if cocktail image is missing', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithoutImage} />);
    const image = screen.getByAltText(cocktailWithoutImage.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', PlaceholderImage);
  });

  it('displays the placeholder image if cocktail image is an empty string', () => {
    const cocktailWithEmptyImage = { ...cocktailWithoutImage, image: '' };
    renderWithProviders(<CocktailListItem cocktail={cocktailWithEmptyImage} />);
    const image = screen.getByAltText(cocktailWithEmptyImage.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', PlaceholderImage);
  });
});
