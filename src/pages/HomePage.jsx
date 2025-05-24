import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import CategoryList from '../components/CategoryList';
import categoriesData from '../data/categories.json';
import cocktailsData from '../data/cocktails.json';
import PlaceholderImage from '../assets/cocktails/placeholder.png'; // For fallback

const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  display: flex;
  flex-direction: column;
  align-items: center; // Center content horizontally
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
`;

const WelcomeMessage = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${({ theme }) => (theme.colors && theme.colors.text) || '#333'};
  text-align: center;
  max-width: 800px; // Constrain width for readability
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  padding: 0 ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => (theme.fonts && theme.fonts.headings) || 'sans-serif'};
  color: ${({ theme }) => (theme.colors && theme.colors.secondary) || '#AA336A'};
  font-size: 2rem; // Slightly smaller than original PageTitle
  text-align: center;
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  font-weight: bold;
`;

const CocktailOfTheWeekSection = styled.section`
  background-color: ${({ theme }) => (theme.colors && theme.colors.surface) || '#f9f9f9'};
  border: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#ddd'};
  border-radius: 12px;
  padding: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  margin: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  width: 100%;
  max-width: 600px; // Max width for this section
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeaturedCocktailImage = styled.img`
  width: 100%;
  max-width: 400px; // Control max image size
  height: auto; // Maintain aspect ratio
  max-height: 300px; // Max height for image
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  border: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#ddd'};
`;

const FeaturedCocktailName = styled.h3`
  font-family: ${({ theme }) => (theme.fonts && theme.fonts.headings) || 'sans-serif'};
  color: ${({ theme }) => (theme.colors && theme.colors.primary) || '#D81B60'};
  font-size: 1.8rem;
  margin: ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'} 0;
`;

const FeaturedCocktailDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => (theme.colors && theme.colors.textOffset) || '#555'};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  max-width: 500px; // Limit width of description
`;

const ViewCocktailLink = styled(Link)`
  background-color: ${({ theme }) => (theme.colors && theme.colors.primary) || '#3498DB'}; /* Updated fallback */
  color: ${({ theme }) => (theme.colors && theme.colors.onPrimary) || '#FFFFFF'};
  padding: ${({ theme }) => (theme.spacing && theme.spacing.small) || '0.5rem'} ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'};
  border-radius: ${({ theme }) => theme.borderRadius || '8px'}; /* Use theme borderRadius */
  text-decoration: none;
  font-weight: 500; // Could be theme.fontWeights.medium if defined
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => (theme.colors && theme.colors.secondary) || '#1ABC9C'}; /* Updated fallback */
  }
`;

const CategoriesSection = styled.section`
  width: 100%;
  padding: 0 ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'}; // Add horizontal padding for category list
`;


const HomePage = () => {
  const cocktailOfTheWeek = cocktailsData[0];
  const imageSrc = cocktailOfTheWeek.image ? cocktailOfTheWeek.image : PlaceholderImage;

  return (
    <PageWrapper>
      <WelcomeMessage>
        Welcome to BarCraft! Discover a world of exquisite cocktails, find your new favorites,
        and learn how to craft them like a pro. Cheers to good times and great drinks!
      </WelcomeMessage>

      <SectionTitle>Cocktail of the Week</SectionTitle>
      <CocktailOfTheWeekSection>
        <FeaturedCocktailImage src={imageSrc} alt={cocktailOfTheWeek.name} />
        <FeaturedCocktailName>{cocktailOfTheWeek.name}</FeaturedCocktailName>
        <FeaturedCocktailDescription>{cocktailOfTheWeek.description}</FeaturedCocktailDescription>
        <ViewCocktailLink to={`/cocktails/${cocktailOfTheWeek.id}`}>
          View Recipe
        </ViewCocktailLink>
      </CocktailOfTheWeekSection>

      <CategoriesSection>
        <SectionTitle>Or Browse by Category</SectionTitle>
        <CategoryList categories={categoriesData} />
      </CategoriesSection>
    </PageWrapper>
  );
};

export default HomePage;
