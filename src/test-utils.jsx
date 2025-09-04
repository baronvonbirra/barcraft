import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { BarContext } from '@/contexts/BarContext.jsx';
import { FavoritesContext } from '@/contexts/FavoritesContext.jsx';
import cocktails from '@/data/cocktails.json';
import categories from '@/data/categories.json';

const mockTheme = {
  mode: 'dark',
  colors: {
    background: '#1A1D24', surface: '#282C34', primary: '#3498DB', secondary: '#1ABC9C',
    text: '#EAEAEA', textOffset: '#A0A0A0', onPrimary: '#FFFFFF', onSurface: '#EAEAEA', border: '#3A3F4B',
  },
  fonts: { main: "'Inter', sans-serif", headings: "'Poppins', sans-serif" },
  spacing: { xs: '4px', small: '8px', medium: '16px', large: '24px', xl: '32px', xxl: '48px' },
  shadows: { small: '0 2px 4px rgba(0,0,0,0.2)', medium: '0 4px 8px rgba(0,0,0,0.3)' },
  borderRadius: '8px',
};

const AllTheProviders = ({ children, providerProps = {} }) => {
  const defaultBarContext = {
    barName: 'Bar A',
    setBarName: () => {},
    barAStock: new Set(),
    barBStock: new Set(),
    loading: false,
    error: null,
  };

  const defaultFavoritesContext = {
    favorites: new Set(),
    addFavorite: () => {},
    removeFavorite: () => {},
    isFavorite: () => false,
  };

  const barContextValue = { ...defaultBarContext, ...providerProps.barContext };
  const favoritesContextValue = { ...defaultFavoritesContext, ...providerProps.favoritesContext };

  return (
    <ThemeProvider theme={mockTheme}>
      <BarContext.Provider value={barContextValue}>
        <FavoritesContext.Provider value={favoritesContextValue}>
          <MemoryRouter>
            {children}
          </MemoryRouter>
        </FavoritesContext.Provider>
      </BarContext.Provider>
    </ThemeProvider>
  );
};


const renderWithProviders = (ui, options = {}) => {
    const { providerProps, ...renderOptions } = options;
    return render(ui, {
      wrapper: (props) => <AllTheProviders {...props} providerProps={providerProps} />,
      ...renderOptions,
    });
  };

export * from '@testing-library/react';
export { renderWithProviders };
