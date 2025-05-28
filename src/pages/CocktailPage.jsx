import React, { useContext, useMemo } from 'react'; // Added useMemo
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import cocktailsData from '../data/cocktails.json';
// import { useBar } from '../contexts/BarContext'; // Import useBar - Will be removed if not used elsewhere
import { useFavorites } from '../hooks/useFavorites';
import { ThemeContext } from '../contexts/ThemeContext';
import { getImageUrl } from '../utils/cocktailImageLoader.js';
import bar1StockData from '../data/bar1_stock.json'; // Added
import bar2StockData from '../data/bar2_stock.json'; // Added
import barSpecificData from '../data/bar_specific_data.json'; // Added

// Styled Components
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
  display: block; /* Added */
  margin-left: auto; /* Added */
  margin-right: auto; /* Added */
  margin-bottom: ${({ theme }) => theme.spacing.medium}; /* Preserved */
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

// New AvailabilityPill styled component
const AvailabilityPill = styled.span`
  display: inline-block; // To allow margin and padding
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.medium}; // Adjusted padding
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  font-weight: 600; // Slightly bolder
  color: #fff; // White text for better contrast on colored backgrounds
  background-color: ${({ theme, available }) => 
    available ? theme.colors.secondary : '#D32F2F'}; // Using secondary for green, and a specific darker red
  margin-top: ${({ theme }) => theme.spacing.medium}; // Added margin-top for spacing from image
  margin-bottom: ${({ theme }) => theme.spacing.medium}; // Ensure it pushes content below
  text-align: center; // Ensure text is centered if pill takes full width due to other styles
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

// SingleBarIcon and BarAvailabilityIconWrapper are removed.
// isMakeableInSelectedBar (contextual) removed.

// Helper function to check makeability at a specific bar (similar to CocktailListItem)
const checkMakeableAtBar = (cocktailIngredients, barStockData) => {
  if (!cocktailIngredients || !barStockData) return false;

  const availableStockIds = new Set(
    barStockData
      .filter(item => item.isAvailable)
      .map(item => item.id)
  );

  if (cocktailIngredients.length === 0) return true; // Makeable if no ingredients

  return cocktailIngredients.every(ing => {
    if (!ing.isEssential) return true; // Optional ingredients don't break makeability
    return availableStockIds.has(ing.id);
  });
};

// Wrapper for the general availability pills
const GeneralAvailabilityWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;


const CocktailPage = () => {
  const { cocktailId } = useParams();
  const { theme } = useContext(ThemeContext);
  // const { selectedBarId, barStock, selectedBarName } = useBar(); // Removed as we are showing general availability
  const { isFavorite, toggleFavorite } = useFavorites();

  const cocktail = cocktailsData.find(c => c.id === cocktailId);

  if (!cocktail) {
    return <PageWrapper theme={theme}><p>Cocktail not found!</p></PageWrapper>;
  }

  const currentIsFavorite = isFavorite(cocktail.id);

  // Determine makeability for each bar
  const isMakeableBar1 = useMemo(() => 
    checkMakeableAtBar(cocktail.ingredients, bar1StockData),
    [cocktail.ingredients] // bar1StockData is stable
  ); 
  const isMakeableBar2 = useMemo(() =>
    checkMakeableAtBar(cocktail.ingredients, bar2StockData),
    [cocktail.ingredients] // bar2StockData is stable
  );

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
        
        {/* General Availability Display */}
        {cocktail && ( // Ensure cocktail data is loaded
          <GeneralAvailabilityWrapper theme={theme}>
            <AvailabilityPill available={isMakeableBar1} theme={theme}>
              {barSpecificData.bar1.barName}: {isMakeableBar1 ? 'Available' : 'Unavailable'}
            </AvailabilityPill>
            <AvailabilityPill available={isMakeableBar2} theme={theme}>
              {barSpecificData.bar2.barName}: {isMakeableBar2 ? 'Available' : 'Unavailable'}
            </AvailabilityPill>
          </GeneralAvailabilityWrapper>
        )}
      </CocktailHeader>

      <CocktailDetailsGrid>
        <DetailSection theme={theme}>
          <h2>Ingredients</h2>
          <IngredientList>
            {cocktail.ingredients.map((ing, index) => (
              <IngredientListItem key={index} theme={theme}> {/* Removed available prop, not relevant here anymore */}
                {ing.quantity} {ing.name} {ing.notes ? `(${ing.notes})` : ''}
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
            {(() => {
              if (Array.isArray(cocktail.glass)) {
                // Case 1: cocktail.glass is an array of strings
                return cocktail.glass.map(glassName => (
                  <FilterLinkTag 
                    key={glassName.trim()} 
                    to={`/cocktails/filter/glass/${encodeURIComponent(glassName.trim())}`}
                  >
                    {glassName.trim()}
                  </FilterLinkTag>
                ));
              } else if (typeof cocktail.glass === 'string') {
                // Case 2: cocktail.glass is a single string
                return (
                  <FilterLinkTag 
                    to={`/cocktails/filter/glass/${encodeURIComponent(cocktail.glass.trim())}`}
                  >
                    {cocktail.glass.trim()}
                  </FilterLinkTag>
                );
              } else {
                // Case 3: cocktail.glass is null, undefined, or other
                return 'N/A';
              }
            })()}
          </p>
          <p>
            <strong>Difficulty:</strong>{' '}
            {cocktail.difficulty ? (
              <FilterLinkTag 
                to={`/cocktails/filter/difficulty/${encodeURIComponent(cocktail.difficulty.toLowerCase())}`}
              >
                {cocktail.difficulty}
              </FilterLinkTag>
            ) : (
              'N/A' 
            )}
          </p>
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
