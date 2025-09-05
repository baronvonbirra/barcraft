import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useFavorites } from '../hooks/useFavorites';
import CocktailList from '../components/CocktailList';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  text-align: center;
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
  const [favoriteCocktails, setFavoriteCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedBar } = useBar();
  const { isCocktailMakeable } = useCocktailFilter([]); // Pass empty array

  useEffect(() => {
    const fetchFavoriteCocktails = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteCocktails([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('cocktails')
        .select(`
          *,
          cocktail_ingredients!cocktail_id(
            quantity,
            notes,
            ingredients (id, name)
          )
        `)
        .in('id', favoriteIds);

      if (error) {
        console.error('Error fetching favorite cocktails:', error);
        setFavoriteCocktails([]);
      } else {
        const processedCocktails = data.map(cocktail => ({
          ...cocktail,
          ingredients: cocktail.cocktail_ingredients?.map(ci => ({
            ...ci.ingredients,
            quantity: ci.quantity,
            notes: ci.notes,
          })) || [],
        }));
        setFavoriteCocktails(processedCocktails);
      }
      setLoading(false);
    };

    fetchFavoriteCocktails();
  }, [favoriteIds]);

  if (loading) {
    return <PageWrapper><PageTitle>Loading Favorites...</PageTitle></PageWrapper>;
  }

  return (
    <PageWrapper>
      <PageTitle>My Favorite Cocktails</PageTitle>
      {favoriteCocktails.length > 0 ? (
        <CocktailList
          cocktails={favoriteCocktails}
          isCocktailMakeable={isCocktailMakeable}
          selectedBar={selectedBar}
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
