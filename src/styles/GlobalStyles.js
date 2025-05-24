import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@500;600;700&display=swap');

  html {
    font-size: 16px; /* Base font size */
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.main};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    font-family: ${({ theme }) => theme.fonts.headings};
    color: ${({ theme }) => theme.colors.primary}; // Example: Headings use primary color
    font-weight: 600; // A common weight for Poppins
  }

  h1 { font-size: 2.5rem; } // Example sizes
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }


  p {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.large};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }

  button {
    font-family: ${({ theme }) => theme.fonts.main};
    cursor: pointer;
  }
`;

export default GlobalStyles;
