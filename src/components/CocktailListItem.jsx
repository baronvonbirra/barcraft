import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import PlaceholderImage from '../assets/cocktails/placeholder.png'; // Removed
import { getImageUrl } from '../utils/cocktailImageLoader.js'; // Corrected path
import { useFavorites } from '../hooks/useFavorites'; // Import useFavorites
// Removed bar1StockData, bar2StockData, barSpecificData

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

// New styled components for Bar Availability Icons
const BarAvailabilityIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

// BarAvailabilityIconWrapper and SingleBarIcon removed

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

// Helper function checkMakeable removed

const CocktailListItem = ({ cocktail, isMakeable }) => { // Added isMakeable to props
  const { isFavorite, toggleFavorite } = useFavorites(); // Use the hook

  if (!cocktail) return null;

  const imageSrc = getImageUrl(cocktail.image); // New way
  const currentIsFavorite = isFavorite(cocktail.id);

  // isMakeableBarA and isMakeableBarB calculations removed

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent link navigation if heart is on top of link area
    e.stopPropagation(); // Prevent card click event if any
    toggleFavorite(cocktail.id);
  };

  return (
    <ListItemWrapper>
      <Link to={`/cocktails/${cocktail.id}`} style={{ textDecoration: 'none' }}>
        <ImageContainer>
          {/* Render AvailabilityIndicator if isMakeable is true or false, but not undefined/null */}
          {typeof isMakeable === 'boolean' && <AvailabilityIndicator isMakeable={isMakeable} />}
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
      {/* BarAvailabilityIconWrapper removed */}
      <ViewLink to={`/cocktails/${cocktail.id}`}>View Recipe</ViewLink>
    </ListItemWrapper>
  );
};

export default CocktailListItem;
