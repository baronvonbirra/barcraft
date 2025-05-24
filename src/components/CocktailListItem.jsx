import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PlaceholderImage from '../assets/cocktails/placeholder.png';

const ItemWrapper = styled(Link)`
  display: block;
  background-color: ${({ theme }) => (theme.colors && theme.colors.surface) || '#282C34'};
  border-radius: ${({ theme }) => theme.borderRadius || '8px'};
  text-decoration: none;
  color: ${({ theme }) => (theme.colors && theme.colors.text) || '#EAEAEA'};
  overflow: hidden; 
  border: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#3A3F4B'};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => (theme.shadows && theme.shadows.medium) || '0 4px 8px rgba(0,0,0,0.3)'};
  }
`;

const CocktailImage = styled.img`
  width: 100%;
  height: 200px; 
  object-fit: cover; 
  display: block; 
  /* No theme-dependent styles here, but border-radius will be clipped by ItemWrapper's overflow:hidden */
`;

const InfoWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
`;

const CocktailName = styled.p`
  font-size: 1.3rem; // Consider if this should be themeable, e.g., theme.fontSizes.large
  font-weight: bold; // GlobalStyles p sets this, or make themeable: theme.fontWeights.bold
  margin: 0; 
  color: ${({ theme }) => (theme.colors && theme.colors.primary) || '#3498DB'}; 
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
`;

const CocktailListItem = ({ cocktail }) => {
  const imageSrc = cocktail.image ? cocktail.image : PlaceholderImage;

  return (
    <ItemWrapper to={`/cocktails/${cocktail.id}`}>
      <CocktailImage src={imageSrc} alt={cocktail.name} />
      <InfoWrapper>
        <CocktailName>{cocktail.name}</CocktailName>
      </InfoWrapper>
    </ItemWrapper>
  );
};

export default CocktailListItem;
