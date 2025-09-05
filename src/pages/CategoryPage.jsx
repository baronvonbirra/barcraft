import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { getCachedData, setCachedData } from '../utils/cache';
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
  const [cocktails, setCocktails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thematicCategories, setThematicCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchCocktails = async () => {
      const cacheKey = 'cocktails_all';
      const cached = getCachedData(cacheKey, 3600 * 1000);
      if (cached) {
        setCocktails(cached);
        return;
      }
      const { data, error } = await supabase.from('cocktails').select(`*, name_${i18n.language}, name_en`);
      if (error) {
        console.error(error);
      } else {
        const processed = data.map(c => ({ ...c, name: c[`name_${i18n.language}`] || c.name_en }));
        setCocktails(processed);
        setCachedData(cacheKey, processed);
      }
    };

    const fetchCategories = async () => {
      const lang = i18n.language;
      const cacheKey = `categories_all_${lang}`;
      const cached = getCachedData(cacheKey, 3600 * 1000);
      if (cached) {
        const spiritCategories = cached.filter(c => c.type === 'spirit');
        const themeCategories = cached.filter(c => c.type === 'theme');
        setCategories(spiritCategories);
        setThematicCategories(themeCategories);
        return;
      }

      const { data, error } = await supabase.from('categories').select(`id, name_${lang}, name_en, image, type`);
      if (error) console.error(error);
      else {
        const processed = data.map(c => ({...c, name: c[`name_${lang}`] || c.name_en}));
        setCachedData(cacheKey, processed);
        const spiritCategories = processed.filter(c => c.type === 'spirit');
        const themeCategories = processed.filter(c => c.type === 'theme');
        setCategories(spiritCategories);
        setThematicCategories(themeCategories);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCocktails(), fetchCategories()]);
      setLoading(false);
    }

    loadData();
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
      <PageTitle>{pageTitle}</PageTitle>
      <CategoryPageWrapper>
        <FilterSidebar
          allCocktails={cocktails}
          categories={categories}
          thematicCategories={thematicCategories}
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
