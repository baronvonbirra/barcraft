import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as CustomThemeProvider, ThemeContext } from './contexts/ThemeContext';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CategoriesOverviewPage from './pages/CategoriesOverviewPage';
import CocktailPage from './pages/CocktailPage';
import FavoritesPage from './pages/FavoritesPage';
import BarSpecificPage from './pages/BarSpecificPage';
import FilteredCocktailListPage from './pages/FilteredCocktailListPage';
import BackToTopButton from './components/BackToTopButton';
import ScrollToTop from './components/ScrollToTop';
import AdminPage from './pages/AdminPage';

// Basic App layout styling
const AppWrapper = styled.div`
  max-width: 1200px; // Example max-width for content
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
  text-align: center;
`;

const AppContent = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <StyledComponentsThemeProvider theme={theme}>
      <GlobalStyles />
      <Router basename="/barcraft">
        <ScrollToTop />
        <AppWrapper>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesOverviewPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/cocktails/:cocktailId" element={<CocktailPage />} />
              <Route path="/bar/:barId" element={<BarSpecificPage />} />
              <Route path="/cocktails/filter/:filterType/:filterValue" element={<FilteredCocktailListPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </AppWrapper>
      </Router>
      <BackToTopButton />
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
