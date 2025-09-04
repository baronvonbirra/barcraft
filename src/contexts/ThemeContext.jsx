import React, { createContext, useState } from 'react';

const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1A1A',
    surface: '#2C2C2C',
    primary: '#B08D57',
    secondary: '#0A4D68',
    text: '#EAEAEA',
    textOffset: '#A0A0A0',
    onPrimary: '#111111',
    onSecondary: '#FFFFFF',
    onSurface: '#EAEAEA',
    border: '#444444',
  },
  fonts: {
    main: "'Inter', sans-serif",
    headings: "'Playfair Display', serif",
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
    small: '0 2px 5px rgba(0,0,0,0.3)',
    medium: '0 5px 10px rgba(0,0,0,0.4)',
  },
  borderRadius: '6px',
};

export const ThemeContext = createContext({ theme: darkTheme });

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: darkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
