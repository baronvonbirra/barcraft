import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import FilterSidebar from '../components/FilterSidebar';
import CocktailList from '../components/CocktailList';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

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

      const { data: cocktails, error: cocktailsError } = await supabase
        .from('cocktails')
        .select(`*, ingredients:ingredients(id, name_${lang})`);

      if (cocktailsError) console.error('Error fetching cocktails:', cocktailsError);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`id, name_${lang}, image, type`);

      if (categoriesError) console.error('Error fetching categories:', categoriesError);

      if (cocktails) {
        setAllCocktails(cocktails.map(c => ({
          ...c,
          name: c[`name_${lang}`],
          description: c[`description_${lang}`],
          instructions: c[`instructions_${lang}`],
          history: c[`history_${lang}`],
          ingredients: c.ingredients.map(i => ({ ...i, name: i[`name_${lang}`] }))
        })));
      }
      if (categoriesData) {
        const spiritCategories = categoriesData.filter(c => c.type === 'spirit').map(c => ({ ...c, name: c[`name_${lang}`] }));
        const themeCategories = categoriesData.filter(c => c.type === 'theme').map(c => ({ ...c, name: c[`name_${lang}`] }));
        setCategories(spiritCategories);
        setThematicCategories(themeCategories);
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
