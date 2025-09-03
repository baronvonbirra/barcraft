import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

import CategoriesOverviewPage from './CategoriesOverviewPage';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';
import cocktailsData from '../data/cocktails.json'; // For mock data
import categoriesData from '../data/categories.json';
import thematicCategoriesData from '../data/thematicCategories.json';


// Mock the hooks
vi.mock('../hooks/useCocktailFilter');
vi.mock('../contexts/BarContext');
// Mock FilterSidebar as its internal workings are complex and not the focus here.
// We only care that CategoriesOverviewPage renders it and passes correct props.
vi.mock('../components/FilterSidebar', () => ({
  default: (props) => (
    <aside data-testid="filtersidebar">
      {/* Basic rendering of some props to allow testing interactions if needed */}
      <label htmlFor="baseSpiritSelect">Base Spirit/Category:</label>
      <select
        id="baseSpiritSelect"
        value={props.filters.baseSpirit}
        onChange={(e) => props.setters.setBaseSpirit(e.target.value)}
      >
        <option value="">All</option>
        {categoriesData.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>
      <button onClick={props.resetFilters}>Reset Filters</button>
      <button onClick={() => props.setters.setThematic(['tropical'])}>Set Tropical Theme</button>
    </aside>
  )
}));
vi.mock('../components/CocktailList', () => ({
  default: ({ cocktails, isCocktailMakeable, selectedBar }) => (
    <div data-testid="cocktaillist">
      {cocktails.map(cocktail => (
        <div key={cocktail.id} data-testid={`cocktail-item-${cocktail.id}`}>
          <h3>{cocktail.name}</h3>
          <p>{isCocktailMakeable(cocktail) ? 'Makeable' : 'Not Makeable'}</p>
        </div>
      ))}
    </div>
  )
}));


const mockTheme = {
  spacing: { small: '4px', medium: '8px', large: '16px', xlarge: '24px' },
  colors: { 
    text: '#333', 
    border: '#ccc', 
    primary: '#007bff', 
    primaryRGB: '0,123,255',
    secondary: '#6c757d',
    background: '#fff',
    lightBackground: '#f8f9fa',
    darkBackground: '#343a40',
    accent: '#ffc107',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    textMuted: '#6c757d',
    inputBorder: '#ced4da',
    primaryAlpha: 'rgba(0, 123, 255, 0.1)'
  },
  borderRadius: '4px',
  fonts: { main: 'Arial, sans-serif', heading: 'Georgia, serif' },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    medium: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  },
  breakpoints: {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px',
  },
};

const mockCocktailsInitial = cocktailsData.slice(0, 3);
const mockCocktailsFiltered = [cocktailsData[0]]; // e.g., Margarita

describe('CategoriesOverviewPage', () => {
  let mockSetSearchTerm;
  let mockSetBaseSpirit;
  let mockSetThematic;
  let mockResetFilters;
  let mockSetIncludeIngredients;
  let mockSetExcludeIngredients;
  let mockSetFlavorProfile;
  let mockSetDifficulty;
  let mockSetTags;
  let mockSetGlassType;


  beforeEach(() => {
    mockSetSearchTerm = vi.fn();
    mockSetBaseSpirit = vi.fn();
    mockSetThematic = vi.fn();
    mockResetFilters = vi.fn();
    mockSetIncludeIngredients = vi.fn();
    mockSetExcludeIngredients = vi.fn();
    mockSetFlavorProfile = vi.fn();
    mockSetDifficulty = vi.fn();
    mockSetTags = vi.fn();
    mockSetGlassType = vi.fn();
    
    useCocktailFilter.mockReturnValue({
      filteredCocktails: mockCocktailsInitial,
      baseSpirit: '',
      setBaseSpirit: mockSetBaseSpirit,
      thematic: [], 
      setThematic: mockSetThematic,
      includeIngredients: [], setIncludeIngredients: mockSetIncludeIngredients,
      excludeIngredients: [], setExcludeIngredients: mockSetExcludeIngredients,
      flavorProfile: [], setFlavorProfile: mockSetFlavorProfile,
      difficulty: '', setDifficulty: mockSetDifficulty,
      tags: [], setTags: mockSetTags,
      glassType: '', setGlassType: mockSetGlassType,
      searchTerm: '',
      setSearchTerm: mockSetSearchTerm,
      resetFilters: mockResetFilters,
    });

    useBar.mockReturnValue({
      selectedBar: null,
      barStock: [],
      isCocktailMakeable: vi.fn(() => true), // Default to makeable for simplicity
    });
    
    // Clear all mocks before each test
    mockSetSearchTerm.mockClear();
    mockSetBaseSpirit.mockClear();
    mockSetThematic.mockClear();
    mockResetFilters.mockClear();
    mockSetIncludeIngredients.mockClear();
    mockSetExcludeIngredients.mockClear();
    mockSetFlavorProfile.mockClear();
    mockSetDifficulty.mockClear();
    mockSetTags.mockClear();
    mockSetGlassType.mockClear();
  });

  const renderPage = () => {
    return render(
      <ThemeProvider theme={mockTheme}>
        <BrowserRouter>
          <CategoriesOverviewPage />
        </BrowserRouter>
      </ThemeProvider>
    );
  };

  test('renders search input, filter sidebar, and cocktail list', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/search cocktails by name, ingredient, or tag.../i)).toBeInTheDocument();
    expect(screen.getByTestId('filtersidebar')).toBeInTheDocument(); 
    expect(screen.getByTestId('cocktaillist')).toBeInTheDocument(); 
    
    mockCocktailsInitial.forEach(cocktail => {
      expect(screen.getByText(cocktail.name)).toBeInTheDocument();
    });
  });

  test('calls setSearchTerm when typing in search input', () => {
    renderPage();
    const searchInput = screen.getByPlaceholderText(/search cocktails by name, ingredient, or tag.../i);
    fireEvent.change(searchInput, { target: { value: 'Margarita' } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('Margarita');
  });

  test('calls setBaseSpirit when changing base spirit filter in mocked sidebar', () => {
    renderPage();
    const baseSpiritSelect = screen.getByLabelText(/base spirit\/category:/i);
    fireEvent.change(baseSpiritSelect, { target: { value: 'gin' } }); // Example value
    expect(mockSetBaseSpirit).toHaveBeenCalledWith('gin');
  });
  
  test('calls setThematic when a thematic filter is applied in mocked sidebar', () => {
    renderPage();
    const thematicButton = screen.getByRole('button', { name: /set tropical theme/i });
    fireEvent.click(thematicButton);
    expect(mockSetThematic).toHaveBeenCalledWith(['tropical']);
  });

  test('calls resetFilters when reset button in mocked sidebar is clicked', () => {
    renderPage();
    const resetButton = screen.getByRole('button', { name: /reset filters/i });
    fireEvent.click(resetButton);
    expect(mockResetFilters).toHaveBeenCalled();
  });

  test('search functionality updates displayed cocktails when mock is adjusted', () => {
    const { rerender } = renderPage(); // Initial render with mockCocktailsInitial

    // Assert initial state
    expect(screen.getByText(mockCocktailsInitial[0].name)).toBeInTheDocument();
    if (mockCocktailsInitial.length > 1) {
      expect(screen.getByText(mockCocktailsInitial[1].name)).toBeInTheDocument();
    }

    // Update the mock to return a different list of cocktails for the next render
    useCocktailFilter.mockReturnValue({
      filteredCocktails: mockCocktailsFiltered, // New list after "search"
      baseSpirit: '',
      setBaseSpirit: mockSetBaseSpirit,
      thematic: [],
      setThematic: mockSetThematic,
      includeIngredients: [],
      setIncludeIngredients: mockSetIncludeIngredients,
      excludeIngredients: [],
      setExcludeIngredients: mockSetExcludeIngredients,
      flavorProfile: [],
      setFlavorProfile: mockSetFlavorProfile,
      difficulty: '',
      setDifficulty: mockSetDifficulty,
      tags: [],
      setTags: mockSetTags,
      glassType: '',
      setGlassType: mockSetGlassType,
      searchTerm: 'Margarita', // Reflect the search term that "caused" the filter
      setSearchTerm: mockSetSearchTerm,
      resetFilters: mockResetFilters,
    });

    // Rerender the component. It will now use the new mock value.
    rerender(
      <ThemeProvider theme={mockTheme}>
        <BrowserRouter>
          <CategoriesOverviewPage />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Check that the new list is displayed
    expect(screen.getByText(mockCocktailsFiltered[0].name)).toBeInTheDocument();

    // Check that cocktails not in mockCocktailsFiltered are no longer displayed
    if (
      mockCocktailsInitial.length > 1 &&
      mockCocktailsInitial[1].name !== mockCocktailsFiltered[0].name
    ) {
      expect(screen.queryByText(mockCocktailsInitial[1].name)).not.toBeInTheDocument();
    }
    if (
      mockCocktailsInitial.length > 2 &&
      mockCocktailsInitial[2].name !== mockCocktailsFiltered[0].name
    ) {
      expect(screen.queryByText(mockCocktailsInitial[2].name)).not.toBeInTheDocument();
    }
  });
});
