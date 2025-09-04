import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeContext as CustomThemeContext } from '../contexts/ThemeContext';

const NavWrapper = styled.nav`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const LogoLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.headings};
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  z-index: 101;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.main};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(176, 141, 87, 0.1);
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const HamburgerIcon = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.small};
  z-index: 101;

  @media (max-width: 768px) {
    display: block;
  }

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
  display: none;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.large} 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};


  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  }

  ${NavLinkStyled} {
    padding: ${({ theme }) => theme.spacing.medium};
    width: 80%;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    
    &:last-child {
      border-bottom: none;
    }

    &.active {
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
    }
  }
`;


const RightNavContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;


const Navbar = () => {
  const { theme } = useContext(CustomThemeContext); 
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuId = "mobile-menu";

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <NavWrapper>
      <LogoLink to="/" onClick={handleLinkClick}>BarCraft</LogoLink>
      
      <NavLinks>
        <NavLinkStyled to="/" end onClick={handleLinkClick}>Home</NavLinkStyled>
        <NavLinkStyled to="/categories" onClick={handleLinkClick}>Cocktails</NavLinkStyled>
        <NavLinkStyled to="/favorites" onClick={handleLinkClick}>My Favorites</NavLinkStyled>
        <NavLinkStyled to="/bar/level-one" onClick={handleLinkClick}>Level One</NavLinkStyled>
        <NavLinkStyled to="/bar/the-glitch" onClick={handleLinkClick}>The Glitch</NavLinkStyled>
        <NavLinkStyled to="/admin" onClick={handleLinkClick}>Admin</NavLinkStyled>
      </NavLinks>

      <RightNavContent>
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
        <NavLinkStyled to="/categories" onClick={handleLinkClick}>Cocktails</NavLinkStyled>
        <NavLinkStyled to="/favorites" onClick={handleLinkClick}>My Favorites</NavLinkStyled>
        <NavLinkStyled to="/bar/level-one" onClick={handleLinkClick}>Level One</NavLinkStyled>
        <NavLinkStyled to="/bar/the-glitch" onClick={handleLinkClick}>The Glitch</NavLinkStyled>
        <NavLinkStyled to="/admin" onClick={handleLinkClick}>Admin</NavLinkStyled>
      </MobileMenu>
    </NavWrapper>
  );
};

export default Navbar;
