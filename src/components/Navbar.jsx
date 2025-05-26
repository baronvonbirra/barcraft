import React, { useState, useContext } from 'react'; // Added useState
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeContext as CustomThemeContext } from '../contexts/ThemeContext';
import BarSelector from './BarSelector';

const NavWrapper = styled.nav`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; // For positioning the mobile menu
`;

const LogoLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.headings};
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  z-index: 101; // Ensure logo is above mobile menu overlay

  @media (max-width: 768px) {
    font-size: 1.5rem; // Slightly smaller logo on mobile
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};

  @media (max-width: 768px) {
    display: none; // Hide regular nav links on mobile
  }
`;

const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.main};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent; // For active state indication

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    /* background-color: rgba(${({ theme }) => theme.colors.primary}, 0.1); // Assuming direct rgba usage */
    /* For now, direct color value for hover background if theme.fn.rgba is not available */
    background-color: ${({ theme }) => theme.mode === 'dark' ? 'rgba(176, 141, 87, 0.1)' : 'rgba(52, 152, 219, 0.1)'};

  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const ToggleButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    box-shadow: ${({ theme }) => theme.shadows.small};
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    // Optionally hide theme toggle or make it smaller on mobile if space is an issue
    // For now, let's keep it, but ensure it doesn't clash with hamburger
    margin-left: auto; // Pushes it away from hamburger if hamburger is on the right
  }
`;

const HamburgerIcon = styled.button`
  display: none; // Hidden by default
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem; // Adjust size as needed
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.small};
  z-index: 101; // Ensure hamburger is above mobile menu overlay

  @media (max-width: 768px) {
    display: block; // Show on mobile
  }

  /* Styling for the actual hamburger lines */
  span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.text};
    margin: 5px 0;
    transition: all 0.3s ease;
  }

  ${({ isOpen }) => isOpen && `
    span:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }
  `}
`;

const MobileMenu = styled.div`
  display: none; // Hidden by default
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.large} 0; // Generous padding for tappability
  position: absolute;
  top: 0; // Align with NavWrapper top
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100; // Below logo/hamburger but above page content
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};


  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')}; // Show/hide based on state
  }

  ${NavLinkStyled} { // Target NavLinkStyled within MobileMenu
    padding: ${({ theme }) => theme.spacing.medium};
    width: 80%;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}; // Separator for links
    
    &:last-child {
      border-bottom: none;
    }

    &.active {
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary}; // Keep active style consistent
    }
  }
`;


const RightNavContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;


const Navbar = () => {
  const { theme, toggleTheme } = useContext(CustomThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuId = "mobile-menu"; // Define an ID for ARIA

  const handleLinkClick = () => {
    setIsOpen(false); // Close mobile menu when a link is clicked
  };

  return (
    <NavWrapper>
      <LogoLink to="/" onClick={handleLinkClick}>BarCraft</LogoLink>
      
      <NavLinks>
        <NavLinkStyled to="/" end onClick={handleLinkClick}>Home</NavLinkStyled>
        <NavLinkStyled to="/categories" onClick={handleLinkClick}>Categories</NavLinkStyled>
        <NavLinkStyled to="/favorites" onClick={handleLinkClick}>My Favorites</NavLinkStyled>
        <BarSelector />
      </NavLinks>

      <RightNavContent>
        <ToggleButton onClick={toggleTheme}>
          Switch to {theme.mode === 'dark' ? 'Light' : 'Dark'} Theme
        </ToggleButton>
        <HamburgerIcon
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls={mobileMenuId}
        >
          <span />
          <span />
          <span />
        </HamburgerIcon>
      </RightNavContent>

      <MobileMenu isOpen={isOpen} id={mobileMenuId}>
        <NavLinkStyled to="/" end onClick={handleLinkClick}>Home</NavLinkStyled>
        <NavLinkStyled to="/categories" onClick={handleLinkClick}>Categories</NavLinkStyled>
        <NavLinkStyled to="/favorites" onClick={handleLinkClick}>My Favorites</NavLinkStyled>
        {/* BarSelector might be too complex for mobile nav, or needs mobile-specific styling */}
        {/* For now, let's include it and see. It might be better placed elsewhere on mobile. */}
        <BarSelector /> 
      </MobileMenu>
    </NavWrapper>
  );
};

export default Navbar;
