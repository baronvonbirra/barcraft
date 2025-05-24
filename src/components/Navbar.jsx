import React, { useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom'; // Import useLocation
import styled, { ThemeContext } from 'styled-components';
import { ThemeContext as CustomThemeContext } from '../contexts/ThemeContext'; // Renamed to avoid conflict
import BarSelector from './BarSelector';

const NavWrapper = styled.nav`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

// Updated NavLinkStyled to use the NavLink's active class for styling
// This is more standard for react-router-dom v6
const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textOffset}; // Default color
  font-weight: normal; // Default font weight (could use theme.fontWeights.normal)
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  // NavLink adds the 'active' class by default
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold; // Could use theme.fontWeights.bold
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface}; // Or a slightly different shade
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Styled component for the Logo
const LogoLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.headings || 'Arial, sans-serif'};
  font-size: 2rem; /* Adjust size as needed */
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: bold; // Could use theme.fontWeights.bold
`;

const Navbar = () => {
  const { theme, toggleTheme } = useContext(CustomThemeContext);
  // useLocation and isActive are not strictly needed if NavLink's default 'active' class is used for styling
  // const location = useLocation(); 
  // const isActive = (path) => location.pathname === path;

  return (
    <NavWrapper>
      <LogoLink to="/">BarCraft</LogoLink>
      <NavLinks>
        {/* NavLink's 'end' prop is important for the Home link to not stay active for other routes */}
        <NavLinkStyled to="/" end>Home</NavLinkStyled>
        <NavLinkStyled to="/favorites">My Favorites</NavLinkStyled>
        <BarSelector />
      </NavLinks>
      <ToggleButton onClick={toggleTheme}>
        Switch to {theme.name === 'light' ? 'Dark' : 'Light'} Theme
      </ToggleButton>
    </NavWrapper>
  );
};

export default Navbar;
