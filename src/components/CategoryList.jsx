import React from 'react';
import styled from 'styled-components';
import CategoryListItem from './CategoryListItem';

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap; // Allow items to wrap to the next line
  justify-content: center; // Center items horizontally
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium} 0; // Padding top/bottom
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
