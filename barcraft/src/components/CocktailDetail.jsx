import React from 'react';
import styled from 'styled-components';

const DetailWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
  margin-top: ${({ theme }) => theme.spacing.large};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  text-align: left; // Align text to the left for readability
  max-width: 800px; // Max width for better readability on large screens
  margin-left: auto;
  margin-right: auto;
`;

const CocktailImage = styled.img`
  width: 100%;
  max-width: 400px; // Control max image size
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  display: block; // Center image if wrapper is text-align: center, or use margin auto
  margin-left: auto;
  margin-right: auto;
`;

const CocktailName = styled.h2`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const SubHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.8rem;
  margin-top: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.small};
`;

const IngredientList = styled.ul`
  list-style-type: none; // Remove default bullets
  padding-left: 0;
  margin-bottom: ${({ theme }) => theme.spacing.large};

  li {
    font-size: 1.1rem;
    line-height: 1.8;
    padding: ${({ theme }) => theme.spacing.small} 0;
    border-bottom: 1px dashed ${({ theme }) => theme.colors.border}; // Subtle separator
    &:last-child {
      border-bottom: none;
    }
  }
`;

const Instructions = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap; // Preserve line breaks from data
`;

const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
`;

const CocktailDetail = ({ cocktail }) => {
  if (!cocktail) {
    return <LoadingMessage>Select a cocktail to see the details, or loading...</LoadingMessage>;
  }

  return (
    <DetailWrapper>
      <CocktailName>{cocktail.name}</CocktailName>
      <CocktailImage src={cocktail.image} alt={cocktail.name} />
      
      <SubHeading>Ingredients</SubHeading>
      <IngredientList>
        {cocktail.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </IngredientList>
      
      <SubHeading>Instructions</SubHeading>
      <Instructions>{cocktail.instructions}</Instructions>
    </DetailWrapper>
  );
};

export default CocktailDetail;
