// In HomePage.jsx (example, actual file might differ slightly)
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import cocktailsData from '../data/cocktails.json'; // Full list of cocktails
import { useCocktailFilter } from '../hooks/useCocktailFilter'; // The main filter hook
import { useBar } from '../contexts/BarContext'; // To get selectedBar
import CocktailList from '../components/CocktailList';
import FilterSidebar from '../components/FilterSidebar'; // Assuming FilterSidebar is ready to be used
import categoriesData from '../data/categories.json'; // For FilterSidebar
import mojitoImage from '../assets/cocktails/mojito.jpg'; // Import the image

// Styled components for HomePage
const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
`;

const CocktailOfTheWeekWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const CocktailImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CocktailName = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography ? theme.typography.h2Size : '2rem'}; // Assuming h2Size from theme

  @media (max-width: 600px) {
    font-size: ${({ theme }) => theme.typography ? `calc(${theme.typography.h2Size} * 0.85)` : '1.7rem'};
  }
`;

const CocktailDescription = styled.p`
  color: ${({ theme }) => theme.colors.textOffset};
  font-size: 0.9rem;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

const ViewRecipeButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: none;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.secondary}; // Example: darken primary or use secondary
    color: ${({ theme }) => theme.colors.onSecondary};
    box-shadow: ${({ theme }) => theme.shadows.small};
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const FilterToggleButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: none;
  margin: 0 auto ${({ theme }) => theme.spacing.large} auto; // Center button
  display: block; // To allow margin auto to work
  width: fit-content;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.secondary}; // Example: darken primary or use secondary
    color: ${({ theme }) => theme.colors.onSecondary};
    box-shadow: ${({ theme }) => theme.shadows.small};
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const HomePageWrapper = styled.div`
  display: flex;
  flex-direction: column; // Stack sections vertically
  gap: ${({ theme }) => theme.spacing.large};
  padding: 0 ${({ theme }) => theme.spacing.medium};
`;

const MainContent = styled.div`
  flex-grow: 1; // Takes remaining space if HomePageWrapper was flex row
`;

const SectionHeading = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;


const HomePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const filterSidebarId = "filter-sidebar"; // Define an ID for ARIA

  const cocktailOfTheWeek = cocktailsData.find(c => c.id === "mojito");

  const {
    filteredCocktails,
    baseSpirit, setBaseSpirit,
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

  const filterHookState = {
    baseSpirit, includeIngredients, excludeIngredients, flavorProfile, difficulty, tags, glassType,
  };
  const filterHookSetters = {
    setBaseSpirit, setIncludeIngredients, setExcludeIngredients, setFlavorProfile, setDifficulty, setTags, setGlassType,
  };

  return (
    <PageWrapper>
      <HomePageWrapper>
        {cocktailOfTheWeek && (
          <CocktailOfTheWeekWrapper>
            <CocktailName>{cocktailOfTheWeek.name} - Cocktail of the Week!</CocktailName>
            {/* Alt text is already cocktailOfTheWeek.name, which is good and descriptive */}
            <CocktailImage src={mojitoImage} alt={cocktailOfTheWeek.name} />
            <CocktailDescription>{cocktailOfTheWeek.description}</CocktailDescription>
            <ViewRecipeButton to={`/cocktails/${cocktailOfTheWeek.id}`}>View Recipe</ViewRecipeButton>
          </CocktailOfTheWeekWrapper>
        )}

        <FilterToggleButton
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls={filterSidebarId}
          aria-label={showFilters ? "Hide filters panel" : "Show filters panel"}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </FilterToggleButton>

        {showFilters && (
          <FilterSidebar
            id={filterSidebarId} // Pass the ID to FilterSidebar
            allCocktails={cocktailsData}
            categories={categoriesData}
            filters={filterHookState}
            setters={filterHookSetters}
            filteredCocktailsForSurprise={filteredCocktails}
            resetFilters={resetFilters}
          />
        )}
        
        <MainContent>
          <SectionHeading>Browse Cocktails</SectionHeading>
          <CocktailList
            cocktails={filteredCocktails}
            isCocktailMakeable={isCocktailMakeable}
            selectedBar={selectedBar}
          />
        </MainContent>
      </HomePageWrapper>
    </PageWrapper>
  );
};

export default HomePage;
