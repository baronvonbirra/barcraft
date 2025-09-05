import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CategoriesOverviewPage from './CategoriesOverviewPage';
import { renderWithProviders } from '../test-utils';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient');
vi.mock('../components/FilterSidebar', () => ({
  default: () => <aside data-testid="filtersidebar" />,
}));
vi.mock('../components/CocktailList', () => ({
  default: ({ cocktails }) => (
    <div data-testid="cocktaillist">
      {cocktails.map(c => <div key={c.id}>{c.name}</div>)}
    </div>
  ),
}));


const mockCocktails = [
  { id: 'mojito', name_en: 'Mojito', cocktail_ingredients: [{ ingredients: {id: 'rum', name_en: 'Rum'}, quantity: '2 oz'}] },
  { id: 'daiquiri', name_en: 'Daiquiri', cocktail_ingredients: [{ ingredients: {id: 'rum', name_en: 'Rum'}, quantity: '2 oz'}] },
];

const mockCategories = [
  { id: 'rum', name_en: 'Rum', image: 'rum.jpg', type: 'spirit' },
  { id: 'gin', name_en: 'Gin', image: 'gin.jpg', type: 'spirit' },
  { id: 'classic', name_en: 'Classic', image: 'classic.jpg', type: 'theme' },
];

describe('CategoriesOverviewPage', () => {
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

  it('renders search input, filter sidebar, and cocktail list', async () => {
    renderWithProviders(<CategoriesOverviewPage />);
    expect(await screen.findByPlaceholderText(/Search by name or ingredient.../i)).toBeInTheDocument();
    expect(await screen.findByTestId('filtersidebar')).toBeInTheDocument();
    expect(await screen.findByTestId('cocktaillist')).toBeInTheDocument();
  });

  it('displays cocktails after fetching', async () => {
    renderWithProviders(<CategoriesOverviewPage />);
    expect(await screen.findByText('Mojito')).toBeInTheDocument();
    expect(await screen.findByText('Daiquiri')).toBeInTheDocument();
  });

  it('filters cocktails when typing in search input', async () => {
    renderWithProviders(<CategoriesOverviewPage />);
    const searchInput = await screen.findByPlaceholderText(/Search by name or ingredient.../i);
    fireEvent.change(searchInput, { target: { value: 'mojito' } });
    expect(await screen.findByText('Mojito')).toBeInTheDocument();
    expect(screen.queryByText('Daiquiri')).not.toBeInTheDocument();
  });
});
