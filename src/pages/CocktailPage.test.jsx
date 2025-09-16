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
  cocktail_ingredients: [
    { ingredients: { id: 'rum', name: 'Rum' }, quantity: '2 oz' },
    { ingredients: { id: 'lime', name: 'Lime Juice' }, quantity: '1 oz' },
    { ingredients: { id: 'mint', name: 'Mint' }, quantity: '6 leaves' },
  ],
};

describe('CocktailPage', () => {
  beforeEach(() => {
    supabase.from.mockImplementation((tableName) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          ...mockCocktail,
          ingredients: mockCocktail.cocktail_ingredients.map(ing => ({
            id: ing.ingredients.id,
            name: ing.ingredients.name,
            quantity: ing.quantity,
            notes: ing.notes,
          })),
        },
        error: null,
      }),
    }));

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
    supabase.from.mockImplementation((tableName) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    }));

    renderWithProviders(<CocktailPage />, {
      route: '/cocktails/non-existent',
      path: '/cocktails/:cocktailId',
    });

    expect(await screen.findByText('Cocktail not found!')).toBeInTheDocument();
  });
});

