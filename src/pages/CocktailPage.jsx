import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useBar } from '../contexts/BarContext';
import { useFavorites } from '../hooks/useFavorites';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { getImageUrl } from '../utils/cocktailImageLoader.js';

// Styled Components
const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
  animation: fadeInPage 0.5s ease-out forwards;
`;

const CocktailHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  position: relative;
`;

const CocktailNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CocktailName = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2.5rem;
  margin: 0;
  margin-right: ${({ theme }) => theme.spacing.medium};
`;

const FavoriteButtonDetail = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.isFavorite ? props.theme.colors.primary : props.theme.colors.textOffset};
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const CocktailImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CocktailDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.large};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailSection = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  h2 {
    font-family: ${({ theme }) => theme.fonts.headings};
    color: ${({ theme }) => theme.colors.secondary};
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.small};
  }
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientListItem = styled.li`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  color: ${props => props.available === false ? props.theme.colors.textOffset : props.theme.colors.text};
  font-style: ${props => props.available === false ? 'italic' : 'normal'};
  
  .unavailable-note {
    font-size: 0.8em;
    margin-left: ${({ theme }) => theme.spacing.small};
    color: ${props => props.theme.colors.textOffset};
  }
`;

const AllBarsAvailabilityWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const IndividualBarStatus = styled.div`
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background-color: ${({ theme, isAvailable }) => 
    isAvailable ? theme.colors.secondary : (theme.colors.error || '#D32F2F')};
  text-align: center;
  min-width: 120px;
`;

const FilterLinkTag = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textOffset};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  margin-right: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const checkMakeableForBar = (cocktailIngredients, barStockSet) => {
  if (!cocktailIngredients || cocktailIngredients.length === 0) return true;
  return cocktailIngredients.every(ing => {
    if (!ing.isEssential) return true;
    return barStockSet.has(ing.id);
  });
};

const CocktailPage = () => {
  const { cocktailId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { barAStock, barBStock, barsData } = useBar();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { i18n, t } = useTranslation();
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocktail = async () => {
      setLoading(true);
      const lang = i18n.language;

      const { data, error } = await supabase
        .from('cocktails')
        .select(`
          *,
          ingredients:cocktail_ingredients(
            quantity,
            unit,
            notes,
            details:ingredients(*)
          )
        `)
        .eq('id', cocktailId)
        .single();

      if (error) {
        console.error('Error fetching cocktail details:', error);
      } else if (data) {
        const getLangValue = (field) => data[`${field}_${lang}`] || data[`${field}_en`];

        setCocktail({
          ...data,
          name: getLangValue('name'),
          description: getLangValue('description'),
          instructions: getLangValue('instructions'),
          history: getLangValue('history'),
          ingredients: data.ingredients?.map(ci => ({
            ...ci.details,
            quantity: ci.quantity,
            unit: ci.unit,
            notes: ci.notes,
          })) || [],
        });
      }
      setLoading(false);
    };

    fetchCocktail();
  }, [cocktailId, i18n.language]);

  const isMakeableBar1 = useMemo(() =>
    checkMakeableForBar(cocktail?.ingredients, barAStock),
    [cocktail?.ingredients, barAStock]
  );
  const isMakeableBar2 = useMemo(() =>
    checkMakeableForBar(cocktail?.ingredients, barBStock),
    [cocktail?.ingredients, barBStock]
  );

  const bar1Name = barsData.bar1?.barName || 'Bar 1';
  const bar2Name = barsData.bar2?.barName || 'Bar 2';

  if (loading) {
    return <PageWrapper theme={theme}><p>{t('loading')}</p></PageWrapper>;
  }

  if (!cocktail) {
    return <PageWrapper theme={theme}><p>{t('cocktailNotFound')}</p></PageWrapper>;
  }

  const currentIsFavorite = isFavorite(cocktail.id);

  return (
    <PageWrapper theme={theme}>
      <CocktailHeader>
        <CocktailNameWrapper>
          <CocktailName>{cocktail.name}</CocktailName>
          <FavoriteButtonDetail
            isFavorite={currentIsFavorite}
            onClick={() => toggleFavorite(cocktail.id)}
            title={currentIsFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            theme={theme}
          >
            {currentIsFavorite ? '♥' : '♡'}
          </FavoriteButtonDetail>
        </CocktailNameWrapper>
        <CocktailImage src={getImageUrl(cocktail.image)} alt={cocktail.name} />
        
        <AllBarsAvailabilityWrapper theme={theme}>
          <IndividualBarStatus theme={theme} isAvailable={isMakeableBar1}>
            {bar1Name}: {isMakeableBar1 ? t('available') : t('unavailable')}
          </IndividualBarStatus>
          <IndividualBarStatus theme={theme} isAvailable={isMakeableBar2}>
            {bar2Name}: {isMakeableBar2 ? t('available') : t('unavailable')}
          </IndividualBarStatus>
        </AllBarsAvailabilityWrapper>
      </CocktailHeader>

      <CocktailDetailsGrid>
        <DetailSection theme={theme}>
          <h2>{t('ingredients')}</h2>
          <IngredientList>
            {cocktail.ingredients.map(ing => (
              <IngredientListItem key={ing.id} theme={theme}>
                {ing.quantity} {ing.name} {ing.notes ? `(${ing.notes})` : ''}
              </IngredientListItem>
            ))}
          </IngredientList>
        </DetailSection>

        <DetailSection theme={theme}>
          <h2>{t('instructions')}</h2>
          <ol>
            {cocktail.instructions.map((step, index) => (
              <li key={index} style={{ marginBottom: theme.spacing.small }}>{step}</li>
            ))}
          </ol>
        </DetailSection>

        <DetailSection theme={theme}>
          <h2>{t('details')}</h2>
          <p>
            <strong>{t('glass')}:</strong>{' '}
            {(() => {
              if (Array.isArray(cocktail.glass)) {
                return cocktail.glass.map(glassName => (
                  <FilterLinkTag 
                    key={glassName.trim()} 
                    to={`/cocktails/filter/glass/${encodeURIComponent(glassName.trim())}`}
                  >
                    {glassName.trim()}
                  </FilterLinkTag>
                ));
              } else if (typeof cocktail.glass === 'string') {
                return (
                  <FilterLinkTag 
                    to={`/cocktails/filter/glass/${encodeURIComponent(cocktail.glass.trim())}`}
                  >
                    {cocktail.glass.trim()}
                  </FilterLinkTag>
                );
              } else {
                return 'N/A';
              }
            })()}
          </p>
          <p>
            <strong>{t('difficulty')}:</strong>{' '}
            {cocktail.difficulty ? (
              <FilterLinkTag 
                to={`/cocktails/filter/difficulty/${encodeURIComponent(cocktail.difficulty.toLowerCase())}`}
              >
                {cocktail.difficulty}
              </FilterLinkTag>
            ) : (
              'N/A' 
            )}
          </p>
          {cocktail.tags && cocktail.tags.length > 0 && (
            <p>
              <strong>{t('tags')}:</strong>{' '}
              {cocktail.tags.map(tag => (
                <FilterLinkTag key={tag} to={`/cocktails/filter/tag/${encodeURIComponent(tag)}`}>
                  {tag}
                </FilterLinkTag>
              ))}
            </p>
          )}
          {cocktail.flavorProfile && cocktail.flavorProfile.length > 0 && (
            <p>
              <strong>{t('flavorProfile')}:</strong>{' '}
              {cocktail.flavorProfile.map(flavor => (
                <FilterLinkTag key={flavor} to={`/cocktails/filter/flavor/${encodeURIComponent(flavor)}`}>
                  {flavor}
                </FilterLinkTag>
              ))}
            </p>
          )}
        </DetailSection>
        
        {cocktail.history && (
          <DetailSection theme={theme}>
            <h2>{t('history')}</h2>
            <p>{cocktail.history}</p>
          </DetailSection>
        )}
      </CocktailDetailsGrid>
    </PageWrapper>
  );
};

export default CocktailPage;
