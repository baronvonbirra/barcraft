import React from 'react';
import styled from 'styled-components';
import CocktailListItem from './CocktailListItem';

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;

  @media (max-width: 600px) { // Small mobile screens
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); // Allow cards to be a bit smaller
    gap: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  }

  @media (max-width: 320px) { // Very small mobile screens
    grid-template-columns: 1fr; // Single column
    gap: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  }
`;

// Accept isCocktailMakeable function and selectedBar string as props
const CocktailList = ({ cocktails, isCocktailMakeable, selectedBar }) => {
  if (!cocktails) return <p>No cocktails to display.</p>;
  if (cocktails.length === 0) return <p>No cocktails match your current filters.</p>;

  return (
    <ListWrapper>
      {cocktails.map(cocktail => (
        <CocktailListItem
          key={cocktail.id}
          cocktail={cocktail}
          // Call isCocktailMakeable for each cocktail and pass the result
          isMakeable={isCocktailMakeable ? isCocktailMakeable(cocktail.ingredients) : undefined}
          selectedBar={selectedBar}
        />
      ))}
    </ListWrapper>
  );
};

export default CocktailList;
