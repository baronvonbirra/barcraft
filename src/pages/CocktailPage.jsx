import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useBar } from '../contexts/BarContext';
import { useFavorites } from '../hooks/useFavorites';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import CocktailImageBase from '../components/CocktailImage';

// Styled Components
const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
  animation: fadeInPage 0.5s ease-out forwards;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0; // For edge-to-edge mobile hero
  }
`;

const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    padding: ${({ theme }) => theme.spacing.large} 0;
  }
`;

const ImageColumn = styled.div`
  width: 100%;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.medium};

  @media (min-width: 768px) {
    padding: 0;
  }
`;

const CocktailImage = styled(CocktailImageBase)`
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;

  @media (min-width: 768px) {
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const CocktailHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CocktailNameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CocktailName = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2.5rem;
  margin: 0;
`;

const FavoriteButtonDetail = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isFavorite'
})`
  background: transparent;
  border: none;
  color: ${props => props.isFavorite ? props.theme.colors.primary : props.theme.colors.textOffset};
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: transform 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.secondary};
    transform: scale(1.1);
  }
`;

const StatusPillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const StatusPill = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textOffset};
`;

const StatusDot = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isAvailable'
})`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.isAvailable ? '#4CAF50' : '#F44336'};
  margin-right: 8px;
`;

const CocktailDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textOffset};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const HistorySection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  font-style: italic;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textOffset};
  opacity: 0.9;
`;

const BottomSectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.medium};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    padding: 0;
  }
`;

const DetailSection = styled.section`
  h2 {
    font-family: ${({ theme }) => theme.fonts.headings};
    color: ${({ theme }) => theme.colors.primary};
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    font-size: 1.75rem;
  }

  ol {
    padding-left: 1.5rem;
    text-align: left;
  }
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientListItem = styled.li`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
`;

const FilterLinkTag = styled(Link)`
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.textOffset};
  padding: 4px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  text-decoration: none;
  margin-right: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }
`;

const checkMakeableForBar = (cocktailIngredients, barStockSet) => {
  if (!cocktailIngredients || cocktailIngredients.length === 0) return true;
  return cocktailIngredients.every(ing => barStockSet.has(ing.id));
};

const CocktailPage = () => {
  const { cocktailId } = useParams();
  const { theme } = useContext(ThemeContext);
  const { barAStock, barBStock } = useBar();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { i18n, t } = useTranslation();
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCocktail = async () => {
      setLoading(true);
      const lang = i18n.language;

      const { data, error } = await supabase
        .from('cocktails')
        .select('*')
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

  if (loading) return <PageWrapper theme={theme}><p>{t('loading')}</p></PageWrapper>;
  if (!cocktail) return <PageWrapper theme={theme}><p>{t('cocktailNotFound')}</p></PageWrapper>;

  const currentIsFavorite = isFavorite(cocktail.id);

  return (
    <PageWrapper theme={theme}>
      <HeroSection theme={theme}>
        <ImageColumn>
          <CocktailImage src={cocktail.image} alt={cocktail.name} theme={theme} />
        </ImageColumn>
        
        <InfoColumn theme={theme}>
          <CocktailHeader>
            <CocktailNameWrapper>
              <CocktailName theme={theme}>{cocktail.name}</CocktailName>
              <FavoriteButtonDetail
                isFavorite={currentIsFavorite}
                onClick={() => toggleFavorite(cocktail.id)}
                title={currentIsFavorite ? t('removeFromFavorites') : t('addToFavorites')}
                theme={theme}
              >
                {currentIsFavorite ? '♥' : '♡'}
              </FavoriteButtonDetail>
            </CocktailNameWrapper>

            <StatusPillsContainer theme={theme}>
              <StatusPill theme={theme}>
                <StatusDot isAvailable={isMakeableBar1} />
                {t('navigation.levelOne')}: {isMakeableBar1 ? t('available') : t('unavailable')}
              </StatusPill>
              <StatusPill theme={theme}>
                <StatusDot isAvailable={isMakeableBar2} />
                {t('navigation.theGlitch')}: {isMakeableBar2 ? t('available') : t('unavailable')}
              </StatusPill>
            </StatusPillsContainer>
          </CocktailHeader>

          {cocktail.description && (
            <CocktailDescription theme={theme}>{cocktail.description}</CocktailDescription>
          )}

          {!isMobile && cocktail.history && (
            <HistorySection theme={theme}>{cocktail.history}</HistorySection>
          )}

          <div style={{ marginTop: theme.spacing.medium }}>
            {cocktail.glass && (
              <p><strong>{t('glass')}:</strong> {
                Array.isArray(cocktail.glass)
                  ? cocktail.glass.map(g => <FilterLinkTag key={g} to={`/cocktails/filter/glass/${encodeURIComponent(g.trim())}`} theme={theme}>{g.trim()}</FilterLinkTag>)
                  : <FilterLinkTag to={`/cocktails/filter/glass/${encodeURIComponent(cocktail.glass.trim())}`} theme={theme}>{cocktail.glass.trim()}</FilterLinkTag>
              }</p>
            )}
            {cocktail.difficulty && (
              <p><strong>{t('difficulty')}:</strong> <FilterLinkTag to={`/cocktails/filter/difficulty/${encodeURIComponent(cocktail.difficulty.toLowerCase())}`} theme={theme}>{cocktail.difficulty}</FilterLinkTag></p>
            )}
            {cocktail.tags?.length > 0 && (
              <p><strong>{t('tags')}:</strong> {cocktail.tags.map(tag => <FilterLinkTag key={tag} to={`/cocktails/filter/tag/${encodeURIComponent(tag)}`} theme={theme}>{tag}</FilterLinkTag>)}</p>
            )}
          </div>
        </InfoColumn>
      </HeroSection>

      <BottomSectionGrid theme={theme}>
        <DetailSection theme={theme}>
          <h2>{t('ingredients')}</h2>
          <IngredientList>
            {cocktail.ingredients.map(ing => (
              <IngredientListItem key={ing.id} theme={theme}>
                <span>{ing.name} {ing.notes ? `(${ing.notes})` : ''}</span>
                <span style={{ color: theme.colors.textOffset }}>{ing.quantity}</span>
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
      </BottomSectionGrid>

      {isMobile && cocktail.history && (
        <DetailSection theme={theme} style={{ padding: theme.spacing.medium }}>
          <h2>{t('history')}</h2>
          <p>{cocktail.history}</p>
        </DetailSection>
      )}
    </PageWrapper>
  );
};

export default CocktailPage;
