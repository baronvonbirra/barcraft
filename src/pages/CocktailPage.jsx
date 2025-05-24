import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CocktailDetail from '../components/CocktailDetail';
import cocktailsData from '../data/cocktails.json';

const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '16px'} 0;
  // The CocktailDetail component will handle its own internal padding and styling
`;


const CocktailPage = () => {
  const { cocktailId } = useParams();
  
  const selectedCocktail = cocktailsData.find(
    (cocktail) => cocktail.id === cocktailId
  );

  return (
    <PageWrapper>
      {/* No specific PageTitle here as CocktailDetail contains the main title (cocktail name) */}
      <CocktailDetail cocktail={selectedCocktail || null} />
    </PageWrapper>
  );
};

export default CocktailPage;
