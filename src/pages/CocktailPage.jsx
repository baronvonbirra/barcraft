import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import cocktailsData from '../data/cocktails.json';
import { useCocktailFilter } from '../hooks/useCocktailFilter';
import { useBar } from '../contexts/BarContext';
import { useFavorites } from '../hooks/useFavorites'; // Import useFavorites
import { ThemeContext } from '../contexts/ThemeContext';
import bar1StockData from '../data/bar1_stock.json';
import bar2StockData from '../data/bar2_stock.json';

// Styled Components (ensure they are defined or reuse existing ones if applicable)
const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
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


const CocktailPage = () => {
  const { cocktailId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { selectedBar } = useBar();
  const { isCocktailMakeable, getIngredientAvailability } = useCocktailFilter(cocktailsData);
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites(); // Use the hook

  const cocktail = cocktailsData.find(c => c.id === cocktailId);

  if (!cocktail) {
    return <PageWrapper theme={theme}><p>Cocktail not found!</p></PageWrapper>;
  }

  const currentIsFavorite = isFavorite(cocktail.id);
  const currentBarName = selectedBar === 'bar1' ? bar1StockData.barName : selectedBar === 'bar2' ? bar2StockData.barName : null;
  let overallMakeableStatus = null;
  let ingredientAvailabilityData = {};

  if (selectedBar === 'bar1' || selectedBar === 'bar2') {
    overallMakeableStatus = isCocktailMakeable(cocktail.ingredients);
    ingredientAvailabilityData = getIngredientAvailability(cocktail.ingredients);
  }

  return (
    <PageWrapper theme={theme}>
      <CocktailHeader>
        <CocktailNameWrapper>
          <CocktailName>{cocktail.name}</CocktailName>
          <FavoriteButtonDetail
            isFavorite={currentIsFavorite}
            onClick={() => toggleFavorite(cocktail.id)}
            title={currentIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
            theme={theme} // Pass theme if needed by styled-component
          >
            {currentIsFavorite ? '♥' : '♡'}
          </FavoriteButtonDetail>
        </CocktailNameWrapper>
        <CocktailImage src={cocktail.image || '/placeholder.jpg'} alt={cocktail.name} />
      </CocktailHeader>

      {currentBarName && (
        <AvailabilityStatus theme={theme} isMakeable={overallMakeableStatus}>
          Availability at {currentBarName}: {overallMakeableStatus ? "Makeable" : "Unavailable"}
        </AvailabilityStatus>
      )}

      <CocktailDetailsGrid>
        <DetailSection theme={theme}>
          <h2>Ingredients</h2>
          <IngredientList>
            {cocktail.ingredients.map((ing, index) => (
              <IngredientListItem 
                key={index} 
                theme={theme}
                available={(selectedBar === 'bar1' || selectedBar === 'bar2') ? ingredientAvailabilityData[ing.name] : true}
              >
                {ing.quantity} {ing.name} {ing.notes ? `(${ing.notes})` : ''}
                {(selectedBar === 'bar1' || selectedBar === 'bar2') && !ingredientAvailabilityData[ing.name] && (
                  <span className="unavailable-note">(Unavailable at {currentBarName})</span>
                )}
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
          <p><strong>Glass:</strong> {cocktail.glass}</p>
          <p><strong>Difficulty:</strong> {cocktail.difficulty}</p>
          {cocktail.tags && <p><strong>Tags:</strong> {cocktail.tags.join(', ')}</p>}
          {cocktail.flavorProfile && <p><strong>Flavor Profile:</strong> {cocktail.flavorProfile.join(', ')}</p>}
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
