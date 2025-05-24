import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import cocktailsData from '../data/cocktails.json';
import categoriesData from '../data/categories.json';
import CocktailList from '../components/CocktailList';
import FilterSidebar from '../components/FilterSidebar';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';

// Styled components (can be similar to HomePage)
const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
`;

const CategoryPageWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
`;

const MainContent = styled.div`
  flex-grow: 1;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

const CategoryPage = () => {
  const { categoryId } = useParams();
  
  const {
    filteredCocktails,
    baseSpirit, setBaseSpirit, // Use setBaseSpirit to preset category
    includeIngredients, setIncludeIngredients,
    excludeIngredients, setExcludeIngredients,
    flavorProfile, setFlavorProfile,
    difficulty, setDifficulty,
    tags, setTags,
    glassType, setGlassType,
    resetFilters,
    isCocktailMakeable
  } = useCocktailFilter(cocktailsData);

  const { selectedBar } = useBar();

  // Set the initial category filter based on the route parameter
  useEffect(() => {
    if (categoryId) {
      setBaseSpirit(categoryId);
    }
    // Optional: could also reset other filters if navigating to a new category page
    // depends on desired UX. For now, other filters persist.
  }, [categoryId, setBaseSpirit]);

  const currentCategory = categoriesData.find(cat => cat.id === categoryId);
  const pageTitle = currentCategory ? `${currentCategory.name} Cocktails` : "Category Cocktails";

  // Prepare props for FilterSidebar
  const filterHookState = {
    baseSpirit, includeIngredients, excludeIngredients, flavorProfile, difficulty, tags, glassType,
  };
  const filterHookSetters = {
    setBaseSpirit, setIncludeIngredients, setExcludeIngredients, setFlavorProfile, setDifficulty, setTags, setGlassType,
  };
  
  // Further filter `filteredCocktails` if the `baseSpirit` from the hook doesn't match `categoryId`
  // This ensures that even if the user changes the category in the sidebar,
  // this page effectively still respects its primary category context for the title,
  // but the list reflects the sidebar.
  // However, useCocktailFilter already handles the baseSpirit filtering.
  // The useEffect ensures baseSpirit is set. So filteredCocktails should be correct.

  return (
    <PageWrapper>
      <PageTitle>{pageTitle}</PageTitle>
      <CategoryPageWrapper>
        <FilterSidebar
          allCocktails={cocktailsData} // Pass all for deriving options
          categories={categoriesData}
          filters={filterHookState}
          setters={filterHookSetters}
          resetFilters={resetFilters}
          filteredCocktailsForSurprise={filteredCocktails} // For Surprise Me button
        />
        <MainContent>
          <CocktailList
            cocktails={filteredCocktails}
            isCocktailMakeable={isCocktailMakeable}
            selectedBar={selectedBar}
          />
        </MainContent>
      </CategoryPageWrapper>
    </PageWrapper>
  );
};

export default CategoryPage;
