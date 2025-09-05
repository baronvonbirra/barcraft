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
  it('shows loading message initially', () => {
    supabase.from.mockImplementation((tableName) => ({
      select: vi.fn(() => new Promise(resolve => {})), // Never resolves
    }));
    renderWithProviders(<CategoryPage />, { route: '/category/rum', path: '/category/:categoryId' });
    expect(screen.getByRole('heading', { name: /Loading/i })).toBeInTheDocument();
  });
});
