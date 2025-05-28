import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import PlaceholderImage from '../assets/cocktails/placeholder.png'; // Removed
import { getImageUrl } from '../utils/cocktailImageLoader.js'; // Corrected path
import { useFavorites } from '../hooks/useFavorites'; // Import useFavorites
import bar1StockData from '../data/bar1_stock.json';
import bar2StockData from '../data/bar2_stock.json';
import barSpecificData from '../data/bar_specific_data.json';

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

const ImageContainer = styled.div`
  position: relative;
  width: 100%; 
  margin-bottom: ${({ theme }) => theme.spacing.medium}; 
`;

const CocktailImage = styled.img`
  width: 100%;
  aspect-ratio: 3/2; /* Or height: 180px; */
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius}; /* Full radius if image is main element */
  display: block; // Added
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

// AvailabilityIndicator removed.

// New styled components for general bar availability
const BarAvailabilityWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.medium}; // Added more margin for separation
`;

const BarAvailabilityTag = styled.span`
  font-size: 0.8em;
  color: #fff; // White text
  background-color: ${({ available, theme }) => 
    available ? theme.colors.secondary : theme.colors.textOffset}; // Green if available, grey if not
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 3px 6px;
  margin: 2px;
  white-space: nowrap;
  display: inline-block;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: auto;
  left: auto;
  bottom: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  background: transparent;
  border: none; // Border removed
  color: ${({ theme, isFavorite }) => isFavorite ? '#DA70D6' : theme.colors.textOffset}; // New colors
  font-size: 1.5rem; /* Slightly smaller for better balance */
  cursor: pointer;
  padding: 0;
  z-index: 1; // Keep z-index
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme, isFavorite }) => isFavorite ? '#C060C0' : '#DA70D6'}; // New hover colors
  }

  @media (max-width: 600px) {
    font-size: 1.3rem; // Adjust icon size on smaller screens
    top: auto;
    left: auto;
    bottom: ${({ theme }) => theme.spacing.xs};
    right: ${({ theme }) => theme.spacing.xs};
  }
`;

// Helper function to check makeability at a specific bar
const checkMakeableAtBar = (cocktailIngredients, barStockData) => {
  if (!cocktailIngredients || !barStockData) return false;

  const availableStockIds = new Set(
    barStockData
      .filter(item => item.isAvailable)
      .map(item => item.id)
  );

  if (!cocktailIngredients || cocktailIngredients.length === 0) return true; // Makeable if no ingredients

  return cocktailIngredients.every(ing => {
    if (!ing.isEssential) return true; // Optional ingredients don't break makeability
    return availableStockIds.has(ing.id);
  });
};

const CocktailListItem = ({ cocktail }) => { // Removed isMakeable prop
  const { isFavorite, toggleFavorite } = useFavorites(); // Use the hook

  if (!cocktail) return null;

  const imageSrc = getImageUrl(cocktail.image);
  const currentIsFavorite = isFavorite(cocktail.id);

  const isMakeableBar1 = checkMakeableAtBar(cocktail.ingredients, bar1StockData);
  const isMakeableBar2 = checkMakeableAtBar(cocktail.ingredients, bar2StockData);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent link navigation if heart is on top of link area
    e.stopPropagation(); // Prevent card click event if any
    toggleFavorite(cocktail.id);
  };

  return (
    <ListItemWrapper>
      <Link to={`/cocktails/${cocktail.id}`} style={{ textDecoration: 'none' }}>
        <ImageContainer>
          {/* AvailabilityIndicator removed */}
          <CocktailImage src={imageSrc} alt={cocktail.name} />
          <FavoriteButton
            isFavorite={currentIsFavorite}
            onClick={handleFavoriteClick}
            title={currentIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-pressed={currentIsFavorite}
            aria-label={currentIsFavorite ? `Remove ${cocktail.name} from Favorites` : `Add ${cocktail.name} to Favorites`}
          >
            {currentIsFavorite ? '♥' : '♡'}
          </FavoriteButton>
        </ImageContainer>
        <CocktailName>{cocktail.name}</CocktailName>
      </Link>
      <BarAvailabilityWrapper>
        <BarAvailabilityTag available={isMakeableBar1} theme={cocktail.theme}> 
          {barSpecificData.bar1.barName}: {isMakeableBar1 ? 'Available' : 'Unavailable'}
        </BarAvailabilityTag>
        <BarAvailabilityTag available={isMakeableBar2} theme={cocktail.theme}>
          {barSpecificData.bar2.barName}: {isMakeableBar2 ? 'Available' : 'Unavailable'}
        </BarAvailabilityTag>
      </BarAvailabilityWrapper>
      <ViewLink to={`/cocktails/${cocktail.id}`}>View Recipe</ViewLink>
    </ListItemWrapper>
  );
};

export default CocktailListItem;
