import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CocktailList from '../components/CocktailList';
import cocktailsData from '../data/cocktails.json';
import categoriesData from '../data/categories.json';

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium} 0;
`;

const PageTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: bold;
`;

const CategoryPage = () => {
  const { categoryId } = useParams();
  
  const filteredCocktails = cocktailsData.filter(
    (cocktail) => cocktail.categoryId === categoryId
  );

  const currentCategory = categoriesData.find(cat => cat.id === categoryId);
  const categoryName = currentCategory ? currentCategory.name : categoryId ? categoryId.toUpperCase() : 'Category';


  return (
    <PageWrapper>
      <PageTitle>{categoryName}</PageTitle>
      <CocktailList cocktails={filteredCocktails} />
    </PageWrapper>
  );
};

export default CategoryPage;
