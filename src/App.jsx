import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as CustomThemeProvider, ThemeContext } from './contexts/ThemeContext';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles'; // Import GlobalStyles
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CocktailPage from './pages/CocktailPage';
import FavoritesPage from './pages/FavoritesPage'; // Add this import

// Basic App layout styling
const AppWrapper = styled.div`
  max-width: 1200px; // Example max-width for content
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
  text-align: center;
`;

const AppContent = () => {
  const { theme } = useContext(ThemeContext); // Get the theme object

  return (
    <StyledComponentsThemeProvider theme={theme}>
      <GlobalStyles /> {/* Add GlobalStyles here */}
      <Router>
        <AppWrapper>
          <Navbar />
          <main> {/* Added a main tag for semantic HTML and content separation */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} /> {/* Add this route */}
              <Route path="/cocktails/:cocktailId" element={<CocktailPage />} />
            </Routes>
          </main>
        </AppWrapper>
      </Router>
    </StyledComponentsThemeProvider>
  );
};

import { BarProvider } from './contexts/BarContext';

function App() {
  return (
    <CustomThemeProvider>
      <BarProvider>
        <AppContent />
      </BarProvider>
    </CustomThemeProvider>
  );
}

export default App;
