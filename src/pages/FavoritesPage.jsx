import React from 'react';
import styled from 'styled-components';
import { useFavorites } from '../hooks/useFavorites';
import cocktailsData from '../data/cocktails.json';
import CocktailList from '../components/CocktailList';
import { useCocktailFilter } from '../hooks/useCocktailFilter'; // For availability consistent with HomePage
import { useBar } from '../contexts/BarContext'; // For availability

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  text-align: center; // Center title and messages
  animation: fadeInPage 0.5s ease-out forwards;
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const NoFavoritesMessage = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textOffset};
`;

const FavoritesPage = () => {
  const { favoriteIds } = useFavorites();
  
  // Get these for CocktailList consistency, even if not primary focus of this page
  const { selectedBar } = useBar(); 
  // Note: useCocktailFilter is used here mainly to get isCocktailMakeable.
  // The primary filtering for this page is based on favoriteIds.
  const { isCocktailMakeable } = useCocktailFilter(cocktailsData); 

  const favoriteCocktails = cocktailsData.filter(cocktail => favoriteIds.includes(cocktail.id));

  return (
    <PageWrapper>
      <PageTitle>My Favorite Cocktails</PageTitle>
      {favoriteCocktails.length > 0 ? (
        <CocktailList
          cocktails={favoriteCocktails}
          isCocktailMakeable={isCocktailMakeable} // Pass down for consistency
          selectedBar={selectedBar}             // Pass down for consistency
        />
      ) : (
        <NoFavoritesMessage>
          You haven't added any cocktails to your favorites yet. Start exploring and add some!
        </NoFavoritesMessage>
      )}
    </PageWrapper>
  );
};

export default FavoritesPage;
