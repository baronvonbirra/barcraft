import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.onPrimary}; // Assuming onPrimary is suitable for secondary background
  border: none;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.headings};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  display: block; // Make it a block element for easier placement if needed
  width: 100%; // Make it full width of its container by default

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}; // Example hover effect
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textOffset};
    cursor: not-allowed;
  }
`;

const SurpriseMeButton = ({ filteredCocktails, currentFiltersActive }) => {
  const navigate = useNavigate();

  const handleSurpriseMe = () => {
    if (!filteredCocktails || filteredCocktails.length === 0) {
      alert("No cocktails match your current mood! Try adjusting your filters.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredCocktails.length);
    const randomCocktail = filteredCocktails[randomIndex];
    navigate(`/cocktails/${randomCocktail.id}`);
  };
  
  const isDisabled = (!filteredCocktails || filteredCocktails.length === 0);

  return (
    <StyledButton onClick={handleSurpriseMe} disabled={isDisabled}>
      ✨ Surprise Me! ✨
    </StyledButton>
  );
};

export default SurpriseMeButton;
