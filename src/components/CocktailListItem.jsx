import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import PlaceholderImage from '../assets/cocktails/placeholder.png'; // Removed
import { getImageUrl } from '../utils/cocktailImageLoader.js'; // Corrected path
import { useFavorites } from '../hooks/useFavorites'; // Import useFavorites
import bar1StockData from '../data/bar1_stock.json'; // Added
import bar2StockData from '../data/bar2_stock.json'; // Added

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

// New styled components for Bar Availability Icons
const BarAvailabilityIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const SingleBarIcon = styled.span`
  font-size: 0.8em;
  margin-left: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, available }) => available ? theme.colors.secondary : theme.colors.textOffset};
  border: 1px solid ${({ theme, available }) => available ? theme.colors.secondary : theme.colors.textOffset};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2px 4px;
  white-space: nowrap;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: auto;
  left: auto;
  bottom: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  background: transparent;
  border: 2px solid ${({ theme, isFavorite }) => isFavorite ? theme.colors.primary : theme.colors.textOffset};
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
    top: auto;
    left: auto;
    bottom: ${({ theme }) => theme.spacing.xs};
    right: ${({ theme }) => theme.spacing.xs};
  }
`;

// Helper function to check makeability
const checkMakeable = (cocktailIngredients, barStockIngredients) => {
  if (!cocktailIngredients || !barStockIngredients) return false;
  return cocktailIngredients.every(ing =>
    barStockIngredients.some(stockIng => stockIng.name === ing.name && stockIng.available)
  );
};

const CocktailListItem = ({ cocktail }) => { // Removed isMakeable and selectedBar from props
  const { isFavorite, toggleFavorite } = useFavorites(); // Use the hook

  if (!cocktail) return null;

  const imageSrc = getImageUrl(cocktail.image); // New way
  const currentIsFavorite = isFavorite(cocktail.id);

  const isMakeableBarA = checkMakeable(cocktail.ingredients, bar1StockData.ingredients);
  const isMakeableBarB = checkMakeable(cocktail.ingredients, bar2StockData.ingredients);

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
      {/* Old AvailabilityIndicator removed */}
      <Link to={`/cocktails/${cocktail.id}`} style={{ textDecoration: 'none' }}>
        <CocktailImage src={imageSrc} alt={cocktail.name} />
        <CocktailName>{cocktail.name}</CocktailName>
      </Link>
      <BarAvailabilityIconWrapper>
        <SingleBarIcon available={isMakeableBarA}>Bar A</SingleBarIcon>
        <SingleBarIcon available={isMakeableBarB}>Bar B</SingleBarIcon>
      </BarAvailabilityIconWrapper>
      <ViewLink to={`/cocktails/${cocktail.id}`}>View Recipe</ViewLink>
    </ListItemWrapper>
  );
};

export default CocktailListItem;
