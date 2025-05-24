import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavWrapper = styled.nav`
  background-color: ${({ theme }) => theme.colors.surface}; 
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between; // Aligns title to left, theme toggle to right
  align-items: center;
`;

const TitleLink = styled(Link)`
  text-decoration: none;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2.5rem; // Larger size for the main title
  margin: 0; // Remove default margin from h1
  font-weight: bold;
  letter-spacing: 1px; // Slight letter spacing for elegance
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
