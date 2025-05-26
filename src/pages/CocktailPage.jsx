import React, { useContext, useMemo } from 'react'; // Added useMemo
import { useParams, Link } from 'react-router-dom'; // Added Link
import styled from 'styled-components';
import cocktailsData from '../data/cocktails.json';
// import { useCocktailFilter } from '../hooks/useCocktailFilter'; // To be removed
// import { useBar } from '../contexts/BarContext'; // To be removed
import { useFavorites } from '../hooks/useFavorites';
import { ThemeContext } from '../contexts/ThemeContext';
import { getImageUrl } from '../../utils/cocktailImageLoader'; // Added
import bar1StockData from '../data/bar1_stock.json';
import bar2StockData from '../data/bar2_stock.json';

// Styled Components (ensure they are defined or reuse existing ones if applicable)
const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
  animation: fadeInPage 0.5s ease-out forwards;
`;

const CocktailHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  position: relative; // For FavoriteButton positioning
`;

const CocktailNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CocktailName = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2.5rem;
  margin: 0; // Remove default margin
  margin-right: ${({ theme }) => theme.spacing.medium}; // Space for the button
`;

const FavoriteButtonDetail = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.isFavorite ? props.theme.colors.primary : props.theme.colors.textOffset};
  font-size: 2.5rem; // Larger heart icon for detail page
  cursor: pointer;
  padding: 0;
  line-height: 1; // Align icon better with text

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const CocktailImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CocktailDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.large};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailSection = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  h2 {
    font-family: ${({ theme }) => theme.fonts.headings};
    color: ${({ theme }) => theme.colors.secondary};
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.small};
  }
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientListItem = styled.li`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  color: ${props => props.available === false ? props.theme.colors.textOffset : props.theme.colors.text};
  font-style: ${props => props.available === false ? 'italic' : 'normal'};
  
  .unavailable-note {
    font-size: 0.8em;
    margin-left: ${({ theme }) => theme.spacing.small};
    color: ${props => props.theme.colors.textOffset};
  }
`;

const AvailabilityStatus = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${props => props.isMakeable ? props.theme.colors.secondary : props.theme.colors.surface};
  color: ${props => props.isMakeable ? props.theme.colors.onPrimary : props.theme.colors.textOffset};
  border: 1px solid ${props => props.isMakeable ? props.theme.colors.secondary : props.theme.colors.border};
  text-align: center;
  font-weight: bold;
`;

const FilterLinkTag = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textOffset};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  margin-right: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small}; // For wrapping
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Re-define or import BarAvailabilityIconWrapper and SingleBarIcon
const BarAvailabilityIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium}; /* Increased gap for page view */
  margin-top: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.large}; /* Increased margin for page view */
`;

const SingleBarIcon = styled.span`
  font-size: 1em; /* Larger font size for page view */
  color: ${({ theme, available }) => available ? theme.colors.secondary : theme.colors.textOffset};
  border: 1px solid ${({ theme, available }) => available ? theme.colors.secondary : theme.colors.textOffset};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.small};
  white-space: nowrap;
  
  .bar-name {
    font-weight: bold;
  }
  .status {
    margin-left: ${({ theme }) => theme.spacing.xs};
  }
`;

// Helper function to check makeability
const checkMakeable = (cocktailIngredients, barStockIngredients) => {
  if (!cocktailIngredients || !barStockIngredients) return false;
  return cocktailIngredients.every(ing =>
    barStockIngredients.some(stockIng => stockIng.name === ing.name && stockIng.available)
  );
};

const CocktailPage = () => {
  const { cocktailId } = useParams();
  const { theme } = useContext(ThemeContext);
  // selectedBar and related logic (isCocktailMakeable, getIngredientAvailability from useCocktailFilter) are removed
  // as we now show availability for both bars.
  const { isFavorite, toggleFavorite } = useFavorites();

  const cocktail = cocktailsData.find(c => c.id === cocktailId);

  if (!cocktail) {
    return <PageWrapper theme={theme}><p>Cocktail not found!</p></PageWrapper>;
  }

  const currentIsFavorite = isFavorite(cocktail.id);

  const isMakeableBarA = useMemo(() => checkMakeable(cocktail.ingredients, bar1StockData.ingredients), [cocktail.ingredients]);
  const isMakeableBarB = useMemo(() => checkMakeable(cocktail.ingredients, bar2StockData.ingredients), [cocktail.ingredients]);
  
  // Logic for individual ingredient availability (if needed for styling)
  // This part is tricky without selectedBar. If we want to show which ingredients are missing for EACH bar,
  // the UI in IngredientListItem would need significant changes.
  // For now, let's assume IngredientListItem will just list ingredients without per-bar availability.
  // The overall makeability is shown by the new icons.

  return (
    <PageWrapper theme={theme}>
      <CocktailHeader>
        <CocktailNameWrapper>
          <CocktailName>{cocktail.name}</CocktailName>
          <FavoriteButtonDetail
            isFavorite={currentIsFavorite}
            onClick={() => toggleFavorite(cocktail.id)}
            title={currentIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
            theme={theme}
          >
            {currentIsFavorite ? '♥' : '♡'}
          </FavoriteButtonDetail>
        </CocktailNameWrapper>
        <CocktailImage src={getImageUrl(cocktail.image)} alt={cocktail.name} />
        
        {/* New Bar Availability Icons */}
        <BarAvailabilityIconWrapper theme={theme}>
          <SingleBarIcon available={isMakeableBarA} theme={theme}>
            <span className="bar-name">Bar A:</span>
            <span className="status">{isMakeableBarA ? 'Available' : 'Unavailable'}</span>
          </SingleBarIcon>
          <SingleBarIcon available={isMakeableBarB} theme={theme}>
            <span className="bar-name">Bar B:</span>
            <span className="status">{isMakeableBarB ? 'Available' : 'Unavailable'}</span>
          </SingleBarIcon>
        </BarAvailabilityIconWrapper>
      </CocktailHeader>

      {/* Old AvailabilityStatus removed */}

      <CocktailDetailsGrid>
        <DetailSection theme={theme}>
          <h2>Ingredients</h2>
          <IngredientList>
            {cocktail.ingredients.map((ing, index) => (
              // Simplified IngredientListItem: remove individual availability styling based on selectedBar
              <IngredientListItem key={index} theme={theme} available={true}> 
                {ing.quantity} {ing.name} {ing.notes ? `(${ing.notes})` : ''}
                {/* Removed unavailable note based on selectedBar */}
              </IngredientListItem>
            ))}
          </IngredientList>
        </DetailSection>

        <DetailSection theme={theme}>
          <h2>Instructions</h2>
          <ol>
            {cocktail.instructions.map((step, index) => (
              <li key={index} style={{ marginBottom: theme.spacing.small }}>{step}</li>
            ))}
          </ol>
        </DetailSection>

        <DetailSection theme={theme}>
          <h2>Details</h2>
          <p>
            <strong>Glass:</strong>{' '}
            <FilterLinkTag to={`/cocktails/filter/glass/${encodeURIComponent(cocktail.glass)}`}>
              {cocktail.glass}
            </FilterLinkTag>
          </p>
          <p><strong>Difficulty:</strong> {cocktail.difficulty}</p>
          {cocktail.tags && cocktail.tags.length > 0 && (
            <p>
              <strong>Tags:</strong>{' '}
              {cocktail.tags.map(tag => (
                <FilterLinkTag key={tag} to={`/cocktails/filter/tag/${encodeURIComponent(tag)}`}>
                  {tag}
                </FilterLinkTag>
              ))}
            </p>
          )}
          {cocktail.flavorProfile && cocktail.flavorProfile.length > 0 && (
            <p>
              <strong>Flavor Profile:</strong>{' '}
              {cocktail.flavorProfile.map(flavor => (
                <FilterLinkTag key={flavor} to={`/cocktails/filter/flavor/${encodeURIComponent(flavor)}`}>
                  {flavor}
                </FilterLinkTag>
              ))}
            </p>
          )}
        </DetailSection>
        
        {cocktail.history && (
          <DetailSection theme={theme}>
            <h2>History</h2>
            <p>{cocktail.history}</p>
          </DetailSection>
        )}
      </CocktailDetailsGrid>
    </PageWrapper>
  );
};

export default CocktailPage;
