import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext'; // Path is correct
import CocktailListItem from './CocktailListItem'; // Path is correct
// import PlaceholderImage from '../assets/cocktails/placeholder.png'; // No longer directly used by component

// Mock data imports
jest.mock('../data/bar1_stock.json', () => ([]), { virtual: true });
jest.mock('../data/bar2_stock.json', () => ([]), { virtual: true });
jest.mock('../data/bar_specific_data.json', () => ({
  bar1: { barName: "Level One", curatedMenuName: "Level One Signatures", curatedCocktailIds: ["cosmopolitan", "old-fashioned"] },
  bar2: { barName: "The Glitch", curatedMenuName: "The Glitch Specials", curatedCocktailIds: ["margarita", "negroni"] }
}), { virtual: true });

// Mock cocktailImageLoader
jest.mock('../utils/cocktailImageLoader.js', () => ({
  getImageUrl: jest.fn((imageName) => imageName ? `mock_path_to/${imageName}` : 'mock_path_to/placeholder.png'),
}));


const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1D24', surface: '#282C34', primary: '#3498DB', secondary: '#1ABC9C',
    text: '#EAEAEA', textOffset: '#A0A0A0', onPrimary: '#FFFFFF', onSurface: '#EAEAEA', border: '#3A3F4B',
  },
  fonts: { main: "'Inter', sans-serif", headings: "'Poppins', sans-serif" },
  spacing: { xs: '4px', small: '8px', medium: '16px', large: '24px', xl: '32px', xxl: '48px' },
  shadows: { small: '0 2px 4px rgba(0,0,0,0.2)', medium: '0 4px 8px rgba(0,0,0,0.3)' },
  borderRadius: '8px',
};

const renderWithProviders = (ui) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('CocktailListItem', () => {
  const cocktailWithImage = { id: 'mojito', name: 'Mojito', image: 'mojito.jpg', ingredients: [{ id: 'rum', isEssential: true }] };
  const cocktailWithoutImage = { id: 'daiquiri', name: 'Daiquiri', image: null, ingredients: [{ id: 'gin', isEssential: true }] };

  // Mock getImageUrl to ensure tests aren't reliant on actual image loading
  const { getImageUrl } = require('../utils/cocktailImageLoader.js');

  beforeEach(() => {
    // Reset mocks before each test if needed, though getImageUrl is simple here
    getImageUrl.mockClear();
  });

  it('renders cocktail name and link correctly', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithImage} />);
    const linkElement = screen.getByRole('link', { name: /Mojito/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/cocktails/${cocktailWithImage.id}`);
    expect(screen.getByText(cocktailWithImage.name)).toBeInTheDocument();
  });

  it('displays the cocktail image if available, using getImageUrl', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithImage} />);
    const image = screen.getByAltText(cocktailWithImage.name);
    expect(image).toBeInTheDocument();
    expect(getImageUrl).toHaveBeenCalledWith(cocktailWithImage.image);
    expect(image).toHaveAttribute('src', `mock_path_to/${cocktailWithImage.image}`);
  });

  it('displays the placeholder image if cocktail image is missing, using getImageUrl', () => {
    renderWithProviders(<CocktailListItem cocktail={cocktailWithoutImage} />);
    const image = screen.getByAltText(cocktailWithoutImage.name);
    expect(image).toBeInTheDocument();
    expect(getImageUrl).toHaveBeenCalledWith(cocktailWithoutImage.image); // null in this case
    expect(image).toHaveAttribute('src', 'mock_path_to/placeholder.png');
  });

  describe('Bar Availability Icons', () => {
    const cocktailForAvailabilityTest = {
      id: 'test-cocktail',
      name: 'Test Cocktail',
      image: 'test.jpg',
      ingredients: [{ id: 'ingredientA', name: 'Ingredient A', isEssential: true }]
    };

    const setupMocksAndRender = (bar1Stock, bar2Stock) => {
      jest.mock('../data/bar1_stock.json', () => bar1Stock, { virtual: true });
      jest.mock('../data/bar2_stock.json', () => bar2Stock, { virtual: true });
      
      // Need to re-require CocktailListItem after mocks are set for a specific test run
      // This is tricky with Jest's module caching. A cleaner way might be to pass stock data as props if possible,
      // or ensure mocks are applied before the FIRST import of CocktailListItem.
      // For now, let's assume mocks applied at top level are sufficient if component re-imports on state change (not typical).
      // A more robust way is to use jest.doMock and then require inside the test or beforeEach.
      
      // Re-import CocktailListItem to pick up new mocks.
      // This requires `jest.resetModules()` if we want to change mocks between tests in the same file.
      // For simplicity, let's assume the initial mocks can be overridden or the component is re-evaluated.
      // The BEST practice is to ensure mocks are set BEFORE the component is imported for the first time.
      // The mocks at the top of the file should handle this correctly for subsequent `renderWithProviders` calls.

      renderWithProviders(<CocktailListItem cocktail={cocktailForAvailabilityTest} />);
    };

    it('renders availability icons correctly (Available in L1, Unavailable in TG)', () => {
      // Mock Bar1 has ingredientA, Bar2 does not.
      const bar1Stock = [{ id: 'ingredientA', name: 'Ingredient A', isAvailable: true }];
      const bar2Stock = [{ id: 'ingredientB', name: 'Ingredient B', isAvailable: true }]; // Bar2 missing ingredientA
      
      // Apply mocks (this is illustrative; direct jest.mock calls at top are usually better)
      jest.doMock('../data/bar1_stock.json', () => bar1Stock, { virtual: true });
      jest.doMock('../data/bar2_stock.json', () => bar2Stock, { virtual: true });
      
      const UpdatedCocktailListItem = require('./CocktailListItem').default; // Re-require
      renderWithProviders(<UpdatedCocktailListItem cocktail={cocktailForAvailabilityTest} />);

      const l1Icon = screen.getByTitle("Level One: Available");
      const tgIcon = screen.getByTitle("The Glitch: Unavailable");
      expect(l1Icon).toBeInTheDocument();
      expect(l1Icon).toHaveTextContent('L1');
      expect(tgIcon).toBeInTheDocument();
      expect(tgIcon).toHaveTextContent('TG');
      // Check styles or classes if specific styling indicates availability
      // For example, if 'available' class is added:
      // expect(l1Icon).toHaveClass('available'); 
      // expect(tgIcon).not.toHaveClass('available');
      // Given the styled-component uses props, checking title is most straightforward for now.
    });

    it('renders availability icons correctly (Unavailable in L1, Available in TG)', () => {
      const bar1Stock = [{ id: 'ingredientB', name: 'Ingredient B', isAvailable: true }]; 
      const bar2Stock = [{ id: 'ingredientA', name: 'Ingredient A', isAvailable: true }];
      
      jest.doMock('../data/bar1_stock.json', () => bar1Stock, { virtual: true });
      jest.doMock('../data/bar2_stock.json', () => bar2Stock, { virtual: true });
      
      const UpdatedCocktailListItem = require('./CocktailListItem').default;
      renderWithProviders(<UpdatedCocktailListItem cocktail={cocktailForAvailabilityTest} />);

      expect(screen.getByTitle("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByTitle("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders availability icons correctly (Available in both)', () => {
      const bar1Stock = [{ id: 'ingredientA', name: 'Ingredient A', isAvailable: true }];
      const bar2Stock = [{ id: 'ingredientA', name: 'Ingredient A', isAvailable: true }];

      jest.doMock('../data/bar1_stock.json', () => bar1Stock, { virtual: true });
      jest.doMock('../data/bar2_stock.json', () => bar2Stock, { virtual: true });

      const UpdatedCocktailListItem = require('./CocktailListItem').default;
      renderWithProviders(<UpdatedCocktailListItem cocktail={cocktailForAvailabilityTest} />);
      
      expect(screen.getByTitle("Level One: Available")).toBeInTheDocument();
      expect(screen.getByTitle("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders availability icons correctly (Unavailable in both)', () => {
      const bar1Stock = [{ id: 'ingredientB', name: 'Ingredient B', isAvailable: true }];
      const bar2Stock = [{ id: 'ingredientC', name: 'Ingredient C', isAvailable: true }];
      
      jest.doMock('../data/bar1_stock.json', () => bar1Stock, { virtual: true });
      jest.doMock('../data/bar2_stock.json', () => bar2Stock, { virtual: true });

      const UpdatedCocktailListItem = require('./CocktailListItem').default;
      renderWithProviders(<UpdatedCocktailListItem cocktail={cocktailForAvailabilityTest} />);

      expect(screen.getByTitle("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByTitle("The Glitch: Unavailable")).toBeInTheDocument();
    });
    
    it('renders two availability icons within the wrapper', () => {
      // Default mocks from top of file (empty stock) will make it unavailable in both
      renderWithProviders(<CocktailListItem cocktail={cocktailForAvailabilityTest} />);
      const wrapper = screen.getByText('L1').closest('div'); // Find the BarAvailabilityIconWrapper
      expect(wrapper).toBeInTheDocument();
      // Check for two children with the specific title pattern (more robust than just text L1/TG)
      const icons = wrapper.querySelectorAll('span[title*="Level One"], span[title*="The Glitch"]');
      expect(icons.length).toBe(2);
    });
  });
});
