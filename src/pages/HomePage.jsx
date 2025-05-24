// In HomePage.jsx (example, actual file might differ slightly)
import React from 'react';
import styled from 'styled-components';
// ... other imports like CategoryList, categoriesData ...
import cocktailsData from '../data/cocktails.json'; // Full list of cocktails
import { useCocktailFilter } from '../hooks/useCocktailFilter'; // The main filter hook
import { useBar } from '../contexts/BarContext'; // To get selectedBar
import CocktailList from '../components/CocktailList';
import FilterSidebar from '../components/FilterSidebar'; // Assuming FilterSidebar is ready to be used
import categoriesData from '../data/categories.json'; // For FilterSidebar

// Styled components for HomePage
const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  /* display: flex; // Removed: HomePageWrapper will handle the flex row for sidebar/content
  flex-direction: column; // Removed
  align-items: center; // Removed */
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
`;

const HomePageWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
  padding: 0 ${({ theme }) => theme.spacing.medium}; // Add some horizontal padding to the overall page flex container
`;

const MainContent = styled.div`
  flex-grow: 1;
`;

const HomePage = () => {
  // Assuming cocktailsData is the full, unfiltered list from your JSON
  const {
    filteredCocktails,
    baseSpirit, setBaseSpirit,
    includeIngredients, setIncludeIngredients,
    excludeIngredients, setExcludeIngredients,
    flavorProfile, setFlavorProfile,
    difficulty, setDifficulty,
    tags, setTags,
    glassType, setGlassType,
    resetFilters,
    isCocktailMakeable // Get this from the hook
  } = useCocktailFilter(cocktailsData);

  const { selectedBar } = useBar(); // Get selectedBar from context

  // For FilterSidebar props
  const filterHookState = {
    baseSpirit, includeIngredients, excludeIngredients, flavorProfile, difficulty, tags, glassType,
  };
  const filterHookSetters = {
    setBaseSpirit, setIncludeIngredients, setExcludeIngredients, setFlavorProfile, setDifficulty, setTags, setGlassType,
  };

  return (
    <PageWrapper>
      {/* The old WelcomeMessage, CocktailOfTheWeekSection, CategoriesSection are removed
          in favor of the new filterable list view. Add any titles or general info
          above HomePageWrapper if needed. */}
      
      <HomePageWrapper>
        <FilterSidebar
          allCocktails={cocktailsData} // Pass all cocktails for generating filter options
          categories={categoriesData}  // Pass categories for category filter
          filters={filterHookState}
          setters={filterHookSetters}
          filteredCocktailsForSurprise={filteredCocktails} // Pass the list here
          resetFilters={resetFilters}
        />
        <MainContent>
          {/* Pass filteredCocktails, isCocktailMakeable, and selectedBar to CocktailList */}
          <CocktailList
            cocktails={filteredCocktails}
            isCocktailMakeable={isCocktailMakeable}
            selectedBar={selectedBar}
          />
        </MainContent>
      </HomePageWrapper>
    </PageWrapper>
  );
};

export default HomePage;
