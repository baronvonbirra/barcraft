import React, { createContext, useState } from 'react';

// Define a more complete dark theme
const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#121212', // Very dark grey, almost black
    surface: '#1E1E1E',    // Dark grey for cards, surfaces
    primary: '#BB86FC',   // Purple accent (Material Design dark theme guideline)
    secondary: '#03DAC6', // Teal accent
    text: '#E0E0E0',       // Light grey for text
    onPrimary: '#000000',  // Text/icon color on primary background
    onSurface: '#FFFFFF',  // Text/icon color on surface background
    border: '#2c2c2c',     // Subtle border color
  },
  fonts: {
    main: 'Helvetica Neue, Arial, sans-serif',
    headings: 'Georgia, serif', // Example for distinct heading font
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  }
};

// Define a light theme for toggling (optional for now, but good structure)
const lightTheme = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#6200EE',
    secondary: '#03DAC6',
    text: '#000000',
    onPrimary: '#FFFFFF',
    onSurface: '#000000',
    border: '#DDDDDD',
  },
  fonts: {
    main: 'Helvetica Neue, Arial, sans-serif',
    headings: 'Georgia, serif',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  }
};

export const ThemeContext = createContext({ theme: darkTheme, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme.mode === 'dark' ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
