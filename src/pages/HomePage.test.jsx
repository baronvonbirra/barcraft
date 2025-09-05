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
  { id: 'rum', name_en: 'Rum', image: 'rum.jpg', type: 'spirit' },
  { id: 'classic', name_en: 'Classic', image: 'classic.jpg', type: 'theme' },
];

const mockAllCocktails = [{ id: 'mojito', name_en: 'Mojito' }];

describe('HomePage', () => {
  beforeEach(() => {
    supabase.from.mockImplementation((tableName) => ({
      select: vi.fn().mockImplementation((query) => {
        if (tableName === 'cocktail_of_the_week') {
          return Promise.resolve({ data: [{ cocktail_id: 'mojito' }], error: null });
        }
        if (tableName === 'cocktails') {
          if (query.includes('description')) {
            return {
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({ data: mockCocktail, error: null }),
            };
          }
          return Promise.resolve({ data: mockAllCocktails, error: null });
        }
        if (tableName === 'categories') {
          return Promise.resolve({ data: mockCategories, error: null });
        }
        return Promise.resolve({ data: [], error: null });
      }),
    }));
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

