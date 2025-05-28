import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CocktailPage from './CocktailPage';
import { ThemeProvider } from '../contexts/ThemeContext';
import cocktailsData from '../data/cocktails.json';

// Mock data imports for bar stock and names
// Default to empty stock, specific tests can override
jest.mock('../data/bar1_stock.json', () => [], { virtual: true });
jest.mock('../data/bar2_stock.json', () => [], { virtual: true });
jest.mock('../data/bar_specific_data.json', () => ({
  bar1: { barName: "Level One", /* other properties */ },
  bar2: { barName: "The Glitch", /* other properties */ }
}), { virtual: true });

// Mock cocktailImageLoader (if not already adequately handled by existing tests using actual data)
jest.mock('../utils/cocktailImageLoader.js', () => ({
  getImageUrl: jest.fn((imageName) => imageName ? `mock_path_to/${imageName}` : 'mock_path_to/placeholder.png'),
}));

const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1D24',
    surface: '#282C34',
    primary: '#3498DB',
    secondary: '#1ABC9C',
    text: '#EAEAEA',
    textOffset: '#A0A0A0',
    onPrimary: '#FFFFFF',
    onSurface: '#EAEAEA',
    border: '#3A3F4B',
  },
  fonts: {
    main: "'Inter', sans-serif",
    headings: "'Poppins', sans-serif",
  },
  spacing: {
    xs: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xl: '32px',
    xxl: '48px',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.2)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
  },
  borderRadius: '8px',
};

describe('CocktailPage', () => {
  const renderWithProviders = (ui, { route = '/', path = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <ThemeProvider theme={mockTheme}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  const testCocktailId = 'mojito'; // A valid cocktail ID from your data
  const nonExistentCocktailId = 'nonexistentcocktail';

  it('renders details for a valid cocktail', () => {
    renderWithProviders(<CocktailPage />, { route: `/cocktails/${testCocktailId}`, path: '/cocktails/:cocktailId' });

    const cocktail = cocktailsData.find(c => c.id === testCocktailId);
    
    expect(screen.getByRole('heading', { name: new RegExp(cocktail.name, 'i') })).toBeInTheDocument();
    
    // Check for image (assuming CocktailDetail renders it with alt text)
    // Note: PlaceholderImage might be used if cocktail.image is missing
    const cocktailImage = cocktail.image ? cocktail.name : /placeholder/i;
    expect(screen.getByAltText(cocktailImage)).toBeInTheDocument();
    
    // Check for ingredients (this test might be too brittle if ingredient formatting changes)
    // A better test might check for a list role or specific ingredient list items.
    // For now, keeping it simple if CocktailDetail renders ingredients directly.
    cocktail.ingredients.forEach(ing => {
      // Assuming ingredient is an object like { name: "Rum", quantity: "2 oz" }
      // and CocktailDetail formats it as "Rum: 2 oz" or similar.
      // This part of the test is highly dependent on CocktailDetail's rendering logic.
      // We will check for the formatted ingredient string within list items.
      const expectedIngredientText = `${ing.name}: ${ing.quantity}${ing.notes ? ` (${ing.notes})` : ''}`;
      const listItems = screen.getAllByRole('listitem');
      const matchingListItem = listItems.find(li => li.textContent === expectedIngredientText);
      expect(matchingListItem).toBeInTheDocument();
    });
    
    // Check for instructions (again, depends on how CocktailDetail renders them)
    // If instructions is an array, this will fail.
    // Let's assume it's a block of text or each instruction is rendered.
    // This will likely need adjustment after CocktailDetail is reviewed/refactored.
    if (Array.isArray(cocktail.instructions)) {
      cocktail.instructions.forEach(step => {
        expect(screen.getByText(new RegExp(step.substring(0, 30), 'i'))).toBeInTheDocument(); // Check for first few words of each step
      });
    } else {
      expect(screen.getByText(new RegExp(cocktail.instructions.substring(0, 50), 'i'))).toBeInTheDocument();
    }

    // Check for new fields
    expect(screen.getByText(new RegExp(cocktail.history.substring(0, 50), 'i'))).toBeInTheDocument();

    // Check Glass and Difficulty within their InfoGrid section
    // This assumes InfoGrid has a distinguishable characteristic or we get all InfoItems
    // For simplicity, assuming InfoItemStyled is unique enough for now or by its content.
    const glassInfoItem = screen.getByText(/Glass:/i).closest('div'); // find the InfoItemStyled div
    expect(within(glassInfoItem).getByText(cocktail.glass)).toBeInTheDocument();
    
    const difficultyInfoItem = screen.getByText(/Difficulty:/i).closest('div');
    expect(within(difficultyInfoItem).getByText(cocktail.difficulty)).toBeInTheDocument();

    // Check Flavor Profile Pills
    const flavorProfileSection = screen.getByRole('heading', { name: /Flavor Profile/i }).parentElement;
    cocktail.flavorProfile.slice(0, 2).forEach(flavor => {
      expect(within(flavorProfileSection).getByText(new RegExp(`^${flavor}$`, 'i'))).toBeInTheDocument();
    });

    // Check Tags Pills
    const tagsSection = screen.getByRole('heading', { name: /Tags/i }).parentElement;
    cocktail.tags.slice(0, 2).forEach(tag => {
      expect(within(tagsSection).getByText(new RegExp(`^${tag}$`, 'i'))).toBeInTheDocument();
    });

    // Check Tools Needed Pills
    const toolsNeededSection = screen.getByRole('heading', { name: /Tools Needed/i }).parentElement;
    cocktail.toolsNeeded.slice(0, 2).forEach(tool => {
      // Use a more specific regex to match the whole word, case-insensitive, as a pill.
      expect(within(toolsNeededSection).getByText(new RegExp(`^${tool}$`, 'i'))).toBeInTheDocument();
    });
  });

  it('renders a "cocktail not found" message for a non-existent cocktail', () => {
    renderWithProviders(<CocktailPage />, { route: `/cocktails/${nonExistentCocktailId}`, path: '/cocktails/:cocktailId' });

    // Assuming CocktailDetail component shows a "Cocktail not found." message.
    // This text might change based on CocktailDetail's implementation.
    expect(screen.getByText(/Cocktail not found/i)).toBeInTheDocument();
    
    // Ensure no specific details of another cocktail (e.g., Mojito) are shown
    expect(screen.queryByRole('heading', { name: /Mojito/i })).not.toBeInTheDocument();
  });

  describe('AllBarsAvailability Section', () => {
    // Use a cocktail that requires a specific, unique ingredient for easier testing.
    const testCocktail = cocktailsData.find(c => c.id === 'mojito'); // Mojito uses 'mint leaves'
    if (!testCocktail) throw new Error("Test cocktail 'mojito' not found in data.");
    
    // Assume 'mint leaves' has id 'mint' and is essential for Mojito
    // This requires knowledge of your ingredient IDs in cocktails.json and stock .json files.
    // Let's say Mojito's essential ingredient is { id: 'mint', name: 'Mint Leaves', isEssential: true }

    const renderPageForAvailabilityTest = (bar1Stock, bar2Stock) => {
      // Mock the stock files for this specific test run
      if (bar1Stock) jest.doMock('../data/bar1_stock.json', () => bar1Stock, { virtual: true });
      if (bar2Stock) jest.doMock('../data/bar2_stock.json', () => bar2Stock, { virtual: true });

      // Re-require CocktailPage to pick up the new mocks if jest.doMock is used.
      // This is important because the component might have already been imported with different mocks.
      // Alternatively, structure tests so mocks are set globally or use jest.resetModules().
      const UpdatedCocktailPage = require('./CocktailPage').default;

      renderWithProviders(<UpdatedCocktailPage />, { 
        route: `/cocktails/${testCocktail.id}`, 
        path: '/cocktails/:cocktailId' 
      });
    };
    
    // Find an ingredient that Mojito needs, e.g., 'mint'. Assume its ID is 'mint'.
    // This should align with your actual data structure for ingredients and stock.
    const essentialIngredientForMojito = { id: 'mint', name: 'Mint', isAvailable: true }; // Example

    it('renders correctly when available in Bar1, unavailable in Bar2', () => {
      renderPageForAvailabilityTest([essentialIngredientForMojito], []); // Bar1 has mint, Bar2 doesn't
      expect(screen.getByText("Level One: Available")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Unavailable")).toBeInTheDocument();
    });

    it('renders correctly when unavailable in Bar1, available in Bar2', () => {
      renderPageForAvailabilityTest([], [essentialIngredientForMojito]); // Bar1 no mint, Bar2 has mint
      expect(screen.getByText("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders correctly when available in both bars', () => {
      renderPageForAvailabilityTest([essentialIngredientForMojito], [essentialIngredientForMojito]);
      expect(screen.getByText("Level One: Available")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Available")).toBeInTheDocument();
    });

    it('renders correctly when unavailable in both bars', () => {
      renderPageForAvailabilityTest([], []); // Neither bar has mint
      expect(screen.getByText("Level One: Unavailable")).toBeInTheDocument();
      expect(screen.getByText("The Glitch: Unavailable")).toBeInTheDocument();
    });

    it('renders the wrapper and two status components', () => {
      renderPageForAvailabilityTest([], []); // Doesn't matter the stock for this structure test
      // Check for the wrapper by finding one of the children and going to its parent
      const anAvailabilityStatus = screen.getByText(/Level One:/);
      const wrapper = anAvailabilityStatus.parentElement; // This should be IndividualBarStatus
      const outerWrapper = wrapper.parentElement; // This should be AllBarsAvailabilityWrapper

      expect(outerWrapper).toBeInTheDocument();
      // Check for two IndividualBarStatus components within the AllBarsAvailabilityWrapper
      // A more robust query might be to check for elements with specific styles or test IDs.
      // For now, checking for text content is a good proxy.
      expect(within(outerWrapper).getByText(/Level One:/)).toBeInTheDocument();
      expect(within(outerWrapper).getByText(/The Glitch:/)).toBeInTheDocument();
      expect(outerWrapper.children.length).toBe(2); // Assuming direct children are the status divs
    });
  });
});
