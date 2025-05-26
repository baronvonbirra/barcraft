import React from 'react';
import styled from 'styled-components';
import CategoryListItem from './CategoryListItem';

const ListWrapper = styled.div`
  display: grid;
  /* Categories are often wider or fewer, so minmax might be larger */
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  }

  @media (max-width: 480px) { // Small mobile screens
    grid-template-columns: 1fr 1fr; // Two columns for categories often looks good
    gap: ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'};
  }
`;

const CategoryList = ({ categories }) => {
  return (
    <ListWrapper>
      {categories.map(category => (
        <CategoryListItem key={category.id} category={category} />
      ))}
    </ListWrapper>
  );
};

export default CategoryList;
