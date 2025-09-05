import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
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
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const decodedFilterValue = decodeURIComponent(filterValue);

  useEffect(() => {
    const fetchFilteredCocktails = async () => {
      setLoading(true);
      let query = supabase.from('cocktails');
      const lowerDecodedFilterValue = decodedFilterValue.toLowerCase();

      switch (filterType) {
        case 'tag':
          query = query.select('*').contains('tags', [lowerDecodedFilterValue]);
          break;
        case 'flavor':
          query = query.select('*').contains('flavorProfile', [lowerDecodedFilterValue]);
          break;
        case 'glass':
          // Assuming 'glass' is an array field and values are stored consistently.
          query = query.select('*').contains('glass', [decodedFilterValue]);
          break;
        case 'difficulty':
          query = query.select('*').ilike('difficulty', lowerDecodedFilterValue);
          break;
        default:
          setFilteredCocktails([]);
          setLoading(false);
          return;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching filtered cocktails:', error);
        setFilteredCocktails([]);
      } else {
        setFilteredCocktails(data);
      }
      setLoading(false);
    };

    if (filterType && decodedFilterValue) {
      fetchFilteredCocktails();
    }
  }, [filterType, decodedFilterValue]);

  if (loading) {
    return <PageWrapper theme={theme}><p>Loading...</p></PageWrapper>;
  }

  return (
    <PageWrapper theme={theme}>
      <BreadcrumbLink to="/categories">← Back to Categories</BreadcrumbLink>
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
