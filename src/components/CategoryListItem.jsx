import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getImageUrl } from '../utils/cocktailImageLoader.js';

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
  height: 100%;

  &:hover, &:focus {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }

  &:hover img, &:focus img {
  }
`;

const CategoryName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.headings};
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing.medium};
  margin-bottom: 0;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-top: ${({ theme }) => theme.spacing.small};
  }
`;

const Icon = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.small};

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

const CategoryListItem = ({ category }) => {
  const imageSrc = getImageUrl(category.image);

  return (
    <ItemWrapper to={`/category/${category.id}`}>
      <Icon src={imageSrc} alt={`${category.name} icon`} />
      <CategoryName>{category.name}</CategoryName>
    </ItemWrapper>
  );
};

export default CategoryListItem;
