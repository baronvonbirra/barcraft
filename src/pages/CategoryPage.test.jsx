import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CategoryPage from './CategoryPage';
import { renderWithProviders } from '../test-utils';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient');
vi.mock('../components/CocktailList', () => ({
  default: ({ cocktails }) => (
    <div data-testid="cocktaillist">
      {cocktails.map(c => <div key={c.id}>{c.name}</div>)}
    </div>
  ),
}));

const mockCocktails = [
  { id: 'mojito', name: 'Mojito', name_en: 'Mojito', baseSpiritCategory: 'rum' },
  { id: 'daiquiri', name: 'Daiquiri', name_en: 'Daiquiri', baseSpiritCategory: 'rum' },
];

const mockCategories = [
  { id: 'rum', name: 'Rum', name_en: 'Rum', type: 'spirit' },
  { id: 'classic', name: 'Classic', name_en: 'Classic', type: 'theme' },
];

describe('CategoryPage', () => {
  beforeEach(() => {
    supabase.from.mockImplementation((tableName) => ({
      select: vi.fn().mockImplementation((query) => {
        if (tableName === 'cocktails') {
          return Promise.resolve({ data: mockCocktails, error: null });
        }
        if (tableName === 'categories') {
          return Promise.resolve({ data: mockCategories, error: null });
        }
        return Promise.resolve({ data: [], error: null });
      }),
    }));
  });

  it('renders the category title and lists cocktails for a valid category', async () => {
    renderWithProviders(<CategoryPage />, { route: '/category/rum', path: '/category/:categoryId' });
    
    expect(await screen.findByRole('heading', { name: /Rum Cocktails/i })).toBeInTheDocument();
    expect(await screen.findByText('Mojito')).toBeInTheDocument();
  });

  it('displays "Category Not Found" for a non-existent category', async () => {
    renderWithProviders(<CategoryPage />, { route: '/category/nonexistent', path: '/category/:categoryId' });
    
    expect(await screen.findByRole('heading', { name: /Category Not Found/i })).toBeInTheDocument();
  });
});
