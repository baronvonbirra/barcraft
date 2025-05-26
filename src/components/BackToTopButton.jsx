// src/components/BackToTopButton.jsx
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components'; // Removed { css } as it's not used
import { ThemeContext } from '../contexts/ThemeContext'; // For theme access

const ButtonWrapper = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.large};
  right: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  border-radius: 50%; // For a circular button
  width: 50px;       // Adjust size
  height: 50px;      // Adjust size
  font-size: 1.5rem; // Adjust icon size
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'scale(1)' : 'scale(0.5)')};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')}; // Added for better accessibility and performance
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease; // Added visibility to transition
  z-index: 1000; // Ensure it's above other content

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary}; // Or a darker primary
  }
`;

const BackToTopButton = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Only render the button if the theme is available to avoid errors during initial context setup
  // (though with the current setup, theme should always be available)
  if (!theme) return null; 

  return (
    <ButtonWrapper
      theme={theme} // Pass theme explicitly if styled-components < v5 or outside ThemeProvider
      onClick={scrollToTop}
      isVisible={isVisible}
      aria-label="Scroll to top"
      title="Scroll to top" // Tooltip for mouse users
    >
      ↑ {/* Replace with a proper icon if available */}
    </ButtonWrapper>
  );
};

export default BackToTopButton;
