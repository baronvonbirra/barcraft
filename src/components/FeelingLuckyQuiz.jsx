import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { BarContext } from '../contexts/BarContext';
import CocktailImageBase from './CocktailImage';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
  width: 90%;
  max-width: 600px;
  animation: ${slideUp} 0.4s ease-out;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.medium};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const Question = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const Answers = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
`;

const AnswerCard = styled.button`
  background-color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    transform: translateY(-5px);
  }
`;

const LoadingAnimation = styled.div`
  text-align: center;
  font-size: 1.2rem;
  padding: ${({ theme }) => theme.spacing.large};
`;

const ResultWrapper = styled.div`
  text-align: center;
`;

const CocktailImage = styled(CocktailImageBase)`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ViewRecipeButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const RetakeQuizButton = styled.button`
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.medium};
  margin-left: ${({ theme }) => theme.spacing.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }
`;


const FeelingLuckyQuiz = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { bar } = useContext(BarContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizData, setQuizData] = useState({ themes: [], flavors: [], spirits: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedCocktail, setRecommendedCocktail] = useState(null);
  const [isFinding, setIsFinding] = useState(false);

  const quizQuestions = [
    {
      id: 'theme',
      question: t('quiz.question1'),
      answers: quizData.themes,
    },
    {
      id: 'flavor',
      question: t('quiz.question2'),
      answers: [
        { name: t('quiz.flavorSweet'), value: ['sweet', 'creamy', 'fruity'] },
        { name: t('quiz.flavorTart'), value: ['sour', 'herbal', 'citrus'] },
        { name: t('quiz.flavorBold'), value: ['bitter', 'smoky', 'spirit-forward'] },
      ],
    },
    {
      id: 'spirit',
      question: t('quiz.question3'),
      answers: quizData.spirits,
    },
  ];

  useEffect(() => {
    if (!bar) {
      console.error("Bar context is not available");
      return;
    }

    const fetchQuizData = async () => {
      setIsLoading(true);
      setError(null);
      resetQuiz();
      const lang = i18n.language;

      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select(`id, name_${lang}, name_en, type`);

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        setError('Failed to load quiz data. Please try again later.');
      } else {
        const themes = categories.filter(c => c.type === 'theme').map(c => ({ ...c, name: c[`name_${lang}`] || c.name_en }));
        const spirits = categories.filter(c => c.type === 'spirit').map(c => ({ ...c, name: c[`name_${lang}`] || c.name_en }));
        setQuizData(prev => ({ ...prev, themes, spirits }));
      }
      setIsLoading(false);
    };

    if (isOpen) {
      fetchQuizData();
    }
  }, [isOpen, i18n.language]);

  const handleAnswerClick = (questionId, answerValue) => {
    const newUserAnswers = { ...userAnswers, [questionId]: answerValue };
    setUserAnswers(newUserAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(quizQuestions.length);
      findCocktail(newUserAnswers);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setRecommendedCocktail(null);
  };

  const findCocktail = async (answers, broadenSearch = false) => {
    setIsFinding(true);
    const lang = i18n.language;
    const stockColumn = bar === 'bar1' ? 'bar1_stock' : 'bar2_stock';

    let query = supabase.from('cocktails').select(`id, name_${lang}, name_en, image, description_${lang}, description_en, thematic_categories, flavor_profile, spirit_category_id`).gt(stockColumn, 0);

    if (answers.theme) {
      query = query.contains('thematic_categories', [answers.theme]);
    }
    if (answers.flavor && !broadenSearch) {
      query = query.overlaps('flavor_profile', answers.flavor);
    }
    if (answers.spirit) {
      query = query.eq('spirit_category_id', answers.spirit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cocktails:', error);
      setIsFinding(false);
      return;
    }

    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const cocktail = data[randomIndex];
      setRecommendedCocktail({
        ...cocktail,
        name: cocktail[`name_${lang}`] || cocktail.name_en,
        description: cocktail[`description_${lang}`] || cocktail.description_en,
      });
    } else if (!broadenSearch) {
      // Broaden the search by ignoring flavor
      findCocktail(answers, true);
    } else {
      setRecommendedCocktail(null); // No cocktail found even with broadened search
    }

    setIsFinding(false);
  };

  if (!isOpen) return null;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {error ? (
          <p>{error}</p>
        ) : isFinding ? (
          <LoadingAnimation>{t('quiz.mixing')}</LoadingAnimation>
        ) : recommendedCocktail ? (
          <ResultWrapper>
            <h2>{t('quiz.recommendation')}</h2>
            <CocktailImage src={recommendedCocktail.image} alt={recommendedCocktail.name} />
            <h3>{recommendedCocktail.name}</h3>
            <p>{recommendedCocktail.description}</p>
            <ViewRecipeButton to={`/cocktails/${recommendedCocktail.id}`} onClick={onClose}>{t('viewRecipe')}</ViewRecipeButton>
            <RetakeQuizButton onClick={resetQuiz}>{t('quiz.retake')}</RetakeQuizButton>
          </ResultWrapper>
        ) : isLoading ? (
          <p>Loading quiz...</p>
        ) : currentQuestion ? (
          <>
            <Question>{currentQuestion.question}</Question>
            <Answers>
              {currentQuestion.answers.map((answer, index) => (
                <AnswerCard key={index} onClick={() => handleAnswerClick(currentQuestion.id, answer.value || answer.id)}>
                  {answer.name}
                </AnswerCard>
              ))}
            </Answers>
          </>
        ) : (
           <ResultWrapper>
            <h2>{t('quiz.noMatch')}</h2>
            <p>{t('quiz.noMatchSuggestion')}</p>
            <RetakeQuizButton onClick={resetQuiz}>{t('quiz.retake')}</RetakeQuizButton>
          </ResultWrapper>
        )}
      </Modal>
    </Overlay>
  );
};

export default FeelingLuckyQuiz;