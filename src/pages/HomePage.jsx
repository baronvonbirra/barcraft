import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import CategoryList from '../components/CategoryList';
import SurpriseMeButton from '../components/SurpriseMeButton';
import { getImageUrl } from '../utils/cocktailImageLoader.js';

// Styled components for HomePage
const PageWrapper = styled.div`
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} 0;
  gap: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  animation: fadeInPage 0.5s ease-out forwards;
`;

const CocktailOfTheWeekWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const CocktailImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CocktailName = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography ? theme.typography.h2Size : '2rem'}; // Assuming h2Size from theme

  @media (max-width: 600px) {
    font-size: ${({ theme }) => theme.typography ? `calc(${theme.typography.h2Size} * 0.85)` : '1.7rem'};
  }
`;

const CocktailDescription = styled.p`
  color: ${({ theme }) => theme.colors.textOffset};
  font-size: 0.9rem;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

const ViewRecipeButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: none;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.secondary}; // Example: darken primary or use secondary
    color: ${({ theme }) => theme.colors.onSecondary};
    box-shadow: ${({ theme }) => theme.shadows.small};
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const FilterToggleButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: none;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.onSecondary};
    box-shadow: ${({ theme }) => theme.shadows.small};
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const HomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  padding: 0 ${({ theme }) => theme.spacing.medium};
`;

const SurpriseButtonWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.large} auto; // For vertical spacing and horizontal centering
  padding: 0 ${({ theme }) => theme.spacing.medium}; // Horizontal padding for narrower screens
  max-width: 400px; // Constrain the button's effective width on wider screens
  width: 100%; // Ensure it's responsive
`;

const MainContent = styled.div`
  flex-grow: 1; // Takes remaining space if HomePageWrapper was flex row
`;

const SectionHeading = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;


const HomePage = () => {
  const { i18n, t } = useTranslation();
  const [cocktailToDisplay, setCocktailToDisplay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [thematicCategories, setThematicCategories] = useState([]);
  const [allCocktails, setAllCocktails] = useState([]);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      const lang = i18n.language;

      // Fetch Cocktail of the Week
      const { data: cotwData, error: cotwError } = await supabase
        .from('cocktail_of_the_week')
        .select('cocktail_id');

      if (cotwError) {
        console.error('Error fetching cocktail of the week:', cotwError);
      } else if (cotwData && cotwData.length > 0) {
        const cocktailId = cotwData[0].cocktail_id;
        const { data: cocktail, error: cocktailError } = await supabase
          .from('cocktails')
          .select(`id, name_${lang}, name_en, description_${lang}, description_en, image`)
          .eq('id', cocktailId)
          .single();

        if (cocktailError) {
          console.error('Error fetching cocktail details:', cocktailError);
        } else if (cocktail) {
          setCocktailToDisplay({
            ...cocktail,
            name: cocktail[`name_${lang}`] || cocktail.name_en,
            description: cocktail[`description_${lang}`] || cocktail.description_en,
          });
        }
      }

      // Fetch Categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`id, name_${lang}, name_en, image, type`);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else if (categoriesData) {
        const processed = categoriesData.map(c => ({ ...c, name: c[`name_${lang}`] || c.name_en }));
        const spiritCategories = processed.filter(c => c.type === 'spirit');
        const themeCategories = processed.filter(c => c.type === 'theme');
        setCategories(spiritCategories);
        setThematicCategories(themeCategories);
      }

      // Fetch All Cocktails (for surprise me button)
      const { data: allCocktailsData, error: allCocktailsError } = await supabase
        .from('cocktails')
        .select(`id, name_${lang}, name_en`);

      if (allCocktailsError) {
        console.error('Error fetching all cocktails:', allCocktailsError);
      } else if (allCocktailsData) {
        const processed = allCocktailsData.map(c => ({ ...c, name: c[`name_${lang}`] || c.name_en }));
        setAllCocktails(processed);
      }

      setLoading(false);
    };

    fetchHomePageData();
  }, [i18n.language]);

  return (
    <PageWrapper>
      <HomePageWrapper>
        {!loading && cocktailToDisplay && (
          <CocktailOfTheWeekWrapper>
            <CocktailName>{cocktailToDisplay.name} - {t('cocktailOfTheWeek')}</CocktailName>
            <CocktailImage src={getImageUrl(cocktailToDisplay.image)} alt={cocktailToDisplay.name} />
            <CocktailDescription>{cocktailToDisplay.description}</CocktailDescription>
            <ViewRecipeButton to={`/cocktails/${cocktailToDisplay.id}`}>{t('viewRecipe')}</ViewRecipeButton>
          </CocktailOfTheWeekWrapper>
        )}

        <SurpriseButtonWrapper>
          <SurpriseMeButton filteredCocktails={allCocktails} />
        </SurpriseButtonWrapper>

        <MainContent>
          {/* Heading for categories */}
          <SectionHeading>{t('browseBySpirit')}</SectionHeading>
          <CategoryList categories={categories} />

          {/* Heading for thematic categories */}
          <SectionHeading>{t('exploreByTheme')}</SectionHeading>
          <CategoryList categories={thematicCategories} />
        </MainContent>
      </HomePageWrapper>
    </PageWrapper>
  );
};

export default HomePage;
