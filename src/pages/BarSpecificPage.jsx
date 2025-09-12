import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useBar } from '../contexts/BarContext';
import CocktailList from '../components/CocktailList';
import { ThemeContext } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  animation: fadeInPage 0.5s ease-out forwards;
`;

const BarHeader = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const BarFiltersWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  text-align: center;
  color: ${({ theme }) => theme.colors.textOffset};
`;

const CuratedSectionWrapper = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const CuratedSectionHeader = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const AvailableCocktailsHeader = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const EmptyStateWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.textOffset};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const EmptyStateText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const EmptyStateSuggestion = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textOffset};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const BarSpecificPage = () => {
  const { barId } = useParams(); // 'level-one' or 'the-glitch'
  const { theme } = useContext(ThemeContext);
  const { i18n } = useTranslation();
  const { barStock, selectBar, selectedBarName } = useBar();
  const [cocktails, setCocktails] = useState([]);
  const [curatedCocktailIds, setCuratedCocktailIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const internalBarId = useMemo(() => {
    if (barId === 'level-one') return 'bar1';
    if (barId === 'the-glitch') return 'bar2';
    return null;
  }, [barId]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      // Fetch all cocktails
      const { data: cocktailsData, error: cocktailsError } = await supabase
        .from('cocktails')
        .select('*, ingredients:cocktail_ingredients!cocktail_ingredients_cocktail_id_fkey(*, details:ingredients(*))');

      if (cocktailsError) {
        console.error('Error fetching cocktails:', cocktailsError);
      } else {
        const lang = i18n.language;
        const processedCocktails = cocktailsData.map(c => ({
          ...c,
          name: c[`name_${lang}`] || c.name_en,
          ingredients: c.ingredients?.map(ci => ({
            ...ci,
            ...ci.details,
          })) || [],
        }));
        setCocktails(processedCocktails);
      }

      // Fetch curated cocktail IDs for the current bar
      if (internalBarId) {
        const { data: curatedData, error: curatedError } = await supabase
          .from('curated_cocktails')
          .select('cocktail_id')
          .eq('bar_id', internalBarId);

        if (curatedError) {
          console.error(`Error fetching curated cocktails for ${internalBarId}:`, curatedError);
        } else {
          setCuratedCocktailIds(curatedData.map(c => c.cocktail_id));
        }
      }

      setLoading(false);
    };

    fetchAllData();
  }, [i18n.language, internalBarId]);

  useEffect(() => {
    if (internalBarId) {
      selectBar(internalBarId);
    }
  }, [internalBarId, selectBar]);

  const stockSet = barStock;

  const isCocktailMakeableAtCurrentBar = useMemo(() => {
    return (cocktailIngredients) => {
      if (!cocktailIngredients || cocktailIngredients.length === 0) return true;
      // It's makeable if every ingredient is either not essential or is in stock
      return cocktailIngredients.every(ing => !ing.is_essential || stockSet.has(ing.id));
    };
  }, [stockSet]);

  const curatedCocktailsList = useMemo(() => {
    if (!curatedCocktailIds || curatedCocktailIds.length === 0) return [];
    return cocktails
      .filter(cocktail => curatedCocktailIds.includes(cocktail.id))
      .map(cocktail => ({
        ...cocktail,
        isMakeable: isCocktailMakeableAtCurrentBar(cocktail.ingredients),
      }));
  }, [cocktails, curatedCocktailIds, isCocktailMakeableAtCurrentBar]);

  const availableCocktails = useMemo(() => {
    return cocktails
      .filter(cocktail => isCocktailMakeableAtCurrentBar(cocktail.ingredients))
      .map(cocktail => ({
        ...cocktail,
        isMakeable: true,
      }));
  }, [cocktails, isCocktailMakeableAtCurrentBar]);

  if (loading) {
    return <PageWrapper theme={theme}><BarHeader>Loading...</BarHeader></PageWrapper>;
  }

  return (
    <PageWrapper theme={theme}>
      <BarHeader>{selectedBarName}'s Corner</BarHeader>
      
      <BarFiltersWrapper>
        {/* Future filter components can be placed here */}
      </BarFiltersWrapper>

      {curatedCocktailsList.length > 0 && (
        <CuratedSectionWrapper theme={theme}>
          <CuratedSectionHeader theme={theme}>Curated Cocktails</CuratedSectionHeader>
          <CocktailList cocktails={curatedCocktailsList} />
        </CuratedSectionWrapper>
      )}

      {availableCocktails.length > 0 ? (
        <>
          <AvailableCocktailsHeader theme={theme}>On The Bar</AvailableCocktailsHeader>
          <CocktailList cocktails={availableCocktails} />
        </>
      ) : (
        <EmptyStateWrapper theme={theme}>
          <EmptyStateIcon>🤷</EmptyStateIcon>
          <EmptyStateText>No cocktails currently makeable at {selectedBarName}.</EmptyStateText>
          <EmptyStateSuggestion theme={theme}>
            You can <Link to="/">explore all cocktails</Link> or check back later!
          </EmptyStateSuggestion>
        </EmptyStateWrapper>
      )}
    </PageWrapper>
  );
};

export default BarSpecificPage;
