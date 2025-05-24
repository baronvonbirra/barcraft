import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import RumIcon from '../assets/categories/rum-category.png';
import WhiskeyIcon from '../assets/categories/whiskey-category.png';

const ItemWrapper = styled(Link)`
  display: flex; // Changed to flex for icon and text alignment
  align-items: center; // Vertically center content
  background-color: ${({ theme }) => (theme.colors && theme.colors.surface) || '#282C34'}; /* Updated fallback */
  color: ${({ theme }) => (theme.colors && theme.colors.text) || '#EAEAEA'}; /* Updated fallback */
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  border-radius: ${({ theme }) => theme.borderRadius || '8px'};
  text-decoration: none;
  font-size: 1.2rem; /* This could be theme.fontSizes.medium if defined */
  font-weight: 500; // Medium weight for category names
  text-align: left; // Align text to the left now that icon is present
  border: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#dddddd'};
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-width: 200px; 

  &:hover {
    background-color: ${({ theme }) => (theme.colors && theme.colors.primary) || '#3498DB'}; /* Updated fallback */
    color: ${({ theme }) => (theme.colors && theme.colors.onPrimary) || '#FFFFFF'}; /* Updated fallback */
    transform: translateY(-3px); 
    box-shadow: ${({ theme }) => (theme.shadows && theme.shadows.medium) || '0 4px 8px rgba(0,0,0,0.3)'};
  }
`;

const CategoryName = styled.div`
  margin-left: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'}; // Add space between icon and text
`;

const Icon = styled.img`
  width: 40px; // Set a fixed width for the icon
  height: 40px; // Set a fixed height for the icon
  object-fit: contain; // Ensure the icon scales nicely
`;

const CategoryListItem = ({ category }) => {
  let iconSrc = null;
  if (category.name === 'Rum-based Cocktails') {
    iconSrc = RumIcon;
  } else if (category.name === 'Whiskey-based Cocktails') {
    iconSrc = WhiskeyIcon;
  }

  return (
    <ItemWrapper to={`/category/${category.id}`}>
      {iconSrc && <Icon src={iconSrc} alt={`${category.name} icon`} />}
      <CategoryName>{category.name}</CategoryName>
    </ItemWrapper>
  );
};

export default CategoryListItem;
