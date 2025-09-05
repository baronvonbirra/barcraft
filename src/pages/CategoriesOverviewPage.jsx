import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import FilterSidebar from '../components/FilterSidebar';
import CocktailList from '../components/CocktailList';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { getCachedData, setCachedData } from '../utils/cache';

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
  const { i18n, t } = useTranslation();
  const [allCocktails, setAllCocktails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thematicCategories, setThematicCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const lang = i18n.language;
      const cocktailsCacheKey = `cocktails_all_detailed_${lang}`;
      const categoriesCacheKey = `categories_all_${lang}`;
      const cacheDuration = 3600 * 1000;

      // Fetch Cocktails
      const cachedCocktails = getCachedData(cocktailsCacheKey, cacheDuration);
      if (cachedCocktails) {
        setAllCocktails(cachedCocktails);
      } else {
        const { data, error } = await supabase
          .from('cocktails')
          .select(`*, name_${lang}, name_en, description_${lang}, description_en, instructions_${lang}, instructions_en, history_${lang}, history_en, cocktail_ingredients(quantity, notes, ingredients(id, name_${lang}, name_en))`);

        if (error) {
          console.error('Error fetching cocktails:', error);
        } else {
          const processedCocktails = data.map(c => ({
            ...c,
            name: c[`name_${lang}`] || c.name_en,
            description: c[`description_${lang}`] || c.description_en,
            instructions: c[`instructions_${lang}`] || c.instructions_en,
            history: c[`history_${lang}`] || c.history_en,
            ingredients: c.cocktail_ingredients?.map(ci => ({
              ...ci.ingredients,
              name: ci.ingredients[`name_${lang}`] || ci.ingredients.name_en,
              quantity: ci.quantity,
              notes: ci.notes,
            })) || []
          }));
          setAllCocktails(processedCocktails);
          setCachedData(cocktailsCacheKey, processedCocktails);
        }
      }

      // Fetch Categories
      const cachedCategories = getCachedData(categoriesCacheKey, cacheDuration);
      if (cachedCategories) {
        const spiritCategories = cachedCategories.filter(c => c.type === 'spirit');
        const themeCategories = cachedCategories.filter(c => c.type === 'theme');
        setCategories(spiritCategories);
        setThematicCategories(themeCategories);
      } else {
        const { data, error } = await supabase.from('categories').select(`id, name_${lang}, name_en, image, type`);
        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          const processed = data.map(c => ({ ...c, name: c[`name_${lang}`] || c.name_en }));
          setCachedData(categoriesCacheKey, processed);
          const spiritCategories = processed.filter(c => c.type === 'spirit');
          const themeCategories = processed.filter(c => c.type === 'theme');
          setCategories(spiritCategories);
          setThematicCategories(themeCategories);
        }
      }

      setLoading(false);
    };

    fetchAllData();
  }, [i18n.language]);

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
  } = useCocktailFilter(allCocktails);

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
          allCocktails={allCocktails}
          categories={categories}
          thematicCategories={thematicCategories}
          filters={filterHookState} // Pass searchTerm if FilterSidebar needs to display it (e.g. for a clear search button inside it)
          setters={filterHookSetters} // Pass setSearchTerm if FilterSidebar has its own search input/clear button
          resetFilters={resetFilters}
          filteredCocktailsForSurprise={filteredCocktails} // Use filteredCocktails from hook
        />
        <MainContent>
          <SearchInput
            type="text"
            placeholder={t('header.searchPlaceholder')}
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
