import React from 'react';
import styled from 'styled-components';
import PlaceholderImage from '../assets/cocktails/placeholder.png'; // Ensure PlaceholderImage is imported

const DetailWrapper = styled.div`
  background-color: ${({ theme }) => (theme.colors && theme.colors.surface) || '#282C34'};
  padding: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  border-radius: ${({ theme }) => theme.borderRadius || '8px'};
  margin-top: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  border: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#3A3F4B'};
  color: ${({ theme }) => (theme.colors && theme.colors.text) || '#EAEAEA'};
  text-align: left; 
  max-width: 800px; 
  margin-left: auto;
  margin-right: auto;
`;

const CocktailImage = styled.img`
  width: 100%;
  max-width: 400px; // Control max image size
  height: auto;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius || '8px'};
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  display: block; 
  margin-left: auto;
  margin-right: auto;
`;

const CocktailName = styled.h2`
  font-family: ${({ theme }) => (theme.fonts && theme.fonts.headings) || "'Poppins', sans-serif"};
  color: ${({ theme }) => (theme.colors && theme.colors.primary) || '#3498DB'};
  font-size: 2.8rem; /* Will be styled by GlobalStyles h2 */
  /* font-weight: bold; GlobalStyles h2 sets font-weight: 600 */
  text-align: center;
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
`;

const SubHeading = styled.h3`
  font-family: ${({ theme }) => (theme.fonts && theme.fonts.headings) || "'Poppins', sans-serif"};
  color: ${({ theme }) => (theme.colors && theme.colors.secondary) || '#1ABC9C'};
  font-size: 1.8rem; /* Will be styled by GlobalStyles h3 */
  margin-top: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  border-bottom: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#3A3F4B'};
  padding-bottom: ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'};
`;

const IngredientList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};

  li {
    font-size: 1.1rem;
    line-height: 1.8;
    padding: ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'} 0;
    border-bottom: 1px dashed ${({ theme }) => (theme.colors && theme.colors.border) || '#3A3F4B'};
    &:last-child {
      border-bottom: none;
    }
  }
`;

const Instructions = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  color: ${({ theme }) => (theme.colors && theme.colors.textOffset) || '#A0A0A0'}; // Use textOffset for less emphasis
`;

const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => (theme.colors && theme.colors.secondary) || '#1ABC9C'};
  text-align: center;
  padding: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
`;

const HistorySection = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => (theme.colors && theme.colors.textOffset) || '#A0A0A0'};
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  white-space: pre-wrap; // Preserve formatting from JSON
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  margin: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'} 0;
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  background-color: ${({ theme }) => (theme.colors && theme.colors.background) || '#1A1D24'}; /* Slightly different background for contrast */
  border: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#3A3F4B'};
  border-radius: ${({ theme }) => theme.borderRadius || '8px'};
`;

const InfoItemStyled = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => (theme.colors && theme.colors.text) || '#EAEAEA'};
  
  strong {
    color: ${({ theme }) => (theme.colors && theme.colors.secondary) || '#1ABC9C'};
    margin-right: ${({ theme }) => (theme.spacing && theme.spacing.xs) || '0.25rem'}; /* Use xs for tighter spacing */
  }
`;

// Simple component to render label and value for InfoGrid
const InfoItem = ({ label, value }) => (
  <InfoItemStyled>
    <strong>{label}</strong> {value}
  </InfoItemStyled>
);

const PillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'};
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
`;

const Pill = styled.span`
  background-color: ${({ theme }) => (theme.colors && theme.colors.secondary) || '#1ABC9C'};
  color: ${({ theme }) => (theme.colors && theme.colors.onPrimary) || '#FFFFFF'}; /* Assuming secondary onPrimary is similar to primary's onPrimary */
  padding: ${({ theme }) => (theme.spacing && theme.spacing.xs) || '0.25rem'} ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'};
  border-radius: ${({ theme }) => theme.borderRadius || '8px'};
  font-size: 0.9rem;
  font-weight: 500; // Make it slightly bold
  text-transform: capitalize; // Capitalize tags
`;

const CocktailDetail = ({ cocktail }) => {
  if (!cocktail) {
    // Updated message to align with test expectation
    return <LoadingMessage>Cocktail not found.</LoadingMessage>;
  }

  // Ensure instructions are treated as a single string if they are an array
  const instructionsText = Array.isArray(cocktail.instructions) 
    ? cocktail.instructions.join('\n') 
    : cocktail.instructions;
  
  // Ensure ingredients are displayed correctly, assuming they are objects
  // This part depends on how you want to display ingredients.
  // For simplicity, joining name and quantity.
  // Updated to include "(optional)" for non-essential ingredients
  const ingredientsList = cocktail.ingredients.map((ing, index) => {
    let displayText = `${ing.name}: ${ing.quantity}${ing.notes ? ` (${ing.notes})` : ''}`;
    if (ing.isEssential === false) { // Check for explicitly false
      displayText += " (optional)";
    }
    return displayText;
  });

  // Determine the glass display value
  let glassDisplayValue = '';
  if (cocktail.glass) {
    if (Array.isArray(cocktail.glass)) {
      glassDisplayValue = cocktail.glass.join(', ');
    } else {
      glassDisplayValue = cocktail.glass;
    }
  }

  return (
    <DetailWrapper>
      <CocktailName>{cocktail.name}</CocktailName>
      <CocktailImage src={cocktail.image || PlaceholderImage} alt={cocktail.name} />

      {cocktail.history && (
        <>
          <SubHeading>History</SubHeading>
          <HistorySection>{cocktail.history}</HistorySection>
        </>
      )}

      <InfoGrid>
        {cocktail.glass && <InfoItem label="Glass:" value={glassDisplayValue} />}
        {cocktail.difficulty && <InfoItem label="Difficulty:" value={cocktail.difficulty} />}
      </InfoGrid>

      {cocktail.flavorProfile && cocktail.flavorProfile.length > 0 && (
        <>
          <SubHeading>Flavor Profile</SubHeading>
          <PillList>
            {cocktail.flavorProfile.map((item, index) => (
              <Pill key={index}>{item}</Pill>
            ))}
          </PillList>
        </>
      )}

      {cocktail.tags && cocktail.tags.length > 0 && (
        <>
          <SubHeading>Tags</SubHeading>
          <PillList>
            {cocktail.tags.map((item, index) => (
              <Pill key={index}>{item}</Pill>
            ))}
          </PillList>
        </>
      )}
      
      <SubHeading>Ingredients</SubHeading>
      <IngredientList>
        {ingredientsList.map((ingredientText, index) => (
          <li key={index}>{ingredientText}</li>
        ))}
      </IngredientList>

      {cocktail.toolsNeeded && cocktail.toolsNeeded.length > 0 && (
        <>
          <SubHeading>Tools Needed</SubHeading>
          <PillList>
            {cocktail.toolsNeeded.map((item, index) => (
              <Pill key={index}>{item}</Pill>
            ))}
          </PillList>
        </>
      )}
      
      <SubHeading>Instructions</SubHeading>
      <Instructions>{instructionsText}</Instructions>
    </DetailWrapper>
  );
};

// PlaceholderImage import is now at the top with other imports

export default CocktailDetail;
