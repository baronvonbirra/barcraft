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

// Light theme object removed.

// Updated ThemeContext to only provide the theme, no toggleTheme function.
// The default value for toggleTheme can be a no-op function or undefined if consumers handle it.
// For simplicity, as we are removing toggleTheme, we can remove it from the default context value.
export const ThemeContext = createContext({ theme: darkTheme });

export const ThemeProvider = ({ children }) => {
  // State and toggleTheme function are removed as we only have one theme.
  return (
    // Provide darkTheme directly.
    <ThemeContext.Provider value={{ theme: darkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
