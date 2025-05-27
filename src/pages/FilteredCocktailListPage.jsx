import React, { useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import cocktailsData from '../data/cocktails.json';
import CocktailList from '../components/CocktailList';
import { ThemeContext } from '../contexts/ThemeContext';

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  animation: fadeInPage 0.5s ease-out forwards;
`;

// Styled Components for Empty State
const EmptyStateWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.textOffset};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem; // Or adjust for an SVG icon
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  // Consider using a theme-appropriate SVG icon here if available
`;

const EmptyStateText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text}; // Main text color for the message
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const EmptyStateSuggestion = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textOffset};

  a { // Style for the link within the suggestion
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Header = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-transform: capitalize;
`;

const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  display: inline-block;
  &:hover {
    text-decoration: underline;
  }
`;

const FilteredCocktailListPage = () => {
  const { filterType, filterValue } = useParams();
  const { theme } = useContext(ThemeContext);
  const decodedFilterValue = decodeURIComponent(filterValue);

  const filteredCocktails = useMemo(() => {
    return cocktailsData.filter(cocktail => {
      if (!filterType || !decodedFilterValue) return false;
      
      const lowerDecodedFilterValue = decodedFilterValue.toLowerCase();

      switch (filterType) {
        case 'tag':
          return cocktail.tags && cocktail.tags.some(t => t.toLowerCase() === lowerDecodedFilterValue);
        case 'flavor':
          return cocktail.flavorProfile && cocktail.flavorProfile.some(fp => fp.toLowerCase() === lowerDecodedFilterValue);
        case 'glass':
          if (Array.isArray(cocktail.glass)) {
            return cocktail.glass.some(g => g.toLowerCase() === lowerDecodedFilterValue);
          } else if (typeof cocktail.glass === 'string') {
            return cocktail.glass.toLowerCase() === lowerDecodedFilterValue;
          }
          return false;
        case 'difficulty':
          return cocktail.difficulty?.toLowerCase() === lowerDecodedFilterValue;
        default:
          return false;
      }
    });
  }, [filterType, decodedFilterValue]);

  // Note: The CocktailList component expects 'isCocktailMakeable' and 'selectedBar' props
  // if we want to show availability. For this generic filter page, we might not show
  // bar-specific availability, or we'd need a more complex setup.
  // For now, this will render the list without bar-specific availability indicators
  // unless CocktailList has defaults or handles missing props gracefully.
  // The original task for CocktailList was to make it accept these, not require.
  // Let's assume CocktailList can handle these props being undefined for now.

  return (
    <PageWrapper theme={theme}>
      <BreadcrumbLink to="/categories">← Back to Categories</BreadcrumbLink> {/* Or back to previous page potentially */}
      <Header>Cocktails: {filterType} - "{decodedFilterValue}"</Header>
      {filteredCocktails.length > 0 ? (
        <CocktailList cocktails={filteredCocktails} />
      ) : (
        <EmptyStateWrapper theme={theme}>
          <EmptyStateIcon>😕</EmptyStateIcon> {/* Or your chosen icon/SVG */}
          <EmptyStateText>No cocktails match your criteria.</EmptyStateText>
          <EmptyStateSuggestion theme={theme}>
            Try a different filter or <Link to="/categories">explore categories</Link>.
          </EmptyStateSuggestion>
        </EmptyStateWrapper>
      )}
    </PageWrapper>
  );
};

export default FilteredCocktailListPage;
