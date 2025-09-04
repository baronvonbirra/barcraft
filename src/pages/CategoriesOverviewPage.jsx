import React, { useMemo } from 'react';
import styled from 'styled-components';
import FilterSidebar from '../components/FilterSidebar';
import CocktailList from '../components/CocktailList';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';
import cocktailsData from '../data/cocktails.json';
import categoriesData from '../data/categories.json'; // For FilterSidebar general categories
import thematicCategoriesData from '../data/thematicCategories.json'; // For FilterSidebar thematic categories

const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  animation: fadeInPage 0.5s ease-out forwards;
  display: flex;
  flex-direction: column;
`;

const CategoriesPageLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  padding: 0 ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'}; /* Add some horizontal padding */
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'} ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  border-radius: ${({ theme }) => theme.borderRadius || '4px'};
  border: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#ccc'};
  font-size: 1rem;
  width: 100%; 
  max-width: 400px; 
  align-self: center; 
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};

  &:focus {
    border-color: ${({ theme }) => (theme.colors && theme.colors.primary) || '#007bff'};
    box-shadow: 0 0 0 2px rgba(${({ theme }) => (theme.colors && (theme.colors.primaryRGB || '0,123,255'))}, 0.2);
    outline: none;
  }
`;

const CategoriesOverviewPage = () => {
  const {
    filteredCocktails,
    baseSpirit, setBaseSpirit,
    thematic, setThematic,
    includeIngredients, setIncludeIngredients,
    excludeIngredients, setExcludeIngredients,
    flavorProfile, setFlavorProfile,
    difficulty, setDifficulty,
    tags, setTags,
    glassType, setGlassType,
    searchTerm, setSearchTerm, // Destructure searchTerm and setSearchTerm from the hook
    resetFilters
  } = useCocktailFilter(cocktailsData);

  const { selectedBar, barStock } = useBar();

  const isCocktailMakeable = (cocktail) => {
    if (!selectedBar || !barStock || barStock.length === 0) return true;
    return cocktail.ingredients.every(ingredient => 
      barStock.includes(ingredient.name.toLowerCase())
    );
  };

  const filterHookState = { baseSpirit, includeIngredients, excludeIngredients, flavorProfile, difficulty, tags, glassType, thematic, searchTerm };
  const filterHookSetters = { setBaseSpirit, setIncludeIngredients, setExcludeIngredients, setFlavorProfile, setDifficulty, setTags, setGlassType, setThematic, setSearchTerm };

  return (
    <PageWrapper>
      <CategoriesPageLayout>
        <FilterSidebar
          allCocktails={cocktailsData}
          categories={categoriesData}
          thematicCategories={thematicCategoriesData}
          filters={filterHookState} // Pass searchTerm if FilterSidebar needs to display it (e.g. for a clear search button inside it)
          setters={filterHookSetters} // Pass setSearchTerm if FilterSidebar has its own search input/clear button
          resetFilters={resetFilters}
          filteredCocktailsForSurprise={filteredCocktails} // Use filteredCocktails from hook
        />
        <MainContent>
          <SearchInput
            type="text"
            placeholder="Search cocktails by name, ingredient, or tag..."
            value={searchTerm} // Use searchTerm from hook
            onChange={(e) => setSearchTerm(e.target.value)} // Use setSearchTerm from hook
          />
          <CocktailList
            cocktails={filteredCocktails}
            isCocktailMakeable={isCocktailMakeable}
            selectedBar={selectedBar}
          />
        </MainContent>
      </CategoriesPageLayout>
    </PageWrapper>
  );
};

export default CategoriesOverviewPage;
