import React from 'react';
import styled from 'styled-components';
import CategoryList from '../components/CategoryList';
import categoriesData from '../data/categories.json';

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium} 0; // Consistent vertical padding
`;

const PageTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.secondary}; // Use secondary for page titles
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: bold;
`;

const HomePage = () => {
  return (
    <PageWrapper>
      <PageTitle>Cocktail Categories</PageTitle>
      <CategoryList categories={categoriesData} />
    </PageWrapper>
  );
};

export default HomePage;
