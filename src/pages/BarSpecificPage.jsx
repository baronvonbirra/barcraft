import React, { useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link
import styled from 'styled-components';
import cocktailsData from '../data/cocktails.json';
import barSpecificData from '../data/bar_specific_data.json'; // For bar names
// import { useBar } from '../contexts/BarContext'; // To potentially set the bar context if needed, though URL is king here
import CocktailList from '../components/CocktailList';
// import FilterSidebar from '../components/FilterSidebar'; // Or a new dedicated filter component
// Placeholder for actual stock data for Bar A and Bar B
import bar1Stock from '../data/bar1_stock.json';
import bar2Stock from '../data/bar2_stock.json';
import { ThemeContext } from '../contexts/ThemeContext'; // For theme access

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  animation: fadeInPage 0.5s ease-out forwards;
`;

const BarHeader = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

// Placeholder for where filters for this bar would go
const BarFiltersWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-align: center;
  color: ${({ theme }) => theme.colors.textOffset};
`;

// Styled Components for Empty State (copied from FilteredCocktailListPage)
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
  const { barId } = useParams(); // 'barA' or 'barB'
  const { theme } = useContext(ThemeContext);
  // const { selectBar } = useBar(); // Optional: set context if other components rely on it

  // useEffect(() => {
  //   if (barId === 'barA') selectBar('bar1'); // Map URL barId to context barId
  //   else if (barId === 'barB') selectBar('bar2');
  // }, [barId, selectBar]);

  const currentBarData = useMemo(() => {
    if (barId === 'barA') return { name: barSpecificData.bar1.barName, stock: bar1Stock.ingredients, internalId: 'bar1' };
    if (barId === 'barB') return { name: barSpecificData.bar2.barName, stock: bar2Stock.ingredients, internalId: 'bar2' };
    return { name: 'Unknown Bar', stock: [], internalId: null };
  }, [barId]);

  // Filter cocktailsData to only include those makeable with currentBarData.stock
  const availableCocktails = useMemo(() => {
    if (!currentBarData.stock || currentBarData.stock.length === 0) {
      return [];
    }
    return cocktailsData.filter(cocktail => {
      return cocktail.ingredients.every(ing => 
        currentBarData.stock.some(stockIng => stockIng.name === ing.name && stockIng.available)
      );
    });
  }, [currentBarData.stock]);
  
  // This function will be passed to CocktailList -> CocktailListItem
  // to determine if a specific cocktail is makeable based on the current bar's stock.
  // This is a simplified version for this page, not using the full useCocktailFilter hook.
  const isCocktailMakeableAtCurrentBar = (cocktailIngredients) => {
    if (!currentBarData.stock || currentBarData.stock.length === 0) {
        return false;
    }
    return cocktailIngredients.every(ing =>
        currentBarData.stock.some(stockIng => stockIng.name === ing.name && stockIng.available)
    );
  };


  return (
    <PageWrapper theme={theme}>
      <BarHeader>{currentBarData.name}'s Corner</BarHeader>
      
      <BarFiltersWrapper>
        <p>Filters for {currentBarData.name} will go here. Currently showing all makeable cocktails.</p>
        {/* <FilterSidebar allCocktails={availableCocktails} ... /> */}
        {/* This FilterSidebar would need to be adapted or a new one created */}
        {/* to work with only 'availableCocktails' and reflect 'currentBarData.stock' */}
      </BarFiltersWrapper>

      {availableCocktails.length > 0 ? (
        <CocktailList 
          cocktails={availableCocktails} 
          selectedBar={currentBarData.internalId} 
          isCocktailMakeable={isCocktailMakeableAtCurrentBar} 
        />
      ) : (
        <EmptyStateWrapper theme={theme}>
          <EmptyStateIcon>🤷</EmptyStateIcon>
          <EmptyStateText>No cocktails currently makeable at {currentBarData.name}.</EmptyStateText>
          <EmptyStateSuggestion theme={theme}>
            You can <Link to="/">explore all cocktails</Link> or check back later!
          </EmptyStateSuggestion>
        </EmptyStateWrapper>
      )}
    </PageWrapper>
  );
};

export default BarSpecificPage;
