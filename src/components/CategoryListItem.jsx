import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getImageUrl } from '../../utils/cocktailImageLoader'; // Added

// Removed direct icon imports:
// import GinIcon from '../assets/categories/gin-category.png';
// import RumIcon from '../assets/categories/rum-category.png';
// import WhiskeyIcon from '../assets/categories/whiskey-category.png';
// import PlaceholderIcon from '../assets/cocktails/placeholder.png';

const ItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column; // Stack image and text vertically
  align-items: center; // Center content horizontally
  justify-content: center; // Center content vertically
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all 0.3s ease;
  height: 100%; // For consistent card heights in a grid

  &:hover, &:focus { /* Added :focus state */
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    background-color: ${({ theme }) => theme.colors.primary}; // Change background on hover
    color: ${({ theme }) => theme.colors.onPrimary}; // Change text color on hover
    outline: 2px solid ${({ theme }) => theme.colors.secondary}; // Added outline for focus
    outline-offset: 2px;
  }

  &:hover img, &:focus img { /* Added :focus state for img if needed */
    // filter: brightness(0) invert(1); // Example for making a dark icon white
  }
`;

const CategoryName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.headings};
  /* color is inherited from ItemWrapper, changes on hover */
  font-size: 1.1rem; // Slightly smaller than cocktail name
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing.medium};
  margin-bottom: 0; // No bottom margin if it's the last element

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-top: ${({ theme }) => theme.spacing.small};
  }
`;

const Icon = styled.img`
  width: 80px; // Larger icon for category cards
  height: 80px;
  object-fit: contain; // Ensure the icon scales nicely
  border-radius: ${({ theme }) => theme.borderRadius}; // Optional: if icons have backgrounds
  margin-bottom: ${({ theme }) => theme.spacing.small}; // Space between icon and name

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

const CategoryListItem = ({ category }) => {
  // The logic for iconMap is removed as getImageUrl will handle path resolution
  // based on the category.image string from the JSON.
  // The category.image field in categories.json should now directly reference
  // the image file name, e.g., "rum-category.png" or the full path like "src/assets/categories/rum-category.png".
  // getImageUrl will extract the filename and find it.

  const imageSrc = getImageUrl(category.image); // Use the utility

  return (
    <ItemWrapper to={`/category/${category.id}`}>
      <Icon src={imageSrc} alt={`${category.name} icon`} />
      <CategoryName>{category.name}</CategoryName>
    </ItemWrapper>
  );
};

export default CategoryListItem;
