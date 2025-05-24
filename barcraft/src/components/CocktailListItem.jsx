import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ItemWrapper = styled(Link)`
  display: block;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden; // Ensures image corners are also rounded if image is flush
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5); // Enhanced shadow for dark theme
  }
`;

const CocktailImage = styled.img`
  width: 100%;
  height: 200px; // Fixed height for uniform card size
  object-fit: cover; // Ensures image covers the area, cropping if necessary
  display: block; // Remove any extra space below the image
`;

const InfoWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
`;

const CocktailName = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0; // Remove default paragraph margin
  color: ${({ theme }) => theme.colors.primary}; // Use primary color for cocktail name
  white-space: nowrap; // Prevent long names from wrapping and breaking layout
  overflow: hidden;
  text-overflow: ellipsis; // Add ellipsis for very long names
`;

const CocktailListItem = ({ cocktail }) => {
  return (
    <ItemWrapper to={`/cocktails/${cocktail.id}`}>
      <CocktailImage src={cocktail.image} alt={cocktail.name} />
      <InfoWrapper>
        <CocktailName>{cocktail.name}</CocktailName>
      </InfoWrapper>
    </ItemWrapper>
  );
};

export default CocktailListItem;
