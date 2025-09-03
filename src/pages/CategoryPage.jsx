import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import cocktailsData from '../data/cocktails.json';
import categoriesData from '../data/categories.json';
import thematicCategoriesData from '../data/thematicCategories.json';
import CocktailList from '../components/CocktailList';
import FilterSidebar from '../components/FilterSidebar';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';

// Styled components
const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  animation: fadeInPage 0.5s ease-out forwards;
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

  const allCategories = [...categoriesData, ...thematicCategoriesData];
  const currentCategoryDetails = allCategories.find(cat => cat.id === categoryId);

  const {
    filteredCocktails,
    baseSpirit,
    setBaseSpirit,
    thematic,
    setThematic,
    includeIngredients,
    setIncludeIngredients,
    excludeIngredients,
    setExcludeIngredients,
    flavorProfile,
    setFlavorProfile,
    difficulty,
    setDifficulty,
    tags,
    setTags,
    glassType,
    setGlassType,
    resetFilters,
    isCocktailMakeable,
  } = useCocktailFilter(cocktailsData);

  const { selectedBar } = useBar();

  useEffect(() => {
    if (currentCategoryDetails) {
      const isSpirit = categoriesData.some(cat => cat.id === categoryId);
      if (isSpirit) {
        setBaseSpirit(categoryId);
        setThematic([]);
      } else {
        setThematic([categoryId]);
        setBaseSpirit('');
      }
    } else {
      setBaseSpirit('');
      setThematic([]);
    }
  }, [categoryId, setBaseSpirit, setThematic, currentCategoryDetails]);

  if (categoryId && !currentCategoryDetails) {
    return (
      <PageWrapper>
        <PageTitle>Category Not Found</PageTitle>
        <p>
          The category "{categoryId}" does not exist. Please check the URL or
          select a category from the main menu.
        </p>
      </PageWrapper>
    );
  }

  const pageTitle = currentCategoryDetails
    ? `${currentCategoryDetails.name} Cocktails`
    : 'All Cocktails';

  const filterHookState = {
    baseSpirit,
    includeIngredients,
    excludeIngredients,
    flavorProfile,
    difficulty,
    tags,
    glassType,
    thematic,
  };

  const filterHookSetters = {
    setBaseSpirit,
    setIncludeIngredients,
    setExcludeIngredients,
    setFlavorProfile,
    setDifficulty,
    setTags,
    setGlassType,
    setThematic,
  };

  return (
    <PageWrapper>
      <PageTitle>{pageTitle}</PageTitle>
      <CategoryPageWrapper>
        <FilterSidebar
          allCocktails={cocktailsData}
          categories={categoriesData}
          thematicCategories={thematicCategoriesData}
          filters={filterHookState}
          setters={filterHookSetters}
          resetFilters={resetFilters}
          filteredCocktailsForSurprise={filteredCocktails}
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
