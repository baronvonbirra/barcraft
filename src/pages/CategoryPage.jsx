import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CocktailList from '../components/CocktailList';
import cocktailsData from '../data/cocktails.json';
import categoriesData from '../data/categories.json';

const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
`;

const PageTitle = styled.h2`
  font-family: ${({ theme }) => (theme.fonts && theme.fonts.headings) || "'Poppins', sans-serif"};
  color: ${({ theme }) => (theme.colors && theme.colors.secondary) || '#1ABC9C'};
  font-size: 2.2rem; /* Will be styled by GlobalStyles h2 */
  text-align: center;
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  /* font-weight: bold; GlobalStyles h2 sets font-weight: 600 */
`;

const CategoryPage = () => {
  const { categoryId } = useParams();
  
  const filteredCocktails = cocktailsData.filter(
    (cocktail) => cocktail.categoryId === categoryId
  );

  const currentCategory = categoriesData.find(cat => cat.id === categoryId);

  if (!currentCategory) {
    return (
      <PageWrapper>
        <PageTitle>Category Not Found</PageTitle>
        <p>The category "{categoryId}" does not exist.</p>
      </PageWrapper>
    );
  }

  const categoryName = currentCategory.name;

  if (filteredCocktails.length === 0) {
    return (
      <PageWrapper>
        <PageTitle>{categoryName}</PageTitle>
        <p>No cocktails found in this category yet.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTitle>{categoryName}</PageTitle>
      <CocktailList cocktails={filteredCocktails} />
    </PageWrapper>
  );
};

export default CategoryPage;
