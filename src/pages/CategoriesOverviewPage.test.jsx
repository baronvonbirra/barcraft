import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Needed if CategoryList uses Link
import { ThemeProvider } from 'styled-components'; // If your components use theme
import CategoriesOverviewPage from './CategoriesOverviewPage';
import categoriesData from '../data/categories.json';
import thematicCategoriesData from '../data/thematicCategories.json';

// Mock the theme if needed
const mockTheme = {
  spacing: { medium: '1rem', large: '1.5rem', small: '0.5rem' },
  colors: { text: '#000', primary: '#007bff', surface: '#fff', border: '#ccc' },
  fonts: { main: 'Arial, sans-serif', headings: 'Georgia, serif' },
  borderRadius: '4px',
  shadows: { medium: '0 4px 6px rgba(0,0,0,0.1)' }
};

// Mock CategoryList to simplify testing, or let it render
jest.mock('../components/CategoryList', () => ({ categories }) => (
  <div data-testid="category-list">
    {categories.map(cat => <div key={cat.id}>{cat.name}</div>)}
  </div>
));

describe('CategoriesOverviewPage', () => {
  it('renders headings and category lists', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={mockTheme}>
          <CategoriesOverviewPage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Browse by Spirit')).toBeInTheDocument();
    expect(screen.getByText('Explore by Theme')).toBeInTheDocument();
    
    // Check if items from categoriesData are rendered by the mocked CategoryList
    expect(screen.getByText(categoriesData[0].name)).toBeInTheDocument();
    // Check if items from thematicCategoriesData are rendered
    expect(screen.getByText(thematicCategoriesData[0].name)).toBeInTheDocument();

    // Verify that CategoryList mock is used twice
    const categoryLists = screen.getAllByTestId('category-list');
    expect(categoryLists).toHaveLength(2);
  });
});
