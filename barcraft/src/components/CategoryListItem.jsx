import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ItemWrapper = styled(Link)`
  display: block; // To make the whole area clickable and allow padding/margin
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  border-radius: 8px; // Slightly rounded corners
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500; // Medium weight for category names
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
  min-width: 200px; // Ensure items have a decent minimum width

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    transform: translateY(-3px); // Slight lift effect
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); // Softer shadow for dark theme
  }
`;

const CategoryName = styled.div`
  // Text itself doesn't need much styling if ItemWrapper handles it
`;

const CategoryListItem = ({ category }) => {
  return (
    <ItemWrapper to={`/category/${category.id}`}>
      <CategoryName>{category.name}</CategoryName>
    </ItemWrapper>
  );
};

export default CategoryListItem;
