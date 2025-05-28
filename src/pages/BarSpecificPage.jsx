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
  // margin-bottom: ${({ theme }) => theme.spacing.large}; // Removed to prevent double margin
  // padding: ${({ theme }) => theme.spacing.medium}; // Removed to hide empty placeholder
  // background-color: ${({ theme }) => theme.colors.surface}; // Removed to hide empty placeholder
  border-radius: ${({ theme }) => theme.borderRadius};
  text-align: center;
  color: ${({ theme }) => theme.colors.textOffset};
`;

const CuratedSectionWrapper = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.surface}; // Changed to surface for distinction
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.small}; // Added a subtle shadow for more definition
`;

const CuratedSectionHeader = styled.h2`
  color: ${({ theme }) => theme.colors.secondary}; // Or primary
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const AvailableCocktailsHeader = styled.h2`
  color: ${({ theme }) => theme.colors.primary}; // Using primary color for this header
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xlarge}; // Increased top margin for better separation
  margin-bottom: ${({ theme }) => theme.spacing.medium};
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
  const { theme } = useContext(ThemeContext); // ensure theme is available
  // const { selectBar } = useBar(); // Optional: set context if other components rely on it

  // useEffect(() => {
  //   if (barId === 'barA') selectBar('bar1'); // Map URL barId to context barId
  //   else if (barId === 'barB') selectBar('bar2');
  // }, [barId, selectBar]);

  const currentBarData = useMemo(() => {
    let availableStockIds = [];
    let barName = 'Unknown Bar';
    let internalId = null;

    if (barId === 'level-one') { // Updated from 'barA'
      // bar1Stock is the array: [{id, name, isAvailable}, ...]
      availableStockIds = bar1Stock
        .filter(ingredient => ingredient.isAvailable)
        .map(ingredient => ingredient.id);
      barName = barSpecificData.bar1.barName;
      internalId = 'bar1';
    } else if (barId === 'the-glitch') { // Updated from 'barB'
      // bar2Stock is the array: [{id, name, isAvailable}, ...]
      availableStockIds = bar2Stock
        .filter(ingredient => ingredient.isAvailable)
        .map(ingredient => ingredient.id);
      barName = barSpecificData.bar2.barName;
      internalId = 'bar2';
    }
    
    return { name: barName, stock: availableStockIds, internalId: internalId };
  }, [barId]); // bar1Stock and bar2Stock are stable JSON imports, so not explicitly listed as deps

  const currentBarSpecifics = useMemo(() => {
    if (barId === 'level-one') return barSpecificData.bar1; // Updated from 'barA'
    if (barId === 'the-glitch') return barSpecificData.bar2; // Updated from 'barB'
    return { curatedMenuName: '', curatedCocktailIds: [] };
  }, [barId]);

  // Create a memoized set of available stock for efficient lookup
  const stockSet = useMemo(() => {
    if (!currentBarData.stock || currentBarData.stock.length === 0) {
      return new Set();
    }
    // currentBarData.stock is now an array of ingredient IDs.
    return new Set(currentBarData.stock);
  }, [currentBarData.stock]);
  
  // Define isCocktailMakeableAtCurrentBar function using useMemo (depends on stockSet, currentBarData)
  // This must be defined before curatedCocktailsList and availableCocktails
  const isCocktailMakeableAtCurrentBar = useMemo(() => {
    return (cocktailIngredients) => {
      // If the bar has no stock defined and it's a specific bar context, nothing requiring ingredients is makeable.
      if (stockSet.size === 0 && currentBarData.internalId !== null) {
          // Check if any essential ingredients are required. If so, it's not makeable.
          return !cocktailIngredients.some(ing => ing.isEssential);
      }
      // If no ingredients, it's "makeable"
      if (!cocktailIngredients || cocktailIngredients.length === 0) return true;

      return cocktailIngredients.every(ing => {
        if (!ing.isEssential) return true; // Optional ingredients don't break makeability
        return stockSet.has(ing.id);     // Check ID for essential ingredients
      });
    };
  }, [stockSet, currentBarData.internalId]);

  // Now define curatedCocktailsList (depends on currentBarSpecifics, isCocktailMakeableAtCurrentBar)
  const curatedCocktailsList = useMemo(() => {
    if (!currentBarSpecifics.curatedCocktailIds || currentBarSpecifics.curatedCocktailIds.length === 0) {
      return [];
    }
    return cocktailsData
      .filter(cocktail => currentBarSpecifics.curatedCocktailIds.includes(cocktail.id))
      .map(cocktail => ({
        ...cocktail,
        isMakeable: isCocktailMakeableAtCurrentBar(cocktail.ingredients)
      }));
  }, [currentBarSpecifics.curatedCocktailIds, isCocktailMakeableAtCurrentBar]);

  // And availableCocktails (depends on stockSet, currentBarData, isCocktailMakeableAtCurrentBar)
  const availableCocktails = useMemo(() => {
    if (stockSet.size === 0 && currentBarData.internalId !== null) { // internalId check to ensure a bar is actually selected
      return [];
    }
      return cocktailsData
      .filter(cocktail => {
        // If no ingredients, it's "makeable" by default (e.g. a conceptual "Water")
        if (!cocktail.ingredients || cocktail.ingredients.length === 0) return true;
        return cocktail.ingredients.every(ing => {
          if (!ing.isEssential) return true; // Optional ingredients don't break makeability
          return stockSet.has(ing.id);     // Check ID for essential ingredients
        });
      })
      .map(cocktail => ({
        ...cocktail,
        isMakeable: isCocktailMakeableAtCurrentBar(cocktail.ingredients) // Explicitly set, though filter implies true
      }));
  }, [stockSet, currentBarData.internalId, isCocktailMakeableAtCurrentBar]); 

  return (
    <PageWrapper theme={theme}>
      <BarHeader>{currentBarData.name}'s Corner</BarHeader>
      
      <BarFiltersWrapper>
        {/* <FilterSidebar allCocktails={availableCocktails} ... /> */}
        {/* This FilterSidebar would need to be adapted or a new one created */}
        {/* to work with only 'availableCocktails' and reflect 'currentBarData.stock' */}
      </BarFiltersWrapper>

      {/* Curated Cocktails Section */}
      {curatedCocktailsList.length > 0 && (
        <CuratedSectionWrapper theme={theme}>
          <CuratedSectionHeader theme={theme}>{currentBarSpecifics.curatedMenuName}</CuratedSectionHeader>
          <CocktailList 
            cocktails={curatedCocktailsList} 
            // selectedBar and isCocktailMakeable (function) props removed
          />
        </CuratedSectionWrapper>
      )}

      {/* Available Cocktails Section */}
      {availableCocktails.length > 0 ? (
        <>
          <AvailableCocktailsHeader theme={theme}>On The Bar</AvailableCocktailsHeader>
          <CocktailList 
            cocktails={availableCocktails} 
            // selectedBar and isCocktailMakeable (function) props removed
          />
        </>
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
