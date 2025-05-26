import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PlaceholderImage from '../assets/cocktails/placeholder.png';
import { useFavorites } from '../hooks/useFavorites'; // Import useFavorites

// Styled components (ensure they exist or are defined if not already)
const ListItemWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.medium};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* For consistent card heights in a grid */
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const CocktailImage = styled.img`
  width: 100%;
  aspect-ratio: 3/2; /* Or height: 180px; */
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius}; /* Full radius if image is main element */
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CocktailName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0; /* Adjusted margin */
  min-height: 2.5em; // Ensure space for text to avoid layout shifts, adjust as needed

  @media (max-width: 600px) {
    font-size: 1.1rem; // Slightly smaller font for smaller cards
    min-height: 2.2em;
  }
`;

// Description/Tags (Example, if added later)
// const CocktailTags = styled.p`
//   font-family: ${({ theme }) => theme.fonts.main};
//   color: ${({ theme }) => theme.colors.textOffset};
//   font-size: 0.9rem;
//   margin-bottom: ${({ theme }) => theme.spacing.small};
// `;

const ViewLink = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 600;
  text-transform: uppercase;
  margin-top: auto; /* Pushes button to the bottom if card is flex column */
  transition: all 0.3s ease;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.onSecondary};
    box-shadow: ${({ theme }) => theme.shadows.small};
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.small};
    font-size: 0.8rem;
  }
`;

const AvailabilityIndicator = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme, isMakeable }) => {
    if (isMakeable === true) return theme.colors.secondary; // Use theme color for "green"
    if (isMakeable === false) return '#E74C3C'; // A generic red, or add to theme.colors.error
    return 'transparent';
  }};
  border: 1px solid ${({ theme }) => theme.colors.surface}; /* Border against card background */
  box-shadow: ${({ theme }) => theme.shadows.small};
  z-index: 1;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  left: ${({ theme }) => theme.spacing.small};
  background: transparent;
  border: none;
  color: ${({ theme, isFavorite }) => isFavorite ? theme.colors.primary : theme.colors.textOffset};
  font-size: 1.5rem; /* Slightly smaller for better balance */
  cursor: pointer;
  padding: 0;
  z-index: 1;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme, isFavorite }) => isFavorite ? theme.colors.secondary : theme.colors.primary};
  }

  @media (max-width: 600px) {
    font-size: 1.3rem; // Adjust icon size on smaller screens
    top: ${({ theme }) => theme.spacing.xs};
    left: ${({ theme }) => theme.spacing.xs};
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
        aria-pressed={currentIsFavorite}
        aria-label={currentIsFavorite ? `Remove ${cocktail.name} from Favorites` : `Add ${cocktail.name} to Favorites`}
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
