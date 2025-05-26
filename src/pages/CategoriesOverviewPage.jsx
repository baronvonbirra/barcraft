import React from 'react';
import styled from 'styled-components';
import CategoryList from '../components/CategoryList';
import categoriesData from '../data/categories.json';
import thematicCategoriesData from '../data/thematicCategories.json';

// Add styled components like PageWrapper, SectionHeading
const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  animation: fadeInPage 0.5s ease-out forwards;
`;

const SectionHeading = styled.h2`
  text-align: center;
  color: ${({ theme }) => (theme.colors && theme.colors.text) || '#000000'};
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
`;


const CategoriesOverviewPage = () => {
  return (
    <PageWrapper>
      <SectionHeading>Browse by Spirit</SectionHeading>
      <CategoryList categories={categoriesData} />
      <SectionHeading>Explore by Theme</SectionHeading>
      <CategoryList categories={thematicCategoriesData} />
    </PageWrapper>
  );
};

export default CategoriesOverviewPage;
