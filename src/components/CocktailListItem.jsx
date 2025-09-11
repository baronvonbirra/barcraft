import React, { useMemo, useContext } from 'react'; // Added useContext
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/cocktailImageLoader.js';
import { useFavorites } from '../hooks/useFavorites';
import { useBar } from '../contexts/BarContext'; // Import useBar

// Styled components
const ListItemWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.medium};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  aspect-ratio: 3/2;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
  display: block;
`;

const CocktailName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  margin: 0 0 ${({ theme }) => theme.spacing.small} 0;
  min-height: 2.5em;

  @media (max-width: 600px) {
    font-size: 1.1rem;
    min-height: 2.2em;
  }
`;

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
  margin-top: auto;
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

const AvailabilityIndicator = styled(({ isMakeable, ...rest }) => <div {...rest} />)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme, isMakeable }) => {
    if (isMakeable === true) return theme.colors.secondary;
    if (isMakeable === false) return '#E74C3C';
    return 'transparent';
  }};
  border: 1px solid ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.small};
  z-index: 1;
`;

const BarAvailabilityIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const SingleBarAvailabilityIcon = styled(({ isAvailable, ...rest }) => <span {...rest} />)`
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadiusSmall || '4px'};
  font-size: 0.75rem;
  font-weight: bold;
  color: ${({ theme, isAvailable }) => isAvailable ? theme.colors.secondary : theme.colors.error || '#E74C3C'};
  background-color: transparent;
  border: 1px solid ${({ theme, isAvailable }) => isAvailable ? theme.colors.secondary : theme.colors.error || '#E74C3C'};

  &:not(:last-child) {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const FavoriteButton = styled(({ isFavorite, ...rest }) => <button {...rest} />)`
  position: absolute;
  top: auto;
  left: auto;
  bottom: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  background: transparent;
  border: none;
  color: ${({ theme, isFavorite }) => isFavorite ? '#DA70D6' : theme.colors.textOffset};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  z-index: 1;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme, isFavorite }) => isFavorite ? '#C060C0' : '#DA70D6'};
  }

  @media (max-width: 600px) {
    font-size: 1.3rem;
    top: auto;
    left: auto;
    bottom: ${({ theme }) => theme.spacing.xs};
    right: ${({ theme }) => theme.spacing.xs};
  }
`;

const checkMakeableForBar = (cocktailIngredients, barStockSet) => {
  if (!cocktailIngredients || cocktailIngredients.length === 0) return true;
  return cocktailIngredients.every(ing =>
    ing.isEssential === false || barStockSet.has(ing.id)
  );
};

const CocktailListItem = ({ cocktail, isMakeable }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { barAStock, barBStock, barsData } = useBar();

  if (!cocktail) return null;

  const imageSrc = getImageUrl(cocktail.image);
  const currentIsFavorite = isFavorite(cocktail.id);

  const isMakeableBar1 = useMemo(() => checkMakeableForBar(cocktail.ingredients, barAStock), [cocktail.ingredients, barAStock]);
  const isMakeableBar2 = useMemo(() => checkMakeableForBar(cocktail.ingredients, barBStock), [cocktail.ingredients, barBStock]);

  const bar1Name = barsData.bar1?.barName || 'Level One';
  const bar2Name = barsData.bar2?.barName || 'The Glitch';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(cocktail.id);
  };

  return (
    <ListItemWrapper>
      <Link to={`/cocktails/${cocktail.id}`} style={{ textDecoration: 'none' }}>
        <ImageContainer>
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
      <BarAvailabilityIconWrapper>
        <SingleBarAvailabilityIcon
          isAvailable={isMakeableBar1}
          title={`${bar1Name}: ${isMakeableBar1 ? 'Available' : 'Unavailable'}`}
        >
          L1
        </SingleBarAvailabilityIcon>
        <SingleBarAvailabilityIcon
          isAvailable={isMakeableBar2}
          title={`${bar2Name}: ${isMakeableBar2 ? 'Available' : 'Unavailable'}`}
        >
          TG
        </SingleBarAvailabilityIcon>
      </BarAvailabilityIconWrapper>
      <ViewLink to={`/cocktails/${cocktail.id}`}>View Recipe</ViewLink>
    </ListItemWrapper>
  );
};

export default CocktailListItem;
