import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import CategoryListItem from './CategoryListItem';

vi.mock('../utils/cocktailImageLoader.js', () => ({
  getImageUrl: (path) => path, // Return the path directly
}));

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

describe('CategoryListItem', () => {
  const rumCategory = { id: 'rum', name: 'Rum-based Cocktails', image: 'src/assets/categories/rum-category.png' };
  const whiskeyCategory = { id: 'whiskey', name: 'Whiskey-based Cocktails', image: 'src/assets/categories/whiskey-category.png' };
  const ginCategory = { id: 'gin', name: 'Gin-based Cocktails', image: 'src/assets/categories/gin-category.png' };

  it('renders category name and link correctly', () => {
    renderWithProviders(<CategoryListItem category={ginCategory} />);
    const linkElement = screen.getByRole('link', { name: /Gin-based Cocktails/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/category/${ginCategory.id}`);
  });

  it('displays Rum icon for Rum-based Cocktails category', () => {
    renderWithProviders(<CategoryListItem category={rumCategory} />);
    const icon = screen.getByAltText(/Rum-based Cocktails icon/i);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'src/assets/categories/rum-category.png');
  });

  it('displays Whiskey icon for Whiskey-based Cocktails category', () => {
    renderWithProviders(<CategoryListItem category={whiskeyCategory} />);
    const icon = screen.getByAltText(/Whiskey-based Cocktails icon/i);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'src/assets/categories/whiskey-category.png');
  });

  it('displays placeholder icon for other categories', () => {
    const otherCategory = { id: 'other', name: 'Other Cocktails' }; // No image property
    renderWithProviders(<CategoryListItem category={otherCategory} />);
    const icon = screen.getByAltText(/Other Cocktails icon/i);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'src/assets/cocktails/placeholder.jpg');
  });

  it('renders category name correctly for Rum category', () => {
    renderWithProviders(<CategoryListItem category={rumCategory} />);
    expect(screen.getByText(rumCategory.name)).toBeInTheDocument();
  });

  it('renders category name correctly for Whiskey category', () => {
    renderWithProviders(<CategoryListItem category={whiskeyCategory} />);
    expect(screen.getByText(whiskeyCategory.name)).toBeInTheDocument();
  });
});
