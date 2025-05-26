import React, { createContext, useState } from 'react';

// New Modern Dark Theme
const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1A1A', // Deep Charcoal
    surface: '#2C2C2C', // Slightly Lighter Charcoal/Dark Grey for cards, modals
    primary: '#B08D57',   // Muted Gold
    secondary: '#0A4D68', // Deep Sapphire Blue
    text: '#EAEAEA', // Off-White
    textOffset: '#A0A0A0', // Light Grey for secondary text/captions
    onPrimary: '#111111', // Text on primary accent color (updated for contrast)
    onSecondary: '#FFFFFF', // Text on secondary accent color
    onSurface: '#EAEAEA', // Text on surface elements
    border: '#444444', // Subtle dark grey border
  },
  fonts: {
    main: "'Inter', sans-serif",
    headings: "'Playfair Display', serif", // Sophisticated Serif
  },
  spacing: {
    xs: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xl: '32px',
    xxl: '48px',
  },
  shadows: {
    small: '0 2px 5px rgba(0,0,0,0.3)', // Slightly more pronounced for dark theme
    medium: '0 5px 10px rgba(0,0,0,0.4)', // Slightly more pronounced for dark theme
  },
  borderRadius: '6px', // A slightly more refined radius
};

// New Modern Light Theme
const lightTheme = {
  mode: 'light',
  colors: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    primary: '#3498DB',   // Consistent Modern Blue
    secondary: '#1ABC9C', // Consistent Teal
    text: '#212529',
    textOffset: '#6C757D', // Darker gray for less prominent text
    onPrimary: '#FFFFFF',
    onSurface: '#212529', // Text on surface elements
    border: '#DEE2E6',
  },
  fonts: {
    main: "'Inter', sans-serif",
    headings: "'Poppins', sans-serif",
  },
  spacing: {
    xs: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xl: '32px',
    xxl: '48px',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.05)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
  },
  borderRadius: '8px',
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
