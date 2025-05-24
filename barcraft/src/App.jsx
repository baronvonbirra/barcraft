import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles'; // Import GlobalStyles
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CocktailPage from './pages/CocktailPage';

// Basic App layout styling
const AppWrapper = styled.div`
  max-width: 1200px; // Example max-width for content
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
  text-align: center;
`;

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles /> {/* Add GlobalStyles here */}
      <Router>
        <AppWrapper>
          <Navbar />
          <main> {/* Added a main tag for semantic HTML and content separation */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/cocktails/:cocktailId" element={<CocktailPage />} />
            </Routes>
          </main>
        </AppWrapper>
      </Router>
    </ThemeProvider>
  );
}

export default App;
