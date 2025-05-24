import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PlaceholderImage from '../assets/cocktails/placeholder.png';
import { useFavorites } from '../hooks/useFavorites'; // Import useFavorites

// Styled components (ensure they exist or are defined if not already)
const ListItemWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.medium};
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  position: relative; 
`;

const CocktailImage = styled.img`
  width: 100%;
  height: 200px; 
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CocktailName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem; 
  margin: ${({ theme }) => theme.spacing.small} 0;
  min-height: 3em; // Ensure space for two lines of text to avoid layout shifts
`;

const ViewLink = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  font-weight: 500;
  margin-top: ${({ theme }) => theme.spacing.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const AvailabilityIndicator = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.small};
  right: ${props => props.theme.spacing.small};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.isMakeable === true) return 'green';
    if (props.isMakeable === false) return 'red';  
    return 'transparent'; 
  }};
  border: 1px solid ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.small};
  z-index: 1; // Ensure it's above other elements if overlapping
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.small};
  left: ${props => props.theme.spacing.small}; // Positioned on the left
  background: transparent;
  border: none;
  color: ${props => props.isFavorite ? props.theme.colors.primary : props.theme.colors.textOffset};
  font-size: 1.8rem; // Larger heart icon
  cursor: pointer;
  padding: 0;
  z-index: 1; // Ensure it's above other elements

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;


const CocktailListItem = ({ cocktail, isMakeable, selectedBar }) => {
  const { isFavorite, toggleFavorite } = useFavorites(); // Use the hook

  if (!cocktail) return null;

  const imageSrc = cocktail.image || PlaceholderImage;
  const currentIsFavorite = isFavorite(cocktail.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent link navigation if heart is on top of link area
    e.stopPropagation(); // Prevent card click event if any
    toggleFavorite(cocktail.id);
  };

  return (
    <ListItemWrapper>
      <FavoriteButton
        isFavorite={currentIsFavorite}
        onClick={handleFavoriteClick}
        title={currentIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        {currentIsFavorite ? '♥' : '♡'}
      </FavoriteButton>
      {(selectedBar === 'bar1' || selectedBar === 'bar2') && (
        <AvailabilityIndicator isMakeable={isMakeable} title={isMakeable ? 'Available' : 'Unavailable'} />
      )}
      <Link to={`/cocktails/${cocktail.id}`} style={{ textDecoration: 'none' }}>
        <CocktailImage src={imageSrc} alt={cocktail.name} />
        <CocktailName>{cocktail.name}</CocktailName>
      </Link>
      <ViewLink to={`/cocktails/${cocktail.id}`}>View Recipe</ViewLink>
    </ListItemWrapper>
  );
};

export default CocktailListItem;
