import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import HomePage from './HomePage';
import { renderWithProviders } from '../test-utils';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient');

const mockCocktail = {
  id: 'mojito',
  name_en: 'Mojito',
  description_en: 'A refreshing Cuban classic.',
  image: 'mojito.jpg',
};

const mockCategories = [
  { id: 'rum', name_en: 'Rum', image: 'rum.jpg' },
  { id: 'gin', name_en: 'Gin', image: 'gin.jpg' },
];

const mockThematicCategories = [
  { id: 'classic', name_en: 'Classic', image: 'classic.jpg' },
];

describe('HomePage', () => {
  beforeEach(() => {
    const from = supabase.from;
    from.mockImplementation((tableName) => {
      const select = vi.fn();
      const eq = vi.fn();
      const single = vi.fn();

      if (tableName === 'cocktail_of_the_week') {
        single.mockResolvedValue({ data: { cocktail_id: 'mojito' }, error: null });
        select.mockReturnValue({ single });
      } else if (tableName === 'cocktails') {
        single.mockResolvedValue({ data: mockCocktail, error: null });
        eq.mockReturnValue({ single });
        select.mockReturnValue({ eq });
      } else if (tableName === 'categories') {
        select.mockResolvedValue({ data: mockCategories, error: null });
      } else if (tableName === 'thematic_categories') {
        select.mockResolvedValue({ data: mockThematicCategories, error: null });
      } else {
        select.mockResolvedValue({ data: [], error: null });
      }

      return { select };
    });
  });

  it('renders the main headings for browsing', async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByRole('heading', { name: /Browse by Spirit/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /Explore by Theme/i })).toBeInTheDocument();
  });

  it('renders the cocktail of the week', async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByText(/Mojito - Cocktail of the Week!/i)).toBeInTheDocument();
    expect(screen.getByText('A refreshing Cuban classic.')).toBeInTheDocument();
  });

  it('renders a list of categories', async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      mockCategories.forEach(category => {
        expect(screen.getByText(category.name_en)).toBeInTheDocument();
      });
    });
  });

  it('renders links for categories with correct href attributes', async () => {
    renderWithProviders(<HomePage />);
    const links = await screen.findAllByRole('link');
    mockCategories.forEach(category => {
      const linkElement = links.find(link => link.textContent.includes(category.name_en));
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', `/category/${category.id}`);
    });
  });
});

