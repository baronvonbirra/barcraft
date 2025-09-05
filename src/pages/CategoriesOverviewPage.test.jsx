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
  { id: 'mojito', name_en: 'Mojito', ingredients: [{ id: 'rum', name_en: 'Rum' }] },
  { id: 'daiquiri', name_en: 'Daiquiri', ingredients: [{ id: 'rum', name_en: 'Rum' }] },
];

const mockCategories = [
  { id: 'rum', name_en: 'Rum', image: 'rum.jpg' },
  { id: 'gin', name_en: 'Gin', image: 'gin.jpg' },
];

const mockThematicCategories = [
  { id: 'classic', name_en: 'Classic', image: 'classic.jpg' },
];

describe('CategoriesOverviewPage', () => {
  beforeEach(() => {
    const from = supabase.from;
    from.mockImplementation((tableName) => {
      const select = vi.fn();

      if (tableName === 'cocktails') {
        select.mockResolvedValue({ data: mockCocktails, error: null });
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
