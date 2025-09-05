import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CocktailPage from './CocktailPage';
import { renderWithProviders } from '../test-utils';
import { supabase } from '../supabaseClient';
import { useFavorites } from '../hooks/useFavorites';

vi.mock('../supabaseClient');
vi.mock('../hooks/useFavorites');

const mockCocktail = {
  id: 'mojito',
  name_en: 'Mojito',
  description_en: 'A refreshing Cuban classic.',
  instructions_en: ['Muddle mint and sugar', 'Add rum and lime juice', 'Top with soda water'],
  history_en: 'The Mojito is a traditional Cuban highball.',
  image: 'mojito.jpg',
  ingredients: [
    { id: 'rum', name_en: 'Rum', quantity: '2 oz' },
    { id: 'lime', name_en: 'Lime Juice', quantity: '1 oz' },
    { id: 'mint', name_en: 'Mint', quantity: '6 leaves' },
  ],
};

describe('CocktailPage', () => {
  beforeEach(() => {
    const from = supabase.from;
    from.mockImplementation((tableName) => {
      const select = vi.fn();
      const eq = vi.fn();
      const single = vi.fn();

      if (tableName === 'cocktails') {
        single.mockResolvedValue({ data: mockCocktail, error: null });
        eq.mockReturnValue({ single });
        select.mockReturnValue({ eq });
      } else {
        select.mockResolvedValue({ data: [], error: null });
      }

      return { select };
    });

    useFavorites.mockReturnValue({
      isFavorite: vi.fn().mockReturnValue(false),
      toggleFavorite: vi.fn(),
    });
  });

  it('renders cocktail details', async () => {
    renderWithProviders(<CocktailPage />, {
      route: '/cocktails/mojito',
      path: '/cocktails/:cocktailId',
    });

    await waitFor(() => {
      expect(screen.getByText('Mojito')).toBeInTheDocument();
      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  it('renders "cocktail not found" message for a non-existent cocktail', async () => {
    const from = supabase.from;
    from.mockImplementation((tableName) => {
      const select = vi.fn();
      const eq = vi.fn();
      const single = vi.fn();

      if (tableName === 'cocktails') {
        single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
        eq.mockReturnValue({ single });
        select.mockReturnValue({ eq });
      } else {
        select.mockResolvedValue({ data: [], error: null });
      }

      return { select };
    });

    renderWithProviders(<CocktailPage />, {
      route: '/cocktails/non-existent',
      path: '/cocktails/:cocktailId',
    });

    expect(await screen.findByText('Cocktail not found!')).toBeInTheDocument();
  });
});

