import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useBar } from '../contexts/BarContext';
import CocktailList from '../components/CocktailList';
import { ThemeContext } from '../contexts/ThemeContext';

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
  const { barStock, selectBar, selectedBarName, barsData } = useBar();
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocktails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cocktails')
        .select(`
          *,
          cocktail_ingredients(
            quantity,
            notes,
            ingredients (*)
          )
        `);

      if (error) {
        console.error('Error fetching cocktails:', error);
      } else {
        const processedCocktails = data.map(cocktail => ({
          ...cocktail,
          ingredients: cocktail.cocktail_ingredients?.map(ci => ({
            ...ci.ingredients,
            quantity: ci.quantity,
            notes: ci.notes,
          })) || [],
        }));
        setCocktails(processedCocktails);
      }
      setLoading(false);
    };

    fetchCocktails();
  }, []);

  const internalBarId = useMemo(() => {
    if (barId === 'level-one') return 'bar1';
    if (barId === 'the-glitch') return 'bar2';
    return null;
  }, [barId]);

  useEffect(() => {
    if (internalBarId) {
      selectBar(internalBarId);
    }
  }, [internalBarId, selectBar]);

  const currentBarSpecifics = useMemo(() => {
    if (!internalBarId || !barsData[internalBarId]) {
      return { curatedMenuName: '', curatedCocktailIds: [] };
    }
    return barsData[internalBarId];
  }, [internalBarId, barsData]);

  const stockSet = barStock;

  const isCocktailMakeableAtCurrentBar = useMemo(() => {
    return (cocktailIngredients) => {
      if (stockSet.size === 0) {
        return !cocktailIngredients.some(ing => ing.isEssential);
      }
      if (!cocktailIngredients || cocktailIngredients.length === 0) return true;
      return cocktailIngredients.every(ing => {
        if (!ing.isEssential) return true;
        return stockSet.has(ing.id);
      });
    };
  }, [stockSet]);

  const curatedCocktailsList = useMemo(() => {
    if (!currentBarSpecifics.curatedCocktailIds.length) return [];
    return cocktails
      .filter(cocktail => currentBarSpecifics.curatedCocktailIds.includes(cocktail.id))
      .map(cocktail => ({
        ...cocktail,
        isMakeable: isCocktailMakeableAtCurrentBar(cocktail.ingredients),
      }));
  }, [cocktails, currentBarSpecifics.curatedCocktailIds, isCocktailMakeableAtCurrentBar]);

  const availableCocktails = useMemo(() => {
    if (stockSet.size === 0) return [];
    return cocktails
      .filter(cocktail => {
        if (!cocktail.ingredients || cocktail.ingredients.length === 0) return true;
        return cocktail.ingredients.every(ing => {
          if (!ing.isEssential) return true;
          return stockSet.has(ing.id);
        });
      })
      .map(cocktail => ({
        ...cocktail,
        isMakeable: true,
      }));
  }, [cocktails, stockSet]);

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
          <CuratedSectionHeader theme={theme}>{currentBarSpecifics.curatedMenuName}</CuratedSectionHeader>
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
