import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
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

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => (props.show ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const FilterToggleButton = styled.button`
  display: none; // Hidden by default
  @media (max-width: 768px) {
    display: block; // Visible on mobile
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    width: 100%;
  }
`;

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [cocktails, setCocktails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thematicCategories, setThematicCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const lang = i18n.language;

      // Fetch Cocktails
      const { data: cocktailsData, error: cocktailsError } = await supabase
        .from('cocktails')
        .select('*');

      if (cocktailsError) {
        console.error('Error fetching cocktails:', cocktailsError);
      } else {
        // The 'ingredients' column is a jsonb field and can be used directly.
        // We just need to handle the language-specific name.
        const processedCocktails = cocktailsData.map(c => ({
          ...c,
          name: c[`name_${lang}`] || c.name_en,
        }));
        setCocktails(processedCocktails);
      }

      // Fetch Categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`id, name_${lang}, name_en, image, type`);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else {
        const processed = categoriesData.map(c => ({ ...c, name: c[`name_${lang}`] || c.name_en }));
        const spiritCategories = processed.filter(c => c.type === 'spirit');
        const themeCategories = processed.filter(c => c.type === 'theme');
        setCategories(spiritCategories);
        setThematicCategories(themeCategories);
      }

      setLoading(false);
    };

    fetchAllData();
  }, [i18n.language]);

  const allCategories = [...categories, ...thematicCategories];
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
  } = useCocktailFilter(cocktails);

  const { selectedBar } = useBar();

  useEffect(() => {
    if (currentCategoryDetails) {
      const isSpirit = categories.some(cat => cat.id === categoryId);
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
  }, [categoryId, setBaseSpirit, setThematic, currentCategoryDetails, categories]);

  if (loading) {
    return <PageWrapper><PageTitle>Loading Cocktails...</PageTitle></PageWrapper>;
  }

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
      <Overlay show={isFilterVisible} onClick={() => setIsFilterVisible(false)} />
      <PageTitle>{pageTitle}</PageTitle>
      <FilterToggleButton onClick={() => setIsFilterVisible(!isFilterVisible)}>
        {isFilterVisible ? 'Hide' : 'Show'} Filters
      </FilterToggleButton>
      <CategoryPageWrapper>
        <FilterSidebar
          allCocktails={cocktails}
          categories={categories}
          thematicCategories={thematicCategories}
          filters={filterHookState}
          setters={filterHookSetters}
          resetFilters={resetFilters}
          filteredCocktailsForSurprise={filteredCocktails}
          isVisible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
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
