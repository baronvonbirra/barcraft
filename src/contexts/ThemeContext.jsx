import React, { createContext, useState } from 'react';

// New Modern Dark Theme
const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1D24',
    surface: '#282C34',
    primary: '#3498DB',   // Modern Blue
    secondary: '#1ABC9C', // Teal
    text: '#EAEAEA',
    textOffset: '#A0A0A0', // Lighter gray for less prominent text
    onPrimary: '#FFFFFF',
    onSurface: '#EAEAEA', // Text on surface elements
    border: '#3A3F4B',
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
  shadows: { // Adding a shadow definition
    small: '0 2px 4px rgba(0,0,0,0.2)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
  },
  borderRadius: '8px', // Base border radius
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
