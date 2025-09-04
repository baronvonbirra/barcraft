import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { vi } from 'vitest';
import HomePage from './HomePage';
import categoriesData from '../data/categories.json'; 

vi.mock('../assets/cocktails/placeholder.jpg', () => ({
  default: 'mocked-placeholder-image.jpg',
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

describe('HomePage', () => {
  const renderWithProviders = (ui) => {
    return render(
      <ThemeProvider theme={mockTheme}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  it('renders the main headings for browsing', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { name: /Browse by Spirit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Explore by Theme/i })).toBeInTheDocument();
  });

  it('renders the "Surprise Me!" button', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('button', { name: /Surprise Me!/i })).toBeInTheDocument();
  });

  it('renders a list of categories', () => {
    renderWithProviders(<HomePage />);
    categoriesData.slice(0, 3).forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('renders links for categories with correct href attributes', () => {
    renderWithProviders(<HomePage />);
    categoriesData.forEach(category => {
      const escapedCategoryName = category.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkElement = screen.getByRole('link', { name: new RegExp(escapedCategoryName, 'i') });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/category/${category.id}`);
    });
  });
});

