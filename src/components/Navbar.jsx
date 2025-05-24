import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavWrapper = styled.nav`
  background-color: ${({ theme }) => (theme.colors && theme.colors.surface) || '#282C34'}; 
  padding: ${({ theme }) => (theme.spacing && theme.spacing.medium) || '1rem'} ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  margin-bottom: ${({ theme }) => (theme.spacing && theme.spacing.large) || '1.5rem'};
  border-bottom: 1px solid ${({ theme }) => (theme.colors && theme.colors.border) || '#3A3F4B'};
  box-shadow: ${({ theme }) => (theme.shadows && theme.shadows.small) || '0 2px 4px rgba(0,0,0,0.2)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleLink = styled(Link)`
  text-decoration: none;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => (theme.fonts && theme.fonts.headings) || "'Poppins', sans-serif"};
  color: ${({ theme }) => (theme.colors && theme.colors.primary) || '#3498DB'};
  margin: 0; /* Remove default margin from h1, GlobalStyles handles font-size and weight */
  letter-spacing: 1px; 
`;

// Placeholder for a theme toggle button if you add one later
// const ThemeToggleButton = styled.button` ... `;

const Navbar = () => {
  return (
    <NavWrapper>
      <TitleLink to="/">
        <Title>BarCraft</Title>
      </TitleLink>
      {/* <ThemeToggleButton>Toggle</ThemeToggleButton> */}
    </NavWrapper>
  );
};

export default Navbar;
