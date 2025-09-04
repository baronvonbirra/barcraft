// In HomePage.jsx (example, actual file might differ slightly)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import cocktailsData from '../data/cocktails.json'; // Still needed for CocktailOfTheWeek
// import { useCocktailFilter } from '../hooks/useCocktailFilter'; // Removed
// import { useBar } from '../contexts/BarContext'; // Removed
// import CocktailList from '../components/CocktailList'; // Removed
// import FilterSidebar from '../components/FilterSidebar'; // Removed
import categoriesData from '../data/categories.json'; // Still needed for CategoryList
import thematicCategoriesData from '../data/thematicCategories.json'; // Added for thematic categories
import CategoryList from '../components/CategoryList'; // Added
import SurpriseMeButton from '../components/SurpriseMeButton'; // Added
import { getImageUrl } from '../utils/cocktailImageLoader.js'; // Corrected path with .js

// Styled components for HomePage
const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  animation: fadeInPage 0.5s ease-out forwards;
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
  /* margin, display, width properties are specific to FilterToggleButton, removed here */
  /* This component (ViewRecipeButton) is kept for CocktailOfTheWeek */

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.secondary}; // Example: darken primary or use secondary
    color: ${({ theme }) => theme.colors.onSecondary};
    box-shadow: ${({ theme }) => theme.shadows.small};
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`;

// FilterToggleButton styled component removed.

const HomePageWrapper = styled.div`
  display: flex;
  flex-direction: column; // Stack sections vertically
  gap: ${({ theme }) => theme.spacing.large};
  padding: 0 ${({ theme }) => theme.spacing.medium};
`;

const SurpriseButtonWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.large} auto; // For vertical spacing and horizontal centering
  padding: 0 ${({ theme }) => theme.spacing.medium}; // Horizontal padding for narrower screens
  max-width: 400px; // Constrain the button's effective width on wider screens
  width: 100%; // Ensure it's responsive
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
  const [cocktailToDisplay, setCocktailToDisplay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocktailOfTheWeek = async () => {
      const { data, error } = await supabase
        .from('cocktail_of_the_week')
        .select('cocktail_id');

      if (error) {
        console.error('Error fetching cocktail of the week:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        let selectedCocktailId;
        if (data.length === 1) {
          selectedCocktailId = data[0].cocktail_id;
        } else {
          // If more than one, pick one randomly
          const randomIndex = Math.floor(Math.random() * data.length);
          selectedCocktailId = data[randomIndex].cocktail_id;
        }
        const cocktail = cocktailsData.find(c => c.id === selectedCocktailId);
        setCocktailToDisplay(cocktail);
      }

      setLoading(false);
    };

    fetchCocktailOfTheWeek();
  }, []);

  return (
    <PageWrapper>
      <HomePageWrapper>
        {!loading && cocktailToDisplay && (
          <CocktailOfTheWeekWrapper>
            <CocktailName>{cocktailToDisplay.name} - Cocktail of the Week!</CocktailName>
            <CocktailImage src={getImageUrl(cocktailToDisplay.image)} alt={cocktailToDisplay.name} />
            <CocktailDescription>{cocktailToDisplay.description}</CocktailDescription>
            <ViewRecipeButton to={`/cocktails/${cocktailToDisplay.id}`}>View Recipe</ViewRecipeButton>
          </CocktailOfTheWeekWrapper>
        )}

        <SurpriseButtonWrapper>
          <SurpriseMeButton filteredCocktails={cocktailsData} />
        </SurpriseButtonWrapper>
        
        <MainContent>
          {/* Heading for categories */}
          <SectionHeading>Browse by Spirit</SectionHeading>
          <CategoryList categories={categoriesData} />

          {/* Heading for thematic categories */}
          <SectionHeading>Explore by Theme</SectionHeading>
          <CategoryList categories={thematicCategoriesData} />
          {/* CocktailList removed */}
        </MainContent>
      </HomePageWrapper>
    </PageWrapper>
  );
};

export default HomePage;
