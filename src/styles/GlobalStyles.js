import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;700&display=swap');

  html {
    font-size: 16px; /* Base font size */
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.main};
    line-height: 1.7;
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
    color: ${({ theme }) => theme.colors.text}; // Using text color for better readability
    font-weight: 700; // Default to bold for Playfair Display
  }

  h1 { font-size: 2.75rem; font-weight: 700; }
  h2 { font-size: 2.25rem; font-weight: 700; }
  h3 { font-size: 1.75rem; font-weight: 700; }
  h4 { font-size: 1.5rem; font-weight: 400; } // Regular weight for h4
  h5 { font-size: 1.25rem; font-weight: 400; } // Regular weight for h5
  h6 { font-size: 1rem; font-weight: 400; }   // Regular weight for h6


  p {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    line-height: 1.7; // Explicitly set for paragraphs
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

  /* Webkit Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textOffset};
  }
`;

export default GlobalStyles;
