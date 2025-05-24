import React from 'react';
import styled from 'styled-components';
import CocktailListItem from './CocktailListItem';

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); // Responsive grid
  gap: ${({ theme }) => theme.spacing.large}; // Slightly larger gap for cocktail cards
  padding: ${({ theme }) => theme.spacing.medium} 0;
`;

const CocktailList = ({ cocktails }) => {
  return (
    <ListWrapper>
      {cocktails.map(cocktail => (
        <CocktailListItem key={cocktail.id} cocktail={cocktail} />
      ))}
    </ListWrapper>
  );
};

export default CocktailList;
